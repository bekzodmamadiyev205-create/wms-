'use client'

import { useEffect, useState } from 'react'
import { BatteryMedium, MapPin, Smartphone, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/wms/i18n'
import { useWms } from './wms-provider'

const LANGS: { id: Lang; label: string }[] = [
  { id: 'uz', label: "O'zbekcha" },
  { id: 'ru', label: 'Русский' },
]

function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono tabular-nums">{time}</span>
}

export function AppHeader() {
  const { t, lang, setLang, online } = useWms()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between gap-2 bg-black/20 px-4 py-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Smartphone className="size-4" aria-hidden />
          <span className="sr-only">{t('device')}:</span>
          <span className="font-mono font-semibold text-foreground">TSD-07</span>
        </span>
        <span className={cn('flex items-center gap-1.5 font-semibold', online ? 'text-success' : 'text-destructive')}>
          {online ? <Wifi className="size-4" aria-hidden /> : <WifiOff className="size-4" aria-hidden />}
          {online ? t('online') : t('offline')}
        </span>
        <span className="flex items-center gap-1.5">
          <BatteryMedium className="size-4" aria-hidden />
          <span className="sr-only">{t('battery')}:</span>
          <span className="font-mono">86%</span>
        </span>
        <Clock />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
            aria-hidden
          >
            AK
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-base font-bold">
              <span className="sr-only">{t('operator')}: </span>Aziz Karimov
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden />
              {t('zone')} A-1
            </p>
          </div>
        </div>

        <div role="radiogroup" aria-label="Til / Язык" className="flex shrink-0 rounded-xl bg-card p-1">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={lang === l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                'min-h-11 rounded-lg px-2.5 text-sm font-bold transition-colors',
                lang === l.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
