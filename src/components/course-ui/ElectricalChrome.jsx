export function ElectricalChrome({ leftHeading, progressPercent, children, className = '' }) {
  return (
    <div className={`er-shell ${className}`.trim()}>
      <div className="er-chrome__body">{children}</div>
    </div>
  )
}
