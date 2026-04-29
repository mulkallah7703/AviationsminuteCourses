export function ContentAudioLesson({ content }) {
  return (
    <div className="lesson-grid single">
      <div className="soft-card">
        <h4>محتوى صوتي</h4>
        <p>{content.text}</p>
        <div className="audio-player">
          <span>{content.trackTitle}</span>
          <div className="audio-track">
            <div className="audio-progress" />
          </div>
          <button type="button" className="mini-button">
            ▶
          </button>
        </div>
      </div>
    </div>
  )
}
