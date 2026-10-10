'use client'

import { useState } from 'react'
import { Bell, BellOff, CircleCheck, Info, RefreshCw, Server, TriangleAlert, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/wms/i18n'
import { ActionButton, InfoCard } from './primitives'
import { useWms } from './wms-provider'

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold">{children}</h1>
}

export function AlertsScreen() {
  const { t, data, actions } = useWms()
  const toneIcon = { info: Info, warn: TriangleAlert, success: CircleCheck }
  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <ScreenTitle>{t('alertsTitle')}</ScreenTitle>
      {data.alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-12 text-muted-foreground">
          <BellOff className="size-10" aria-hidden />
          <p className="text-lg">{t('noAlerts')}</p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {data.alerts.map((a) => {
              const Icon = toneIcon[a.tone]
              return (
                <li
                  key={a.id}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border-l-4 bg-card p-4',
                    a.read ? 'border-transparent opacity-70' : 'border-primary',
                  )}
                >
                  <Icon
                    className={cn(
                      'mt-0.5 size-6 shrink-0',
                      a.tone === 'warn' && 'text-primary',
                      a.tone === 'success' && 'text-success',
                      a.tone === 'info' && 'text-foreground',
                    )}
                    aria-hidden
                  />
                  <p className="flex-1 text-pretty text-lg font-semibold leading-snug">{t(a.key, a.params)}</p>
                  <span className="font-mono text-sm text-muted-foreground">{a.time}</span>
                </li>
              )
            })}
          </ul>
          <ActionButton variant="secondary" onClick={actions.markAlertsRead}>
            <Bell className="size-5" aria-hidden />
            {t('markAllRead')}
          </ActionButton>
        </>
      )}
    </section>
  )
}

export function SyncScreen() {
  const { t, data, actions, online, setOnline, notify } = useWms()
  const [syncing, setSyncing] = useState(false)

  const run = () => {
    if (!online) return notify('error', t('offlineWarn'))
    setSyncing(true)
    setTimeout(() => {
      actions.syncNow()
      setSyncing(false)
      notify('success', t('synced'))
    }, 1200)
  }

  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <ScreenTitle>{t('syncTitle')}</ScreenTitle>
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-8">
        <div
          className={cn(
            'flex size-20 items-center justify-center rounded-full',
            online ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
          )}
        >
          {online ? <Wifi className="size-10" aria-hidden /> : <WifiOff className="size-10" aria-hidden />}
        </div>
        <p className="text-xl font-bold">{online ? t('online') : t('offline')}</p>
        {!online && <p className="px-4 text-center text-base text-muted-foreground">{t('offlineWarn')}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <InfoCard label={t('lastSync')} value={data.lastSync} />
        <InfoCard label={t('pendingOps')} value={String(data.pendingOps)} />
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3">
          <span className="flex items-center gap-2 text-base text-muted-foreground">
            <Server className="size-4" aria-hidden />
            {t('server')}
          </span>
          <span className="font-mono text-base font-bold">wms.local:8443</span>
        </div>
      </div>
      <ActionButton onClick={run} disabled={syncing}>
        <RefreshCw className={cn('size-6', syncing && 'animate-spin')} aria-hidden />
        {syncing ? t('syncing') : t('syncNow')}
      </ActionButton>
      <ActionButton variant="secondary" onClick={() => setOnline(!online)}>
        {online ? <WifiOff className="size-5" aria-hidden /> : <Wifi className="size-5" aria-hidden />}
        {online ? t('simulateOffline') : t('online')}
      </ActionButton>
    </section>
  )
}

export function ProfileScreen() {
  const { t, stats, lang, setLang, training, setTraining } = useWms()
  const langs: { id: Lang; label: string }[] = [
    { id: 'uz', label: "O'zbekcha" },
    { id: 'ru', label: 'Русский' },
  ]
  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground" aria-hidden>
          AK
        </div>
        <div>
          <h1 className="text-2xl font-bold">Aziz Karimov</h1>
          <p className="text-base text-muted-foreground">{t('role')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm text-muted-foreground">{t('scansToday')}</p>
          <p className="font-mono text-3xl font-bold">{stats.scans}</p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm text-muted-foreground">{t('tasksDone')}</p>
          <p className="font-mono text-3xl font-bold text-success">{stats.tasks}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <InfoCard label={t('employeeId')} value="WH-0142" />
        <InfoCard label={t('shift')} value="08:00 – 20:00" />
        <InfoCard label={t('zone')} value="A-1" />
        <InfoCard label={t('device')} value="TSD-07" />
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
        <p className="text-base font-bold">{t('language')}</p>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('language')}>
          {langs.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={lang === l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                'min-h-14 rounded-xl text-lg font-bold',
                lang === l.id ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={training}
        onClick={() => setTraining(!training)}
        className="flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-card p-4 text-left"
      >
        <span>
          <span className="block text-lg font-bold">{t('trainingMode')}</span>
          <span className="block text-sm text-muted-foreground">{t('trainingHint')}</span>
        </span>
        <span
          className={cn(
            'relative flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors',
            training ? 'bg-primary' : 'bg-background',
          )}
          aria-hidden
        >
          <span className={cn('size-6 rounded-full bg-white transition-transform', training && 'translate-x-6')} />
        </span>
      </button>
    </section>
  )
}
