import { VideoPlayer } from './video/VideoPlayer'

export function LessonVideo({ onVideoEnded }) {
  return (
    <div className="lesson-video-screen">
      <header className="lesson-video-header">
        <h2>Video/Exposure</h2>
        <p>
          يتم عرض مشهد يوضح التعرض لمخاطر المواد الكيميائية داخل بيئة العمل، لتوضيح كيفية حدوث الخطر
          في الواقع.
        </p>
      </header>

      <VideoPlayer onEnded={onVideoEnded} />
    </div>
  )
}
