import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ChevronLeft,
  FileText,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Menu,
  Radar,
  Settings,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STORAGE_COLLAPSE = 'lms_sidebar_collapsed'

const NAV = [
  { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { to: '/course', label: 'الدورات', icon: BookOpen, end: false },
  { to: '/dashboard#roadmap', label: 'مسارات التعلم', icon: GitBranch, end: false, hashOnly: true },
  { to: '/dashboard#insights', label: 'تحليلات الذكاء الاصطناعي', icon: Sparkles, end: false, hashOnly: true },
  { to: '/dashboard#certificates', label: 'الشهادات', icon: Award, end: false, hashOnly: true },
  { to: '/dashboard#cyber', label: 'التوعية الأمنية', icon: Radar, end: false, hashOnly: true },
  { to: '/dashboard#analytics', label: 'التحليلات', icon: BarChart3, end: false, hashOnly: true },
  { to: '/dashboard#reports', label: 'التقارير', icon: FileText, end: false, hashOnly: true },
  { to: '/dashboard#notifications', label: 'الإشعارات', icon: Bell, end: false, hashOnly: true },
  { to: '/dashboard#profile', label: 'الملف الشخصي', icon: User, end: false, hashOnly: true },
  { to: '/dashboard#settings', label: 'الإعدادات', icon: Settings, end: false, hashOnly: true },
]

function NavItem({ item, collapsed, onPick }) {
  const Icon = item.icon
  const classBase =
    'group relative flex items-center gap-3 rounded-2xl border border-transparent px-2 py-2 text-sm font-semibold transition-all duration-300 outline-none'
  const inactive = 'text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
  const active =
    'border-cyan-400/35 bg-gradient-to-l from-cyan-500/15 to-indigo-500/10 text-white shadow-[0_0_28px_rgba(34,211,238,0.12)]'

  if (item.hashOnly) {
    return (
      <Link
        to={item.to}
        onClick={onPick}
        className={`${classBase} ${inactive} ${collapsed ? 'justify-center' : ''}`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-300/90 ring-1 ring-white/10 transition group-hover:text-cyan-200">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        {!collapsed ? <span className="truncate">{item.label}</span> : null}
      </Link>
    )
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onPick}
      className={({ isActive }) =>
        `${classBase} ${collapsed ? 'justify-center' : ''} ${isActive ? active : inactive}`.trim()
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
            className={`relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-100 ring-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                : 'bg-white/[0.04] text-slate-400 ring-white/10 group-hover:text-cyan-200'
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          {!collapsed ? <span className="relative z-[1] truncate">{item.label}</span> : null}
        </>
      )}
    </NavLink>
  )
}

export function LearnerAppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_COLLAPSE) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COLLAPSE, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  useEffect(() => {
    function onResize() {
      if (window.matchMedia('(min-width: 1024px)').matches) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function closeMobileMenu() {
    setMenuOpen(false)
  }

  async function onLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-row gap-3 p-3 md:gap-4 md:p-4 lg:gap-5" dir="rtl">
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm transition-opacity lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="إغلاق القائمة"
        onClick={closeMobileMenu}
      />

      <aside
        id="sidebar-nav"
        className={[
          'fixed z-50 flex h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/85 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-[transform,width] duration-300 ease-out',
          'end-3 top-3 w-[min(20rem,calc(100vw-1.5rem))]',
          menuOpen ? 'translate-x-0' : 'translate-x-[115%] pointer-events-none',
          'lg:static lg:h-[calc(100dvh-2rem)] lg:translate-x-0 lg:self-start lg:pointer-events-auto lg:shadow-xl',
          collapsed ? 'lg:w-[5.75rem]' : 'lg:w-72',
        ].join(' ')}
      >
        <div
          className={`flex shrink-0 items-center gap-2 border-b border-white/5 p-3 ${collapsed ? 'flex-col' : ''}`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/30">
            <Sparkles className="h-6 w-6 text-white" aria-hidden />
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">LMS Intelligence</p>
              <p className="truncate text-xs text-slate-500">منصة تعلّم مؤسسية</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="ms-auto hidden rounded-xl border border-white/10 bg-white/[0.05] p-2 text-slate-300 transition hover:bg-white/[0.1] lg:block"
            aria-label={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            <ChevronLeft className={`h-5 w-5 transition ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-2" aria-label="القائمة الرئيسية">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} onPick={closeMobileMenu} />
          ))}
        </nav>

        <div className="shrink-0 space-y-2 border-t border-white/5 p-2">
          <div
            className={`flex items-center gap-2 rounded-2xl bg-white/[0.04] p-2 ${collapsed ? 'justify-center' : ''}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white">
              {(user?.fullName || '?').slice(0, 1)}
            </span>
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{user?.fullName || 'مستخدم'}</p>
                <p className="truncate text-xs text-slate-500">{user?.employeeNumber}</p>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className={`flex w-full items-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-500/10 py-2.5 text-sm font-bold text-rose-100 transition hover:bg-rose-500/20 ${collapsed ? 'justify-center px-0' : 'justify-center px-3'}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed ? 'تسجيل الخروج' : null}
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/90 bg-[var(--bg)]/95 px-3 py-2.5 backdrop-blur-md lg:hidden">
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

        <main className="min-h-0 min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + location.hash}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
