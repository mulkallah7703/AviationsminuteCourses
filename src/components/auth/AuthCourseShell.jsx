import { Outlet } from 'react-router-dom'
import { SessionToolbar } from './SessionToolbar'

export function AuthCourseShell() {
  return (
    <>
      <SessionToolbar />
      <Outlet />
    </>
  )
}
