import { useState } from 'react'
import { ArrowRight, CalendarDays, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContent } from '@/lib/content-context'

export function MarketBoard() {
  const { marketBoard } = useContent()
  const [tab, setTab] = useState(0)
  const active = marketBoard.tabs[tab] ?? marketBoard.tabs[0]!

  return (
    <section aria-labelledby="market-board-title" className="relative z-10 bg-sand pb-16">
      <div className="container-page -mt-10">
        <div className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_24px_60px_-40px_rgba(1,51,101,0.55)]">
          <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Resumen del cierre */}
            <div className="border-b border-line bg-navy p-6 text-white lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between gap-3">
                <h2
                  id="market-board-title"
                  className="text-xs font-bold uppercase tracking-[0.16em] text-azure-light"
                >
                  {marketBoard.title}
                </h2>
                <span className="group relative">
                  <Info size={15} className="text-white/60" aria-hidden="true" />
                  <span className="pointer-events-none absolute right-0 top-6 z-20 w-56 rounded-md bg-navy-900 p-2 text-[11px] leading-snug text-white/85 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {marketBoard.note}
                  </span>
                </span>
              </div>

              <label className="mt-4 flex items-center gap-2 rounded border border-white/25 bg-white/5 px-3 py-2 text-sm">
                <CalendarDays size={15} className="text-white/60" aria-hidden="true" />
                <span className="sr-only">Fecha del cierre</span>
                <input
                  type="text"
                  defaultValue={marketBoard.date}
                  readOnly
                  className="w-full bg-transparent text-white focus:outline-none"
                />
              </label>

              <dl className="mt-5 space-y-3">
                {marketBoard.summary.map((item) => (
                  <div key={item.label} className="rounded border border-white/15 bg-white/[0.06] px-4 py-3">
                    <dt className="text-[13px] text-white/65">{item.label}</dt>
                    <dd className="mt-0.5 text-xl font-bold tabular-nums text-white">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <a
                href="#"
                className="mt-5 inline-flex w-full items-center justify-between gap-2 rounded bg-azure px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azure-light"
              >
                {marketBoard.cta}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>

            {/* Tablero */}
            <div className="min-w-0">
              <div className="flex" role="tablist" aria-label="Mercados">
                {marketBoard.tabs.map((t, i) => (
                  <button
                    key={t.label}
                    role="tab"
                    type="button"
                    aria-selected={tab === i}
                    onClick={() => setTab(i)}
                    className={cn(
                      'flex-1 border-b-2 px-4 py-3.5 text-[13px] font-bold uppercase tracking-[0.08em] transition-colors',
                      tab === i
                        ? 'border-azure bg-tint text-navy'
                        : 'border-transparent bg-white text-muted hover:bg-tint/60 hover:text-navy',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="bg-navy-600 text-white">
                      {active.columns.map((col) => (
                        <th key={col} scope="col" className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {active.rows.map((row, i) => (
                      <tr
                        key={row[0]}
                        className={cn('border-b border-line last:border-0', i % 2 === 1 && 'bg-tint/60')}
                      >
                        {row.map((cell, j) => (
                          <td
                            key={`${row[0]}-${j}`}
                            className={cn(
                              'px-4 py-2.5',
                              j === 0 ? 'font-mono text-[13px] text-muted' : 'text-ink',
                              j >= 2 && 'tabular-nums',
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="border-t border-line bg-white px-4 py-3 text-[12px] text-muted">
                {marketBoard.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
