import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Adapted from a space-themed "horizon-hero-section" drop-in: same WebGL
 * starfield/nebula/parallax-mountain mechanics and scroll-driven camera, but
 * recolored to the Aptara navy/teal palette and re-copied to reuse the
 * assessment's own hero/discover/result copy instead of invented sci-fi text.
 * Scroll progress is scoped to this component's own container (not
 * document height) so it plays out fully regardless of what follows it on
 * the page.
 */

interface ThreeState {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  composer: EffectComposer | null
  stars: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>[]
  nebula: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null
  mountains: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>[]
  animationId: number | null
  targetCameraX: number
  targetCameraY: number
  targetCameraZ: number
  locations: number[]
}

const CHAPTERS = [
  {
    title: 'L&D ASSESSMENT',
    lines: [
      'Get a clearer view of your current learning environment,',
      'and discover where your L&D function can create greater impact.',
    ],
  },
  {
    title: 'CLARITY',
    lines: [
      'The assessment looks beyond individual questions',
      'to give you a clearer picture of where your learning function is today.',
    ],
  },
  {
    title: 'DIRECTION',
    lines: ['Turn your responses into a clearer view', 'of what comes next.'],
  },
]

const TOTAL_TRANSITIONS = CHAPTERS.length - 1

function splitTitle(text: string) {
  return text.split('').map((char, i) => (
    <span key={i} className="title-char inline-block">
      {char === ' ' ? ' ' : char}
    </span>
  ))
}

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 })

  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const threeRefs = useRef<ThreeState>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
    targetCameraX: 0,
    targetCameraY: 30,
    targetCameraZ: 100,
    locations: [],
  })

  useEffect(() => {
    const refs = threeRefs.current

    const createStarField = () => {
      const starCount = 4200

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(starCount * 3)
        const colors = new Float32Array(starCount * 3)
        const sizes = new Float32Array(starCount)
        const phases = new Float32Array(starCount)
        const twinkleSpeeds = new Float32Array(starCount)

        // Closer layers read as slightly larger, brighter foreground stars;
        // farther layers are finer background dust.
        const layerSizeScale = [1.15, 0.9, 0.7][i]

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[j * 3 + 2] = radius * Math.cos(phi)

          const color = new THREE.Color()
          const colorChoice = Math.random()
          if (colorChoice < 0.55) {
            color.setHSL(0, 0, 0.85 + Math.random() * 0.15)
          } else if (colorChoice < 0.8) {
            color.setHSL(0.52, 0.6, 0.72) // teal accent (#12859B family)
          } else {
            color.setHSL(0.58, 0.55, 0.72) // navy-blue accent (#205A9E family)
          }

          colors[j * 3] = color.r
          colors[j * 3 + 1] = color.g
          colors[j * 3 + 2] = color.b

          sizes[j] = (Math.random() * 1.4 + 0.4) * layerSizeScale
          phases[j] = Math.random() * Math.PI * 2
          twinkleSpeeds[j] = 0.5 + Math.random() * 1.5
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
        geometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1))

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            attribute float phase;
            attribute float twinkleSpeed;
            varying vec3 vColor;
            varying float vTwinkle;
            uniform float time;
            uniform float depth;

            void main() {
              vColor = color;
              vec3 pos = position;

              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;

              float twinkle = 0.55 + 0.45 * sin(time * twinkleSpeed + phase);
              vTwinkle = twinkle;

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vTwinkle;

            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;

              float core = 1.0 - smoothstep(0.0, 0.18, dist);
              float glow = 1.0 - smoothstep(0.0, 0.5, dist);
              float opacity = clamp(core * 0.6 + glow * 0.6, 0.0, 1.0) * vTwinkle;

              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })

        const stars = new THREE.Points(geometry, material)
        refs.scene!.add(stars)
        refs.stars.push(stars)
      }
    }

    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x071d3d) }, // brand navy
          color2: { value: new THREE.Color(0x12859b) }, // brand teal accent
          opacity: { value: 0.3 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;

          void main() {
            vUv = uv;
            vec3 pos = position;

            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);

            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      const nebula = new THREE.Mesh(geometry, material)
      nebula.position.z = -1050
      refs.scene!.add(nebula)
      refs.nebula = nebula
    }

    const createMountains = () => {
      const layers = [
        { distance: -50, height: 60, color: 0x071d3d, opacity: 1 },
        { distance: -100, height: 80, color: 0x0d2a52, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x12859b, opacity: 0.5 },
        { distance: -200, height: 120, color: 0x205a9e, opacity: 0.35 },
      ]

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = []
        const segments = 50

        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000
          const y =
            Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 -
            100
          points.push(new THREE.Vector2(x, y))
        }

        points.push(new THREE.Vector2(5000, -300))
        points.push(new THREE.Vector2(-5000, -300))

        const shape = new THREE.Shape(points)
        const geometry = new THREE.ShapeGeometry(shape)
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        })

        const mountain = new THREE.Mesh(geometry, material)
        mountain.position.z = layer.distance
        mountain.position.y = layer.distance
        mountain.userData = { baseZ: layer.distance, index }
        refs.scene!.add(mountain)
        refs.mountains.push(mountain)
      })
    }

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(600, 32, 32)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;

          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.07, 0.52, 0.61) * intensity;

            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;

            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      })

      const atmosphere = new THREE.Mesh(geometry, material)
      refs.scene!.add(atmosphere)
    }

    const getLocation = () => {
      refs.locations = refs.mountains.map((mountain) => mountain.position.z)
    }

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      refs.stars.forEach((starField) => {
        starField.material.uniforms.time.value = time
      })

      if (refs.nebula) {
        refs.nebula.material.uniforms.time.value = time * 0.5
      }

      if (refs.camera) {
        const smoothingFactor = 0.05

        smoothCameraPos.current.x +=
          (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor
        smoothCameraPos.current.y +=
          (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor
        smoothCameraPos.current.z +=
          (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor

        const floatX = Math.sin(time * 0.1) * 2
        const floatY = Math.cos(time * 0.15) * 1

        refs.camera.position.x = smoothCameraPos.current.x + floatX
        refs.camera.position.y = smoothCameraPos.current.y + floatY
        refs.camera.position.z = smoothCameraPos.current.z
        refs.camera.lookAt(0, 10, -600)
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor
        mountain.position.y = 50 + Math.cos(time * 0.15) * 1 * parallaxFactor
      })

      refs.composer?.render()
    }

    const initThree = () => {
      refs.scene = new THREE.Scene()
      refs.scene.fog = new THREE.FogExp2(0x030a16, 0.00025)

      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000,
      )
      refs.camera.position.z = 100
      refs.camera.position.y = 20

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
      })
      refs.renderer.setSize(window.innerWidth, window.innerHeight)
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping
      refs.renderer.toneMappingExposure = 0.5

      refs.composer = new EffectComposer(refs.renderer)
      refs.composer.addPass(new RenderPass(refs.scene, refs.camera))
      refs.composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.8,
          0.4,
          0.85,
        ),
      )

      createStarField()
      createNebula()
      createMountains()
      createAtmosphere()
      getLocation()

      animate()
      setIsReady(true)
    }

    initThree()

    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight
        refs.camera.updateProjectionMatrix()
        refs.renderer.setSize(window.innerWidth, window.innerHeight)
        refs.composer.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener('resize', handleResize)

      refs.stars.forEach((starField) => {
        starField.geometry.dispose()
        starField.material.dispose()
      })
      refs.mountains.forEach((mountain) => {
        mountain.geometry.dispose()
        mountain.material.dispose()
      })
      refs.nebula?.geometry.dispose()
      refs.nebula?.material.dispose()
      refs.renderer?.dispose()
    }
  }, [])

  // Entrance animation for the first chapter, once Three.js is ready.
  useEffect(() => {
    if (!isReady) return

    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible',
    })

    const tl = gsap.timeline()

    if (menuRef.current) {
      tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: 'power3.out' })
    }
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.title-char')
      tl.from(
        chars,
        { y: 200, opacity: 0, duration: 1.5, stagger: 0.05, ease: 'power4.out' },
        '-=0.5',
      )
    }
    if (subtitleRef.current) {
      const lines = subtitleRef.current.querySelectorAll('.subtitle-line')
      tl.from(lines, { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.8')
    }
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, { opacity: 0, y: 50, duration: 1, ease: 'power2.out' }, '-=0.5')
    }

    return () => {
      tl.kill()
    }
  }, [isReady])

  // Scroll progress is scoped to this component's own container height, not
  // the whole document, so the effect completes regardless of how much page
  // content follows the hero.
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const totalScrollable = container.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1)

      setScrollProgress(progress)
      const newSection = Math.min(
        Math.floor(progress * TOTAL_TRANSITIONS),
        TOTAL_TRANSITIONS,
      )
      setCurrentSection(newSection)

      const refs = threeRefs.current
      const totalProgress = progress * TOTAL_TRANSITIONS
      const sectionProgress = totalProgress % 1

      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 },
      ]

      const currentPos = cameraPositions[newSection] ?? cameraPositions[0]
      const nextPos = cameraPositions[newSection + 1] ?? currentPos

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress

      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9
        const targetZ = mountain.userData.baseZ + scrolled * speed * 0.5

        if (progress > 0.7) {
          mountain.position.z = 600000
        } else {
          mountain.position.z = refs.locations[i] ?? targetZ
        }
      })

      const lastMountain = refs.mountains[refs.mountains.length - 1]
      if (refs.nebula && lastMountain) {
        refs.nebula.position.z = lastMountain.position.z
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030a16]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Side menu */}
        <div
          ref={menuRef}
          className="invisible fixed left-6 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-10"
        >
          <div className="flex flex-col gap-2">
            <span className="h-0.5 w-7 rounded-full bg-white/80" />
            <span className="h-0.5 w-7 rounded-full bg-white/80" />
            <span className="h-0.5 w-7 rounded-full bg-white/80" />
          </div>
          <span
            className="text-xs font-bold tracking-[0.3em] text-white/60"
            style={{ writingMode: 'vertical-rl' }}
          >
            APTARA
          </span>
        </div>

        {/* Chapter overlays, cross-faded by scroll position */}
        {CHAPTERS.map((chapter, i) => (
          <div
            key={chapter.title}
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ${
              currentSection === i ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <h1
              ref={i === 0 ? titleRef : undefined}
              className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-8xl"
            >
              {splitTitle(chapter.title)}
            </h1>
            <div ref={i === 0 ? subtitleRef : undefined} className="mt-7 max-w-2xl">
              {chapter.lines.map((line) => (
                <p key={line} className="subtitle-line text-base leading-7 text-white/70 sm:text-lg">
                  {line}
                </p>
              ))}
            </div>

            {/* Scroll progress indicator */}
            <div
              ref={i === 0 ? scrollProgressRef : undefined}
              className={`mt-10 flex flex-col items-center gap-2 ${i === 0 ? 'invisible' : ''}`}
            >
              <span className="text-xs font-bold tracking-[0.3em] text-white/60">SCROLL</span>
              <div className="h-24 w-0.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="w-full bg-q1"
                  style={{ height: `${scrollProgress * 100}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-white/60">
                {String(currentSection).padStart(2, '0')} / {String(TOTAL_TRANSITIONS).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
