export function IntroLesson({ content }) {
  return (
    <div className="lesson-grid">
      <div className="soft-card">
        <h4>{content.headline}</h4>
        <p>{content.description}</p>
        <div className="chip-row">
          {content.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="soft-card">
        <h4>فيديو (نموذج)</h4>
        <div className="video-placeholder">Video Placeholder</div>
      </div>
    </div>
  )
}
