export function ContentImageLesson({ content }) {
  return (
    <div className="lesson-grid">
      <div className="soft-card">
        <h4>محتوى الدرس</h4>
        <p>{content.text}</p>
      </div>
      <div className="soft-card">
        <h4>{content.imageLabel}</h4>
        <div className="image-placeholder">Image Placeholder</div>
      </div>
    </div>
  )
}
