'use client'

import { useId, useRef, useState } from 'react'
import { CornerDownLeft, Keyboard, ScanLine } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { normalizeCode } from '@/lib/wms/data'
import { useWms } from './wms-provider'

export function ScanField({
  title,
  hint,
  onScan,
  demoCodes = [],
  variant = 'hero',
  icon: Icon = ScanLine,
}: {
  title: string
  hint?: string
  onScan: (code: string) => void
  demoCodes?: string[]
  variant?: 'hero' | 'compact'
  icon?: LucideIcon
}) {
  const { t, training, registerScan } = useWms()
  const [value, setValue] = useState('')
  const [manual, setManual] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const submit = (raw: string) => {
    const code = normalizeCode(raw)
    if (!code) return
    registerScan()
    setValue('')
    onScan(code)
    inputRef.current?.focus()
  }

  const isHero = variant === 'hero'

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border-2 border-dashed border-primary/60 bg-card',
        isHero ? 'p-5' : 'p-4',
      )}
    >
      <label htmlFor={inputId} className={cn('flex gap-4', isHero ? 'flex-col items-center text-center' : 'items-center')}>
        <span
          className={cn(
            'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/15 text-primary',
            isHero ? 'size-24' : 'size-14',
          )}
          aria-hidden
        >
          <Icon className={isHero ? 'size-12' : 'size-7'} />
          <span className="scan-beam absolute inset-x-2 h-0.5 rounded-full bg-primary" />
        </span>
        <span className="flex flex-col gap-1">
          <span className={cn('text-balance font-bold leading-snug', isHero ? 'text-2xl' : 'text-lg')}>{title}</span>
          {hint && <span className="text-pretty text-base text-muted-foreground">{hint}</span>}
        </span>
      </label>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          submit(value)
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
          }}
          inputMode={manual ? 'text' : 'none'}
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={t('scanPlaceholder')}
          className="h-14 min-w-0 flex-1 rounded-xl border-2 border-border bg-background px-4 font-mono text-lg text-foreground placeholder:font-sans placeholder:text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            setManual((m) => !m)
            inputRef.current?.blur()
            requestAnimationFrame(() => inputRef.current?.focus())
          }}
          aria-pressed={manual}
          aria-label={t('manualInput')}
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-xl border-2',
            manual ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-background text-muted-foreground',
          )}
        >
          <Keyboard className="size-6" aria-hidden />
        </button>
        <button
          type="submit"
          aria-label="OK"
          className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground active:scale-95"
        >
          <CornerDownLeft className="size-6" aria-hidden />
        </button>
      </form>

      {training && demoCodes.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <p className="text-sm font-semibold text-muted-foreground">{t('demoCodes')}</p>
          <div className="flex flex-wrap gap-2">
            {demoCodes.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => submit(code)}
                className="min-h-11 rounded-lg bg-background px-3 font-mono text-base font-semibold text-foreground active:scale-95"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
