import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { buildDashboardPayload } from '../lib/buildDashboardPayload.js'

/**
 * Single source for dashboard view-model. Swap implementation to fetch('/api/dashboard') later.
 */
export function useDashboardData() {
  const { user } = useAuth()

  return useMemo(
    () =>
      buildDashboardPayload(
        user
          ? {
              id: user.id,
              fullName: user.fullName,
              employeeNumber: user.employeeNumber,
            }
          : null,
      ),
    [user],
  )
}
