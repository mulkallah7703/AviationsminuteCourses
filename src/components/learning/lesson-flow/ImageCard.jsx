export function ImageCard({ src, alt = '' }) {
  return (
    <div className="lesson-accordion-image-card">
      <img src={src} alt={alt} className="lesson-accordion-image" />
    </div>
  )
}
