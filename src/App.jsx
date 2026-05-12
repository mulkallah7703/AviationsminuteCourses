import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthEntryRedirect } from './components/auth/AuthEntryRedirect'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LearnerAppShell } from './components/layout/LearnerAppShell'
import { CourseLandingPage } from './pages/CourseLandingPage'
import { CourseLearnPage } from './pages/CourseLearnPage'
import { PhysicalRisksTypesPage } from './pages/PhysicalRisksTypesPage'
import { ExtremeTemperatureUnitPage } from './pages/ExtremeTemperatureUnitPage'
import { VibrationRisksUnitPage } from './pages/VibrationRisksUnitPage'
import { ElectricalRisksUnitPage } from './pages/ElectricalRisksUnitPage'
import { RadiationRisksUnitPage } from './pages/RadiationRisksUnitPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { CoursePageLayout } from './components/layout/CoursePageLayout'

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AuthEntryRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<LearnerAppShell />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="course" element={<CoursePageLayout />}>
            <Route index element={<CourseLandingPage />} />
            <Route path="learn" element={<CourseLearnPage />} />
            <Route path="physical-risks/types" element={<PhysicalRisksTypesPage />} />
            <Route path="extreme-temperature" element={<Navigate to="/course/extreme-temperature/1" replace />} />
            <Route path="extreme-temperature/:step" element={<ExtremeTemperatureUnitPage />} />
            <Route path="vibration-risks" element={<Navigate to="/course/vibration-risks/1" replace />} />
            <Route path="vibration-risks/:step" element={<VibrationRisksUnitPage />} />
            <Route path="electrical-risks" element={<Navigate to="/course/electrical-risks/1" replace />} />
            <Route path="electrical-risks/:step" element={<ElectricalRisksUnitPage />} />
            <Route path="radiation-risks" element={<Navigate to="/course/radiation-risks/1" replace />} />
            <Route path="radiation-risks/:step" element={<RadiationRisksUnitPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
