import { useEffect, useRef, useState } from 'react'

const DEMO_AUDIO =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

export function ModuleIntroPhysical({ onNext, lessonStep = 1 }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const onMeta = () => setDuration(audio.duration || 0)
    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const pct = duration ? Math.min((currentTime / duration) * 100, 100) : 0

  const formatTime = (s) => {
    if (!Number.isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div
      className="module-intro-physical"
      dir="ltr"
      aria-label={`Module 2 physical risks, lesson step ${lessonStep}`}
    >
      <audio ref={audioRef} src={DEMO_AUDIO} preload="metadata" />

      <header className="module-intro-physical__top">
        <span className="module-intro-physical__page">Page 1 of 5</span>
      </header>

      <h1 className="module-intro-physical__title">مقدمة عن المخاطر الفيزيائية</h1>

      <div className="module-intro-physical__banner-wrap">
        <img
          className="module-intro-physical__banner"
          src="/physics1.png"
          alt=""
        />
      </div>

      <footer className="module-intro-physical__footer">
        <button type="button" className="primary step-btn module-intro-physical__next" onClick={onNext}>
          Next
        </button>
      </footer>
    </div>
  )
}
