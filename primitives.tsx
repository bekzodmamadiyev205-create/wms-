'use client'

import { ArrowLeft, Check, CircleCheck, Minus, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWms } from './wms-provider'
import type { TKey } from '@/lib/wms/i18n'

export function ActionButton({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'success' }) {
  return (
    <button
      type="button"
      className={cn(
        'flex min-h-14 w-full items-center justify-center gap-2 rounded-xl px-5 text-lg font-bold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'secondary' && 'border-2 border-border bg-card text-foreground',
        variant === 'success' && 'bg-success text-success-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ModuleScreen({
  icon: Icon,
  title,
  step,
  steps = ['stepScan', 'stepCount', 'stepConfirm'],
  children,
}: {
  icon: LucideIcon
  title: string
  step: number
  steps?: TKey[]
  children: React.ReactNode
}) {
  const { navigate, t } = useWms()
  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-3" aria-label={title}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card text-foreground active:scale-95"
          aria-label={t('back')}
        >
          <ArrowLeft className="size-6" aria-hidden />
        </button>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="size-6" aria-hidden />
        </div>
        <h1 className="text-balance text-2xl font-bold leading-tight">{title}</h1>
      </div>
      <StepIndicator current={step} steps={steps} />
      {children}
    </section>
  )
}

export function StepIndicator({ current, steps }: { current: number; steps: TKey[] }) {
  const { t } = useWms()
  return (
    <ol className="flex items-center gap-1" aria-label={t('stepOf', { n: current + 1, total: steps.length })}>
      {steps.map((key, i) => {
        const done = i < current
        const active = i === current
        return (
          <li
            key={key}
            className={cn('flex min-w-0 items-center', active ? 'flex-1' : 'flex-none')}
            aria-current={active ? 'step' : undefined}
          >
            <div
              className={cn(
                'flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2',
                active && 'bg-primary/15 text-primary',
                done && 'text-success',
                !active && !done && 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  active && 'bg-primary text-primary-foreground',
                  done && 'bg-success text-success-foreground',
                  !active && !done && 'bg-card',
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn('truncate text-sm font-semibold', !active && 'sr-only')}>{t(key)}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function BigCounter({
  value,
  total,
  label,
  tone = 'primary',
}: {
  value: number
  total?: number
  label: string
  tone?: 'primary' | 'success' | 'neutral'
}) {
  const { t } = useWms()
  const pct = total ? Math.min(100, Math.round(((total - value) / total) * 100)) : 0
  return (
    <div className="rounded-2xl bg-card p-5" aria-live="polite">
      <p className="text-base font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span
          className={cn(
            'font-mono text-7xl font-bold tabular-nums leading-none',
            tone === 'primary' && 'text-primary',
            tone === 'success' && 'text-success',
          )}
        >
          {value}
        </span>
        {total !== undefined && (
          <span className="text-xl font-semibold text-muted-foreground">
            / {total} {t('pcs')}
          </span>
        )}
        {total === undefined && <span className="text-xl font-semibold text-muted-foreground">{t('pcs')}</span>}
      </p>
      {total !== undefined && (
        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-background"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div className="h-full rounded-full bg-success transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}

export function ResultPanel({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
  actions: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-5 py-8 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-success/15">
          <CircleCheck className="size-12 text-success" aria-hidden />
        </div>
        <h2 className="text-balance text-2xl font-bold">{title}</h2>
        {subtitle && <p className="font-mono text-lg text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
      <div className="flex flex-col gap-3">{actions}</div>
    </div>
  )
}

export function QtyStepper({
  value,
  onChange,
  min = 0,
  max,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  const { t } = useWms()
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex size-12 items-center justify-center rounded-xl bg-background text-foreground active:scale-95 disabled:opacity-40"
        aria-label={t('decrease')}
      >
        <Minus className="size-6" aria-hidden />
      </button>
      <span className="w-12 text-center font-mono text-2xl font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        disabled={max !== undefined && value >= max}
        className="flex size-12 items-center justify-center rounded-xl bg-background text-foreground active:scale-95 disabled:opacity-40"
        aria-label={t('increase')}
      >
        <Plus className="size-6" aria-hidden />
      </button>
    </div>
  )
}

export function InfoCard({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3">
      <span className="text-base text-muted-foreground">{label}</span>
      <span className={cn('text-right text-lg font-bold', mono && 'font-mono')}>{value}</span>
    </div>
  )
}

export function CellBadge({ cell, large }: { cell: string; large?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-lg border-2 border-primary bg-primary/10 font-mono font-bold text-primary',
        large ? 'px-3 py-2 text-2xl' : 'px-2 py-1 text-base',
      )}
    >
      {cell}
    </span>
  )
}
