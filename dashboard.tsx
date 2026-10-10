'use client'

import { Clock, ScanLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MODULES } from './modules/registry'
import { useWms } from './wms-provider'

export function Dashboard() {
  const { t, navigate, pendingCounts, stats } = useWms()

  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <div className="rounded-2xl bg-card p-4">
        <h1 className="text-2xl font-bold">{t('greeting', { name: 'Aziz' })}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-base text-muted-foreground">
          <Clock className="size-4" aria-hidden />
          {t('shiftInfo')}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-background px-3 py-2.5">
            <p className="text-sm text-muted-foreground">{t('scansToday')}</p>
            <p className="font-mono text-2xl font-bold tabular-nums">{stats.scans}</p>
          </div>
          <div className="rounded-xl bg-background px-3 py-2.5">
            <p className="text-sm text-muted-foreground">{t('tasksDone')}</p>
            <p className="font-mono text-2xl font-bold tabular-nums text-success">{stats.tasks}</p>
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-base text-foreground">
        <ScanLine className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <span className="text-pretty">{t('dashHint')}</span>
      </p>

      <h2 className="text-lg font-bold uppercase tracking-wide text-muted-foreground">{t('modulesTitle')}</h2>
      <ul className="grid grid-cols-2 gap-3">
        {MODULES.map(({ id, icon: Icon }, i) => {
          const count = pendingCounts[id]
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => navigate(id)}
                className="relative flex h-32 w-full flex-col justify-between rounded-2xl bg-card p-4 text-left transition-transform active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="flex w-full items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-7" aria-hidden />
                  </span>
                  <span
                    className={cn(
                      'flex min-w-9 items-center justify-center rounded-full px-2 py-1 font-mono text-base font-bold tabular-nums',
                      count > 0 ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground',
                    )}
                  >
                    {count}
                    <span className="sr-only"> {t('pending')}</span>
                  </span>
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-muted-foreground">{i + 1}</span>
                  <span className="text-lg font-bold leading-tight">{t(id)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
