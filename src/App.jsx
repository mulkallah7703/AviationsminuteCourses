import { Navigate, Route, Routes } from 'react-router-dom'
import { CourseLandingPage } from './pages/CourseLandingPage'
import { CourseLearnPage } from './pages/CourseLearnPage'
import { PhysicalRisksTypesPage } from './pages/PhysicalRisksTypesPage'
import { ExtremeTemperatureUnitPage } from './pages/ExtremeTemperatureUnitPage'
import { VibrationRisksUnitPage } from './pages/VibrationRisksUnitPage'
import { ElectricalRisksUnitPage } from './pages/ElectricalRisksUnitPage'
import { RadiationRisksUnitPage } from './pages/RadiationRisksUnitPage'
import { CoursePageLayout } from './components/layout/CoursePageLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/course" replace />} />
      <Route path="/course" element={<CoursePageLayout />}>
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
      <Route path="*" element={<Navigate to="/course" replace />} />
    </Routes>
  )
}

export default App
