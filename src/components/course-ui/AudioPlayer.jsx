import { useEffect, useRef, useState } from 'react'

const DEFAULT_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

function formatTime(s) {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function AudioPlayer({
  src = DEFAULT_SRC,
  leadingIcon = null,
  className = '',
  variant = 'card',
}) {
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
  }, [src])

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

  const row = (
    <div className="course-audio-player__row">
      {leadingIcon ? <span className="course-audio-player__icon" aria-hidden>{leadingIcon}</span> : null}
      <button
        type="button"
        className="course-audio-player__play"
        onClick={togglePlay}
        aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>
      <input
        type="range"
        className="course-audio-player__seek"
        min={0}
        max={duration || 100}
        step={0.1}
        value={duration ? currentTime : 0}
        onChange={(e) => {
          const audio = audioRef.current
          if (!audio || !duration) return
          audio.currentTime = Number(e.target.value)
          setCurrentTime(audio.currentTime)
        }}
        style={{ '--seek': `${pct}%` }}
      />
      <span className="course-audio-player__time">{formatTime(duration || currentTime)}</span>
      <span className="course-audio-player__vol" aria-hidden>
        🔊
      </span>
    </div>
  )

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" />
      {variant === 'card' ? (
        <div className={`course-audio-player course-audio-player--card ${className}`.trim()} dir="ltr">
          {row}
        </div>
      ) : (
        <div className={`course-audio-player course-audio-player--bar ${className}`.trim()} dir="ltr">
          {row}
        </div>
      )}
    </>
  )
}
