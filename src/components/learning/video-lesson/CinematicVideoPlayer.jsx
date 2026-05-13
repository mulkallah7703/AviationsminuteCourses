import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2, Play } from 'lucide-react'
import { motion } from 'framer-motion'

export function CinematicVideoPlayer({
  provider = 'youtube',
  videoId,
  src,
  title,
  onEnded,
  className = '',
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.()
    } else {
      await document.exitFullscreen?.()
    }
  }, [])

  const handlePlayClick = () => {
    if (provider === 'mp4' && videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const embedSrc =
    provider === 'youtube' && videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
      : null

  return (
    <motion.div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] md:rounded-3xl ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: isPlaying ? 0.35 : 0.6 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="relative aspect-video w-full bg-slate-950"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        key={provider === 'youtube' ? videoId : src}
      >
        {provider === 'youtube' && embedSrc ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedSrc}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={src}
              controls
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => onEnded?.()}
            />
            {!isPlaying ? (
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
                onClick={handlePlayClick}
                aria-label="تشغيل الفيديو"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25 transition group-hover:scale-105">
                  <Play className="ms-1 h-7 w-7 fill-white" />
                </span>
              </button>
            ) : null}
          </>
        )}
      </motion.div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 opacity-0 transition group-hover:opacity-100 md:bottom-4 md:left-4 md:right-4">
        <span className="truncate rounded-full bg-black/55 px-3 py-1 text-xs text-white/90 backdrop-blur-md">
          {title}
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/70"
          aria-label={isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  )
}
