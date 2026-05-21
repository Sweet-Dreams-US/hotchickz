interface HeaderBackdropProps {
  /** Looping, muted background video (mp4). Takes priority over `image`. */
  video?: string
  /** Background photo — also used as the video's poster frame. */
  image?: string
}

/**
 * The flame-lit photo/video layer that sits behind a page header.
 *
 * When `video` is set it autoplays a silent seamless loop; `image` becomes the
 * poster so there is never a blank flash before playback starts. `muted` +
 * `playsInline` are required for reliable autoplay across browsers.
 */
export function HeaderBackdrop({ video, image }: HeaderBackdropProps) {
  if (!video && !image) return null
  return (
    <div className="pointer-events-none absolute inset-0">
      {video ? (
        <video
          className="h-full w-full object-cover opacity-[0.42]"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={image}
          aria-hidden="true"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.38]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-coal/82 via-coal/68 to-coal" />
    </div>
  )
}
