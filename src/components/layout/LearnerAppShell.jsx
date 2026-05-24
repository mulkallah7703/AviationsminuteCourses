import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const STORAGE_COLLAPSE = 'lms_sidebar_collapsed'

const NAV = [
  { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { to: '/course', label: 'الدورات', icon: BookOpen, end: false },
  { to: '/dashboard#reports', label: 'التقارير', icon: FileText, end: false, hashOnly: true },
  { to: '/dashboard#profile', label: 'الملف الشخصي', icon: User, end: false, hashOnly: true },
  { to: '/dashboard#settings', label: 'الإعدادات', icon: Settings, end: false, hashOnly: true },
]

function NavItem({ item, iconOnly, showLabels, onPick }) {
  const Icon = item.icon
  const classBase =
    'group relative flex items-center gap-2.5 rounded-2xl border border-transparent px-2 py-1.5 text-sm font-semibold transition-all duration-300 outline-none sm:gap-3 sm:py-2'
  const inactive = 'text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
  const active =
    'border-cyan-400/35 bg-gradient-to-l from-cyan-500/15 to-indigo-500/10 text-white shadow-[0_0_28px_rgba(34,211,238,0.12)]'

  if (item.hashOnly) {
    return (
      <Link
        to={item.to}
        onClick={onPick}
        title={iconOnly ? item.label : undefined}
        className={`${classBase} ${inactive} ${iconOnly ? 'justify-center' : ''}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-300/90 ring-1 ring-white/10 transition group-hover:text-cyan-200 sm:h-10 sm:w-10">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        {showLabels ? <span className="truncate">{item.label}</span> : null}
      </Link>
    )
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onPick}
      title={iconOnly ? item.label : undefined}
      className={({ isActive }) =>
        `${classBase} ${iconOnly ? 'justify-center' : ''} ${isActive ? active : inactive}`.trim()
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="navGlow"
              className="absolute inset-0 rounded-2xl bg-gradient-to-l from-cyan-500/10 to-transparent"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          ) : null}
          <span
            className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 transition sm:h-10 sm:w-10 ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-100 ring-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                : 'bg-white/[0.04] text-slate-400 ring-white/10 group-hover:text-cyan-200'
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          {showLabels ? <span className="relative z-[1] truncate">{item.label}</span> : null}
        </>
      )}
    </NavLink>
  )
}

export function LearnerAppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_COLLAPSE) === '1'
    } catch {
      return false
    }
  })

  const iconOnly = isTablet || (isDesktop && collapsed)
  const showLabels = isMobile || (isDesktop && !collapsed)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COLLAPSE, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!menuOpen || !isMobile) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen, isMobile])

  function closeMobileMenu() {
    setMenuOpen(false)
  }

  async function onLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <motion.div
      className="flex h-[100dvh] max-h-[100dvh] flex-row items-stretch gap-2 overflow-hidden bg-slate-950 p-2 sm:gap-3 sm:p-3 md:gap-4 md:p-4 lg:gap-5"
      dir="rtl"
    >
      <AnimatePresence>
        {menuOpen && isMobile ? (
          <motion.button
            type="button"
            key="shell-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            aria-label="إغلاق القائمة"
            onClick={closeMobileMenu}
          />
        ) : null}
      </AnimatePresence>

      <aside
        id="sidebar-nav"
        aria-hidden={isMobile && !menuOpen}
        className={[
          'flex shrink-0 flex-col rounded-3xl border border-white/10 bg-slate-950/90 shadow-xl backdrop-blur-2xl',
          'max-md:fixed max-md:z-50 max-md:end-2 max-md:top-2 max-md:bottom-2 max-md:w-[min(19rem,calc(100vw-1rem))]',
          'max-md:transition-[transform,opacity,visibility] max-md:duration-300 max-md:ease-out',
          menuOpen
            ? 'max-md:translate-x-0 max-md:opacity-100 max-md:visible max-md:pointer-events-auto'
            : 'max-md:pointer-events-none max-md:invisible max-md:opacity-0 max-md:translate-x-[110%] max-md:rtl:-translate-x-[110%]',
          'md:static md:h-full md:min-h-0 md:translate-x-0 md:opacity-100 md:visible md:pointer-events-auto md:z-20 md:self-stretch',
          'md:w-[4.75rem] md:shadow-xl',
          isDesktop && collapsed ? 'lg:w-[5.75rem]' : 'lg:w-72',
        ].join(' ')}
      >
        <div
          className={`flex shrink-0 items-center gap-2 border-b border-white/5 p-2.5 sm:p-3 ${iconOnly ? 'flex-col' : ''}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/30 sm:h-11 sm:w-11">
            <Sparkles className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden />
          </div>
          {showLabels ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">LMS Intelligence</p>
              <p className="truncate text-xs text-slate-500">منصة تعلّم مؤسسية</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={closeMobileMenu}
            className="ms-auto rounded-xl border border-white/10 bg-white/[0.05] p-2 text-slate-300 transition hover:bg-white/[0.1] md:hidden"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="ms-auto hidden rounded-xl border border-white/10 bg-white/[0.05] p-2 text-slate-300 transition hover:bg-white/[0.1] lg:block"
            aria-label={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            <ChevronLeft className={`h-5 w-5 transition ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav
          className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden p-1.5 sm:gap-1 sm:p-2"
          aria-label="القائمة الرئيسية"
        >
          {NAV.map((item) => (
            <NavItem
              key={item.to}
              item={item}
              iconOnly={iconOnly}
              showLabels={showLabels}
              onPick={closeMobileMenu}
            />
          ))}
        </nav>

        <div className="mt-auto shrink-0 space-y-2 border-t border-white/5 p-1.5 sm:p-2">
          <div
            className={`flex items-center gap-2 rounded-2xl bg-white/[0.04] p-2 ${iconOnly ? 'justify-center' : ''}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white sm:h-10 sm:w-10">
              {(user?.fullName || '?').slice(0, 1)}
            </span>
            {showLabels ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{user?.fullName || 'مستخدم'}</p>
                <p className="truncate text-xs text-slate-500">{user?.employeeNumber}</p>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onLogout}
            title={iconOnly ? 'تسجيل الخروج' : undefined}
            className={`flex w-full items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-500/10 py-2.5 text-sm font-bold text-rose-100 transition hover:bg-rose-500/20 ${iconOnly ? 'justify-center px-0' : 'justify-center px-3'}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {showLabels ? 'تسجيل الخروج' : null}
          </button>
        </div>
      </aside>

      <div className="learner-shell-scroll flex min-h-0 min-h-full min-w-0 flex-1 flex-col overflow-y-auto scroll-smooth overscroll-y-contain bg-slate-950">
        <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-slate-200/90 bg-[var(--bg)]/95 px-3 py-2.5 backdrop-blur-md md:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="sidebar-nav"
          >
            <Menu className="h-5 w-5" />
            القائمة
          </button>
          <span className="truncate text-xs font-semibold text-slate-500">{user?.employeeNumber}</span>
        </header>

        <main className="min-w-0 flex-1">
          <AnimatePresence>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full w-full max-w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  )
}
