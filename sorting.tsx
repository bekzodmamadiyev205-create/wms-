'use client'

import { useState } from 'react'
import { PackageCheck, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MARKETPLACES, ROUTES, type Marketplace } from '@/lib/wms/data'
import { ActionButton, InfoCard, ModuleScreen, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useInitialScan, useWms } from '../wms-provider'
import { moduleIcon } from './registry'

export function SortingModule() {
  const { t, data, notify, actions, routeName } = useWms()
  const [pkgCode, setPkgCode] = useState<string | null>(null)
  const [sorted, setSorted] = useState<{ pkg: string; route: Marketplace } | null>(null)

  const handlePackage = (c: string) => {
    const pkg = data.packages[c]
    if (!pkg) return notify('error', t('invalidCode', { code: c }))
    if (pkg.status !== 'packed') return notify('error', t('packageNotReady'))
    setPkgCode(c)
    setSorted(null)
    notify('success', `${t('destinationShort')}: ${routeName(pkg.order.marketplace)}`)
  }
  useInitialScan(handlePackage)

  const pkg = pkgCode ? data.packages[pkgCode] : null
  const route = pkg?.order.marketplace

  const handleRouteBox = (c: string) => {
    if (!pkg || !route) return
    const scanned = MARKETPLACES.find((m) => ROUTES[m].box === c)
    if (!scanned) return notify('error', t('notRouteBox'))
    if (scanned !== route) return notify('error', t('wrongRoute', { route: routeName(route) }))
    actions.sortPackage(pkg.code)
    setSorted({ pkg: pkg.code, route })
    setPkgCode(null)
    notify('success', t('sortDone', { route: routeName(route) }))
  }

  const readyPackages = Object.values(data.packages)
    .filter((p) => p.status === 'packed')
    .map((p) => p.code)

  const step = sorted ? 2 : pkg ? 1 : 0

  return (
    <ModuleScreen icon={moduleIcon('sorting')} title={t('sorting')} step={step} steps={['stepScan', 'stepRoute', 'stepConfirm']}>
      {sorted && (
        <ResultPanel
          title={t('sortDone', { route: routeName(sorted.route) })}
          subtitle={`${sorted.pkg} → ${ROUTES[sorted.route].box}`}
          actions={<ActionButton onClick={() => setSorted(null)}>{t('scanNext')}</ActionButton>}
        />
      )}

      {!sorted && !pkg && (
        <ScanField
          icon={PackageCheck}
          title={t('sortScanTitle')}
          hint={t('sortScanHint')}
          onScan={handlePackage}
          demoCodes={readyPackages}
        />
      )}

      {!sorted && pkg && route && (
        <>
          <InfoCard label={t('order')} value={`${pkg.code} · ${pkg.order.id}`} />
          <div
            className="flex flex-col items-center gap-2 rounded-2xl p-6 text-center text-white"
            style={{ backgroundColor: ROUTES[route].color }}
          >
            <p className="text-base font-semibold uppercase tracking-wide opacity-90">{t('putInto')}</p>
            <p className="text-balance text-4xl font-bold">{routeName(route)}</p>
            <p className="rounded-lg bg-black/25 px-3 py-1 font-mono text-xl font-bold">{ROUTES[route].box}</p>
          </div>
          <ScanField
            variant="compact"
            icon={QrCode}
            title={t('sortScanRoute', { route: routeName(route) })}
            onScan={handleRouteBox}
            demoCodes={MARKETPLACES.map((m) => ROUTES[m].box)}
          />
          <ActionButton variant="secondary" onClick={() => setPkgCode(null)}>
            {t('cancel')}
          </ActionButton>
        </>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-bold uppercase tracking-wide text-muted-foreground">{t('routeBoxes')}</h2>
        <ul className="grid grid-cols-3 gap-2">
          {MARKETPLACES.map((m) => (
            <li
              key={m}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl border-2 bg-card p-3 text-center',
                route === m ? 'border-primary' : 'border-transparent',
              )}
            >
              <span className="size-3 rounded-full" style={{ backgroundColor: ROUTES[m].color }} aria-hidden />
              <span className="text-sm font-bold leading-tight">{routeName(m)}</span>
              <span className="font-mono text-2xl font-bold tabular-nums">{data.routeBoxes[m].length}</span>
            </li>
          ))}
        </ul>
      </div>
    </ModuleScreen>
  )
}
