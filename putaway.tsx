'use client'

import { useState } from 'react'
import { Barcode, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { findProduct } from '@/lib/wms/data'
import { ActionButton, BigCounter, CellBadge, InfoCard, ModuleScreen, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useInitialScan, useWms } from '../wms-provider'
import { moduleIcon } from './registry'

export function PutawayModule() {
  const { t, data, notify, actions } = useWms()
  const [code, setCode] = useState<string | null>(null)
  const [lastBarcode, setLastBarcode] = useState<string | null>(null)

  const handleWaybill = (c: string) => {
    const wb = data.waybills[c]
    if (!wb) return notify('error', t('invalidCode', { code: c }))
    if (wb.status === 'new') return notify('error', t('putNotReady'))
    if (wb.status === 'stored') return notify('error', t('putAlreadyDone'))
    setCode(c)
    setLastBarcode(null)
    notify('success', `${t('waybill')} ${c}`)
  }
  useInitialScan(handleWaybill)

  const waybill = code ? data.waybills[code] : null
  const accepted = waybill ? Object.values(waybill.accepted).reduce((a, b) => a + b, 0) : 0
  const placed = waybill ? Object.values(waybill.placed).reduce((a, b) => a + b, 0) : 0
  const remaining = accepted - placed
  const done = waybill !== null && remaining <= 0

  const handleItem = (barcode: string) => {
    if (!waybill) return
    const need = waybill.accepted[barcode]
    if (!need) return notify('error', t('itemNotInWaybill'))
    if ((waybill.placed[barcode] ?? 0) >= need) return notify('error', t('itemAlreadyComplete'))
    actions.putawayItem(waybill.code, barcode)
    setLastBarcode(barcode)
    const product = findProduct(barcode)
    notify('success', `${t('placeIn')}: ${product?.cell}`)
  }

  const nextBarcodes = waybill
    ? Object.entries(waybill.accepted)
        .filter(([b, q]) => (waybill.placed[b] ?? 0) < q)
        .map(([b]) => b)
    : []
  const readyWaybills = Object.values(data.waybills)
    .filter((w) => w.status === 'received')
    .map((w) => w.code)
  const lastProduct = lastBarcode ? findProduct(lastBarcode) : null

  const reset = () => {
    setCode(null)
    setLastBarcode(null)
  }

  return (
    <ModuleScreen icon={moduleIcon('putaway')} title={t('putaway')} step={!waybill ? 0 : done ? 2 : 1}>
      {!waybill && (
        <ScanField
          icon={QrCode}
          title={t('putScanTitle')}
          hint={t('putScanHint')}
          onScan={handleWaybill}
          demoCodes={readyWaybills}
        />
      )}

      {waybill && !done && (
        <>
          <InfoCard label={t('waybill')} value={waybill.code} />
          <BigCounter value={remaining} total={accepted} label={t('remainingItems')} />

          {lastProduct && (
            <div className="flex flex-col gap-2 rounded-2xl border-2 border-primary bg-card p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('lastPlaced')}</p>
              <p className="text-xl font-bold">{lastProduct.name}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base text-muted-foreground">{t('placeIn')}</span>
                <CellBadge cell={lastProduct.cell} large />
              </div>
            </div>
          )}

          <ScanField
            variant="compact"
            icon={Barcode}
            title={t('putScanItem')}
            onScan={handleItem}
            demoCodes={nextBarcodes.slice(0, 2)}
          />

          <ul className="flex flex-col gap-2">
            {Object.entries(waybill.accepted).map(([barcode, qty]) => {
              const product = findProduct(barcode)
              const p = waybill.placed[barcode] ?? 0
              const complete = p >= qty
              return (
                <li key={barcode} className="flex items-center justify-between gap-3 rounded-xl bg-card p-3">
                  <div className="min-w-0">
                    <p className={cn('truncate text-base font-bold', complete && 'text-muted-foreground line-through')}>
                      {product?.name}
                    </p>
                    {product && <CellBadge cell={product.cell} />}
                  </div>
                  <span className={cn('font-mono text-xl font-bold tabular-nums', complete && 'text-success')}>
                    {p}/{qty}
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {waybill && done && (
        <ResultPanel
          title={t('putDone')}
          subtitle={waybill.code}
          actions={<ActionButton onClick={reset}>{t('scanNext')}</ActionButton>}
        >
          <p className="text-lg">
            {t('total')}: <span className="font-mono font-bold text-success">{accepted}</span> {t('pcs')}
          </p>
        </ResultPanel>
      )}
    </ModuleScreen>
  )
}
