export function StepLayout({
  programHeader,
  englishModuleTitle,
  arabicModuleTitle,
  children,
  className = '',
}) {
  return (
    <div className={`vr-shell ${className}`.trim()}>
      <header className="vr-topbar">
        <div className="vr-topbar__center">
          {programHeader ? (
            <div className="vr-program-block" dir="rtl">
              <h1 className="vr-program-block__title">
                {programHeader.programTitle ?? 'برنامج التوعية التفاعلي'}
              </h1>
              <p className="vr-program-block__sub" dir="ltr">
                {programHeader.englishSubtitle}
              </p>
              <div className="vr-progress" dir="ltr">
                <span className="vr-progress__label">{programHeader.progressPercent}%</span>
                <div className="vr-progress__track">
                  <div
                    className="vr-progress__fill"
                    style={{ width: `${programHeader.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {englishModuleTitle ? (
            <div
              className={`vr-module-titles ${programHeader ? 'vr-module-titles--tight' : ''}`.trim()}
            >
              {arabicModuleTitle ? (
                <p className="vr-module-titles__ar" dir="rtl">
                  {arabicModuleTitle}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="vr-shell__body">{children}</div>
    </div>
  )
}
