import { useEffect } from 'react'

export function VideoPlayer({ onEnded }) {
  useEffect(() => {
    // YouTube iframe does not emit native video ended events.
    // Mark step as complete so navigation is not blocked.
    onEnded()
  }, [onEnded])

  return (
    <div className="lesson-video-card">
      <div className="video-frame">
        <iframe
          className="lesson-video-element"
          src="https://www.youtube.com/embed/12zYMJSvYlQ"
          title="VideoChemestey"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  )
}
