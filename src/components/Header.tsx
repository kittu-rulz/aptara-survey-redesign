export function Header() {
  return (
    <header className="bg-navy">
      <div className="mx-auto flex h-[74px] max-w-5xl items-center justify-between px-5 sm:px-7">
        <img
          src={`${import.meta.env.BASE_URL}aptaraLogo.png`}
          alt="Aptara"
          className="h-6 w-auto object-contain sm:h-7"
        />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-xs">
          L&amp;D Assessment
        </span>
      </div>
    </header>
  )
}
