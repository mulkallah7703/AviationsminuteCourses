import { motion } from 'framer-motion'

export function HeatmapSection({ heatmap }) {
  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-6"
      aria-label="خريطة نشاط التعلّم"
    >
      <h3 className="mb-4 text-lg font-bold text-white">خريطة حرارية للتفاعل</h3>
      <p className="mb-4 text-sm text-slate-500">كثافة الجلسات حسب اليوم والفترة (٠ = منخفض، ١ = مرتفع)</p>
      <div className="flex flex-col gap-2" dir="ltr">
        <div className="flex gap-1 ps-20">
          {heatmap.cols.map((c) => (
            <div key={c} className="flex-1 text-center text-xs font-semibold text-slate-500">
              {c}
            </div>
          ))}
        </div>
        {heatmap.rows.map((row, ri) => (
          <div key={row} className="flex items-center gap-2">
            <div className="w-20 shrink-0 text-end text-xs font-medium text-slate-400" dir="rtl">
              {row}
            </div>
            <div className="flex flex-1 gap-1">
              {heatmap.cells[ri].map((cell, ci) => (
                <motion.div
                  key={`${ri}-${ci}`}
                  initial={{ scale: 0.85, opacity: 0.5 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (ri * 7 + ci) * 0.012 }}
                  className="aspect-square min-h-[2rem] flex-1 rounded-md border border-white/5"
                  style={{
                    backgroundColor: `rgba(34, 211, 238, ${0.08 + cell * 0.55})`,
                    boxShadow: cell > 0.65 ? '0 0 18px rgba(34,211,238,0.25)' : undefined,
                  }}
                  title={`${row} · ${heatmap.cols[ci]} · ${(cell * 100).toFixed(0)}٪`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
