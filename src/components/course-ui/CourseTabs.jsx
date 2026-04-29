export function CourseTabs({ tabs, activeId, onChange, className = '' }) {
  return (
    <div className={`vr-tabs ${className}`.trim()} role="tablist" dir="rtl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeId === tab.id}
          className={`vr-tab ${activeId === tab.id ? 'vr-tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
