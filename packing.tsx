'use client'

import { useState } from 'react'
import { ArrowRight, Barcode, Box, Check, PackageCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { findProduct, unitsIn } from '@/lib/wms/data'
import { ActionButton, BigCounter, InfoCard, ModuleScreen, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useInitialScan, useWms } from '../wms-provider'
import { moduleIcon } from './registry'
import { RouteTag } from './picking'

type Stage = 'scan' | 'pack' | 'package' | 'done'

export function PackingModule() {
  const { t, data, notify, actions } = useWms()
  const [stage, setStage] = useState<Stage>('scan')
  const [boxCode, setBoxCode] = useState<string | null>(null)
  const [packedCount, setPackedCount] = useState<Record<string, number>>({})
  const [pkgCode, setPkgCode] = useState<string | null>(null)

  const handleBox = (c: string) => {
    const box = data.pickBoxes[c]
    if (!box || box.status !== 'picked') return notify('error', t('boxNotFound'))
    setBoxCode(c)
    setPackedCount({})
    setStage('pack')
    notify('success', `${t('order')} ${box.order.id}`)
  }
  useInitialScan(handleBox)

  const box = boxCode ? data.pickBoxes[boxCode] : null
  const total = box ? unitsIn(box.order.lines) : 0
  const packed = Object.values(packedCount).reduce((a, b) => a + b, 0)
  const nextLine = box?.order.lines.find((l) => (packedCount[l.barcode] ?? 0) < l.qty)

  const handleItem = (barcode: string) => {
    const line = box?.order.lines.find((l) => l.barcode === barcode)
    if (!line) return notify('error', t('wrongItem'))
    const current = packedCount[barcode] ?? 0
    if (current >= line.qty) return notify('error', t('itemAlreadyComplete'))
    setPackedCount((prev) => ({ ...prev, [barcode]: current + 1 }))
    notify('success', `${findProduct(barcode)?.name} ${current + 1}/${line.qty}`)
  }

  const handlePackage = (c: string) => {
    if (!c.startsWith('PKG-')) return notify('error', t('invalidPackage'))
    if (data.packages[c]) return notify('error', t('packageInUse'))
    if (!boxCode) return
    actions.packToPackage(boxCode, c)
    setPkgCode(c)
    setStage('done')
    notify('success', t('packDone'))
  }

  const freePkg = () => {
    let n = 2005
    while (data.packages[`PKG-${n}`]) n++
    return `PKG-${n}`
  }

  const readyBoxes = Object.values(data.pickBoxes)
    .filter((b) => b.status === 'picked')
    .map((b) => b.code)

  const reset = () => {
    setStage('scan')
    setBoxCode(null)
    setPkgCode(null)
    setPackedCount({})
  }

  const step = stage === 'scan' ? 0 : stage === 'pack' ? 1 : 2

  return (
    <ModuleScreen icon={moduleIcon('packing')} title={t('packing')} step={step} steps={['stepScan', 'stepPack', 'stepBox']}>
      {stage === 'scan' && (
        <ScanField icon={Box} title={t('packScanTitle')} hint={t('packScanHint')} onScan={handleBox} demoCodes={readyBoxes} />
      )}

      {stage === 'pack' && box && (
        <>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-card px-4 py-3">
            <div>
              <p className="font-mono text-lg font-bold">{box.code}</p>
              <p className="font-mono text-sm text-muted-foreground">{box.order.id}</p>
            </div>
            <RouteTag marketplace={box.order.marketplace} />
          </div>
          <BigCounter value={total - packed} total={total} label={t('remaining')} />

          {packed < total && (
            <ScanField
              variant="compact"
              icon={Barcode}
              title={t('packScanItem')}
              onScan={handleItem}
              demoCodes={nextLine ? [nextLine.barcode] : []}
            />
          )}

          <ul className="flex flex-col gap-2">
            {box.order.lines.map((l) => {
              const p = packedCount[l.barcode] ?? 0
              const complete = p >= l.qty
              return (
                <li key={l.barcode} className={cn('flex items-center justify-between gap-3 rounded-xl bg-card p-3', complete && 'opacity-60')}>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold">{findProduct(l.barcode)?.name}</p>
                    <p className="font-mono text-sm text-muted-foreground">{l.barcode}</p>
                  </div>
                  <span className={cn('font-mono text-xl font-bold tabular-nums', complete && 'text-success')}>
                    {complete ? <Check className="size-7" aria-label={t('done')} /> : `${p}/${l.qty}`}
                  </span>
                </li>
              )
            })}
          </ul>

          {packed >= total && (
            <ActionButton variant="success" onClick={() => setStage('package')}>
              {t('continuePack')}
              <ArrowRight className="size-6" aria-hidden />
            </ActionButton>
          )}
        </>
      )}

      {stage === 'package' && box && (
        <>
          <InfoCard label={t('packed')} value={`${total} ${t('pcs')}`} />
          <ScanField
            icon={PackageCheck}
            title={t('scanPackageTitle')}
            hint={t('scanPackageHint')}
            onScan={handlePackage}
            demoCodes={[freePkg()]}
          />
        </>
      )}

      {stage === 'done' && pkgCode && box && (
        <ResultPanel
          title={t('packDone')}
          subtitle={`${box.code} → ${pkgCode}`}
          actions={<ActionButton onClick={reset}>{t('scanNext')}</ActionButton>}
        >
          <RouteTag marketplace={box.order.marketplace} />
        </ResultPanel>
      )}
    </ModuleScreen>
  )
}
