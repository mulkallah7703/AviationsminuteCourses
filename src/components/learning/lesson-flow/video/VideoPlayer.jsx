export function VideoPlayer({ onEnded }) {
  return (
    <div className="lesson-video-card">
      <div className="video-frame">
        <video
          className="lesson-video-element"
          src="/video1.mp4"
          title="VideoChemestey"
          controls
          playsInline
          onEnded={() => onEnded?.()}
        />
      </div>
    </div>
  )
}
