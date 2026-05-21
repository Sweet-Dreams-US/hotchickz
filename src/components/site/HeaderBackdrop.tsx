interface HeaderBackdropProps {
  /** Background photo — pass a resolved URL via asset(). */
  image?: string
}

/** The flame-lit photo layer that sits behind a page header. */
export function HeaderBackdrop({ image }: HeaderBackdropProps) {
  if (!image) return null
  return (
    <div className="pointer-events-none absolute inset-0">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover opacity-[0.38]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-coal/82 via-coal/68 to-coal" />
    </div>
  )
}
