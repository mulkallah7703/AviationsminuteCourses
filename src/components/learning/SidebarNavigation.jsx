import { memo } from 'react'

export const SidebarNavigation = memo(function SidebarNavigation({
  units,
  activeUnitKey,
  onSelectUnit,
  progressPercent,
  courseHeading,
}) {
  return (
    <aside className="learning-sidebar">
      <div className="learning-sidebar-top">
        <h2>{courseHeading}</h2>
        <p>{`${progressPercent}% COMPLETE`}</p>
        <div className="learning-sidebar-progress-track">
          <div className="learning-sidebar-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <nav className="learning-sidebar-list" aria-label="وحدات الدورة">
        {units.map((unit) => {
          const isActive = unit.key === activeUnitKey
          return (
            <button
              key={unit.key}
              type="button"
              className={`learning-unit-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectUnit(unit.key)}
            >
              <span className="learning-unit-icon">{unit.icon}</span>
              <span className="learning-unit-title">{unit.shortTitle}</span>
              <span className={`learning-unit-indicator ${isActive ? 'active' : ''}`} />
            </button>
          )
        })}
      </nav>
    </aside>
  )
})
