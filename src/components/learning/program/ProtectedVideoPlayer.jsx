import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2, Pause, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  REWIND_TOLERANCE_SEC,
  VIDEO_COMPLETION_RATIO,
} from '../../../lib/programProgressIntegrity'

const BLOCKED_KEYS = new Set([
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'End',
  'Home',
  'PageUp',
  'PageDown',
  '>',
  'l',
  'L',
  'k',
  'K',
  'j',
  'J',
])

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Protected HTML5 player — anti-seek-forward, 1x only, custom controls.
 * YouTube embeds cannot be locked; use provider="mp4" for compliance mode.
 */
export function ProtectedVideoPlayer({
  src,
  title,
  moduleId,
  initialMaxSeconds = 0,
  initialLastPosition = 0,
  onWatchProgress,
  onCompleted,
  autoPlay = false,
  className = '',
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const maxWatchedRef = useRef(Math.max(0, initialMaxSeconds))
  const durationRef = useRef(0)
  const completedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [displayTime, setDisplayTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [maxWatchedDisplay, setMaxWatchedDisplay] = useState(initialMaxSeconds)

  useEffect(() => {
    maxWatchedRef.current = Math.max(maxWatchedRef.current, initialMaxSeconds)
  }, [moduleId, initialMaxSeconds])

  useEffect(() => {
    completedRef.current = false
    setIsPlaying(false)
    setDisplayTime(0)
    setDuration(0)
  }, [moduleId, src])

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const blockKeys = (e) => {
      if (BLOCKED_KEYS.has(e.key)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('keydown', blockKeys, true)
    return () => window.removeEventListener('keydown', blockKeys, true)
  }, [])

  const emitProgress = useCallback(
    (video, extra = {}) => {
      onWatchProgress?.({
        moduleId,
        maxSeconds: maxWatchedRef.current,
        durationSeconds: durationRef.current || video.duration || 0,
        lastPosition: video.currentTime,
        ...extra,
      })
    },
    [moduleId, onWatchProgress],
  )

  const tryMarkCompleted = useCallback(
    (video) => {
      const dur = durationRef.current || video.duration
      if (!dur || completedRef.current) return
      const ratio = video.currentTime / dur
      if (ratio >= VIDEO_COMPLETION_RATIO || video.ended) {
        completedRef.current = true
        maxWatchedRef.current = Math.max(maxWatchedRef.current, dur)
        emitProgress(video, { completed: true })
        onCompleted?.()
      }
    },
    [emitProgress, onCompleted],
  )

  const clampSeek = useCallback((video) => {
    const maxAllowed = maxWatchedRef.current + REWIND_TOLERANCE_SEC
    if (video.currentTime > maxAllowed) {
      video.currentTime = maxWatchedRef.current
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video) return
  clampSeek(video)
    if (!video.paused && !video.seeking) {
      maxWatchedRef.current = Math.max(maxWatchedRef.current, video.currentTime)
      setMaxWatchedDisplay(maxWatchedRef.current)
    }
    setDisplayTime(video.currentTime)
    emitProgress(video)
    tryMarkCompleted(video)
  }, [clampSeek, emitProgress, tryMarkCompleted])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    durationRef.current = video.duration
    setDuration(video.duration)
    video.playbackRate = 1
    video.defaultPlaybackRate = 1
    video.disablePictureInPicture = true
    const startAt = Math.min(initialLastPosition, maxWatchedRef.current)
    if (startAt > 0) {
      video.currentTime = startAt
    }
    setDisplayTime(video.currentTime)
    emitProgress(video)
    if (autoPlay) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }, [autoPlay, emitProgress, initialLastPosition])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) await el.requestFullscreen?.()
    else await document.exitFullscreen?.()
  }, [])

  const watchedPct =
    duration > 0 ? Math.min(100, Math.round((maxWatchedDisplay / duration) * 100)) : 0

  return (
    <motion.div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] md:rounded-3xl ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative aspect-video w-full bg-slate-950">
        <video
          ref={videoRef}
          key={`${moduleId}-${src}`}
          className="absolute inset-0 h-full w-full object-contain"
          src={src}
          playsInline
          preload="metadata"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onSeeking={clampSeek}
          onSeeked={clampSeek}
          onPlay={() => {
            if (videoRef.current) videoRef.current.playbackRate = 1
            setIsPlaying(true)
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false)
            tryMarkCompleted(videoRef.current)
          }}
          onRateChange={() => {
            if (videoRef.current) videoRef.current.playbackRate = 1
          }}
        />

        {!isPlaying ? (
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/25 transition hover:bg-black/35"
            onClick={togglePlay}
            aria-label="تشغيل الفيديو"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25">
              <Play className="ms-1 h-7 w-7 fill-white" />
            </span>
          </button>
        ) : null}
      </div>

      <motion.div
        className="border-t border-white/10 bg-gradient-to-t from-black/90 to-black/60 px-4 py-3 backdrop-blur-md"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="mb-2 h-1 overflow-hidden rounded-full bg-white/10"
          aria-hidden
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-indigo-500"
            animate={{ width: `${watchedPct}%` }}
            transition={{ duration: 0.25 }}
          />
        </motion.div>

        <div className="flex items-center justify-between gap-3">
          <motion.div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
            </button>
            <span className="text-xs tabular-nums text-slate-300">
              {formatTime(displayTime)} / {formatTime(duration)}
            </span>
          </motion.div>

          <span className="hidden truncate text-xs text-slate-500 sm:block">{title}</span>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
              محمي · 1x
            </span>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="ملء الشاشة"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
