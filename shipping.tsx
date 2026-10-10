'use client'

import { useState } from 'react'
import { Check, QrCode, Truck } from 'lucide-react'
import { MARKETPLACES, ROUTES, unitsIn } from '@/lib/wms/data'
import { ActionButton, ModuleScreen, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useInitialScan, useWms } from '../wms-provider'
import { moduleIcon } from './registry'

interface LoadEntry {
  code: string
  packages: string[]
  units: number
}

export function ShippingModule() {
  const { t, data, notify, actions } = useWms()
  const [vehicleCode, setVehicleCode] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<LoadEntry[]>([])
  const [shipped, setShipped] = useState<{ plate: string; units: number } | null>(null)

  const handleVehicle = (c: string) => {
    const v = data.vehicles[c]
    if (!v) return notify('error', t('vehicleNotFound'))
    setVehicleCode(c)
    setLoaded([])
    setShipped(null)
    notify('success', v.plate)
  }
  useInitialScan(handleVehicle)

  const vehicle = vehicleCode ? data.vehicles[vehicleCode] : null
  const loadedPkgs = new Set(loaded.flatMap((e) => e.packages))
  const totalUnits = loaded.reduce((s, e) => s + e.units, 0)

  const handleLoad = (c: string) => {
    const route = MARKETPLACES.find((m) => ROUTES[m].box === c)
    let pkgs: string[] = []
    if (route) {
      pkgs = data.routeBoxes[route].filter((p) => !loadedPkgs.has(p))
      if (data.routeBoxes[route].length === 0) return notify('error', t('boxEmpty'))
    } else if (data.packages[c]?.status === 'sorted') {
      pkgs = loadedPkgs.has(c) ? [] : [c]
    } else {
      return notify('error', t('invalidCode', { code: c }))
    }
    if (pkgs.length === 0) return notify('error', t('alreadyLoaded'))
    const units = pkgs.reduce((s, p) => s + unitsIn(data.packages[p].order.lines), 0)
    setLoaded((prev) => [{ code: c, packages: pkgs, units }, ...prev])
    notify('success', `+${units} ${t('pcs')} · ${c}`)
  }

  const readyCodes = [
    ...MARKETPLACES.filter((m) => data.routeBoxes[m].some((p) => !loadedPkgs.has(p))).map((m) => ROUTES[m].box),
  ]

  const finish = () => {
    if (!vehicle) return
    actions.finishShipment(vehicle.code, [...loadedPkgs])
    setShipped({ plate: vehicle.plate, units: totalUnits })
    setVehicleCode(null)
    setLoaded([])
    notify('success', t('shipDone'))
  }

  const step = shipped ? 2 : vehicle ? 1 : 0

  return (
    <ModuleScreen icon={moduleIcon('shipping')} title={t('shipping')} step={step} steps={['stepVehicle', 'stepLoad', 'stepConfirm']}>
      {shipped && (
        <ResultPanel
          title={t('shipDone')}
          subtitle={shipped.plate}
          actions={<ActionButton onClick={() => setShipped(null)}>{t('scanNext')}</ActionButton>}
        >
          <p className="text-lg">
            {t('loadedItems')}: <span className="font-mono font-bold text-success">{shipped.units}</span> {t('pcs')}
          </p>
        </ResultPanel>
      )}

      {!shipped && !vehicle && (
        <ScanField
          icon={QrCode}
          title={t('shipScanTitle')}
          hint={t('shipScanHint')}
          onScan={handleVehicle}
          demoCodes={Object.keys(data.vehicles)}
        />
      )}

      {!shipped && vehicle && (
        <>
          <div className="flex items-center gap-3 rounded-2xl bg-card p-4">
            <Truck className="size-10 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="mb-1 inline-flex rounded-md border-2 border-foreground bg-white px-2 py-0.5 font-mono text-2xl font-bold tracking-wider text-slate-900">
                {vehicle.plate}
              </p>
              <p className="text-base text-muted-foreground">
                {t('driver')}: <span className="font-semibold text-foreground">{vehicle.driver}</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-5" aria-live="polite">
            <p className="text-base font-semibold uppercase tracking-wide text-muted-foreground">
              {t('loadingSession')} · {t('loadedItems')}
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-7xl font-bold tabular-nums leading-none text-primary">{totalUnits}</span>
              <span className="text-xl font-semibold text-muted-foreground">{t('pcs')}</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background px-3 py-2">
                <p className="text-sm text-muted-foreground">{t('loadedBoxes')}</p>
                <p className="font-mono text-2xl font-bold">{loaded.length}</p>
              </div>
              <div className="rounded-xl bg-background px-3 py-2">
                <p className="text-sm text-muted-foreground">{t('loadedPackages')}</p>
                <p className="font-mono text-2xl font-bold">{loadedPkgs.size}</p>
              </div>
            </div>
          </div>

          <ScanField variant="compact" icon={QrCode} title={t('shipScanBox')} onScan={handleLoad} demoCodes={readyCodes} />

          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold uppercase tracking-wide text-muted-foreground">{t('loadedList')}</h2>
            {loaded.length === 0 ? (
              <p className="rounded-xl bg-card p-4 text-center text-base text-muted-foreground">{t('nothingLoaded')}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {loaded.map((e) => (
                  <li key={`${e.code}-${e.packages[0]}`} className="flex items-center justify-between gap-3 rounded-xl bg-card p-3">
                    <span className="flex items-center gap-2">
                      <Check className="size-5 text-success" aria-hidden />
                      <span className="font-mono text-lg font-bold">{e.code}</span>
                    </span>
                    <span className="font-mono text-lg font-bold text-success">
                      +{e.units} {t('pcs')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ActionButton variant="success" disabled={loaded.length === 0} onClick={finish}>
            <Check className="size-6" aria-hidden />
            {t('finishLoading')}
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => setVehicleCode(null)}>
            {t('cancel')}
          </ActionButton>
        </>
      )}
    </ModuleScreen>
  )
}
