import { motion } from 'framer-motion'
import { Brain, ChevronLeft } from 'lucide-react'

const kindAccent = {
  course: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30',
  cert: 'from-amber-500/20 to-orange-600/10 border-amber-500/30',
  skill: 'from-violet-500/20 to-fuchsia-600/10 border-violet-500/30',
  cyber: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30',
  plan: 'from-indigo-500/20 to-slate-700/20 border-indigo-400/30',
}

export function AIRecommendationsShelf({ shelves }) {
  return (
    <section
      id="ai-recs"
      className="scroll-mt-28 space-y-10"
      aria-labelledby="ai-recs-heading"
    >
      <h2 id="ai-recs-heading" className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
        <Brain className="h-8 w-8 text-fuchsia-300" aria-hidden />
        اقتراحات الذكاء الاصطناعي
      </h2>
      <p className="-mt-6 max-w-3xl text-slate-400">
        واجهة شبيهة بمنصات التوصية الحديثة — صفوف أفقية قابلة للتمرير، مع درجة تطابق لكل عنصر.
      </p>

      {shelves.map((shelf, si) => (
        <div key={shelf.shelf} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white">{shelf.shelf}</h3>
            <ChevronLeft className="h-5 w-5 text-slate-600" aria-hidden />
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shelf.items.map((item, ii) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: si * 0.05 + ii * 0.04 }}
                whileHover={{ scale: 1.02 }}
                className={`min-w-[min(280px,82vw)] snap-start rounded-2xl border bg-gradient-to-br p-5 shadow-lg ${kindAccent[item.kind] || kindAccent.course}`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-black text-white">
                    {item.score}٪ تطابق
                  </span>
                </div>
                <p className="text-base font-bold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-slate-300">{item.subtitle}</p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 w-full rounded-xl bg-white/10 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  إضافة للخطة
                </motion.button>
              </motion.article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
