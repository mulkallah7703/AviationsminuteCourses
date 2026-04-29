export function RadiationChrome({
  children,
  className = '',
}) {
  return (
    <div className={`rr-shell ${className}`.trim()}>
      <header className="rr-chrome rr-chrome--minimal" dir="ltr" />
      <div className="rr-chrome__body">{children}</div>
    </div>
  )
}
