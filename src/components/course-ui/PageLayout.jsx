export function PageLayout({ pageIndex, pageTotal, children, className = '' }) {
  return (
    <div className={`et-page-layout ${className}`.trim()}>
      <header className="et-page-layout__top" dir="ltr">
        <span className="et-page-layout__page">
          Page {pageIndex} of {pageTotal}
        </span>
      </header>
      <div className="et-page-layout__inner">{children}</div>
    </div>
  )
}
