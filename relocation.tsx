'use client'

import { useState } from 'react'
import { ArrowDown, Barcode, MapPin } from 'lucide-react'
import { findProduct } from '@/lib/wms/data'
import { ActionButton, CellBadge, ModuleScreen, QtyStepper, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useInitialScan, useWms } from '../wms-provider'
import { moduleIcon } from './registry'

type Stage = 'source' | 'item' | 'target' | 'done'

export function RelocationModule() {
  const { t, data, notify, actions } = useWms()
  const [stage, setStage] = useState<Stage>('source')
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)
  const [qty, setQty] = useState(1)

  const handleSource = (c: string) => {
    const cell = data.stock[c]
    if (!cell) return notify('error', t('cellNotFound'))
    if (!cell.barcode || cell.qty === 0) return notify('error', t('cellEmpty'))
    setFrom(c)
    setQty(1)
    setStage('item')
    notify('success', `${t('cell')} ${c}`)
  }
  useInitialScan(handleSource)

  const source = from ? data.stock[from] : null
  const product = source?.barcode ? findProduct(source.barcode) : null

  const handleItem = (barcode: string) => {
    if (barcode !== source?.barcode) return notify('error', t('wrongItem'))
    setStage('target')
    notify('success', product?.name ?? barcode)
  }

  const handleTarget = (c: string) => {
    const target = data.stock[c]
    if (!target) return notify('error', t('cellNotFound'))
    if (c === from) return notify('error', t('sameCell'))
    if (target.barcode && target.barcode !== source?.barcode) return notify('error', t('cellOccupied'))
    if (!from) return
    actions.relocate(from, c, qty)
    setTo(c)
    setStage('done')
    notify('success', t('relDone'))
  }

  const sourceDemo = Object.entries(data.stock)
    .filter(([, s]) => s.qty > 0)
    .slice(0, 3)
    .map(([c]) => c)
  const targetDemo = Object.entries(data.stock)
    .filter(([c, s]) => c !== from && (!s.barcode || s.barcode === source?.barcode))
    .map(([c]) => c)

  const reset = () => {
    setStage('source')
    setFrom(null)
    setTo(null)
    setQty(1)
  }

  const step = stage === 'source' ? 0 : stage === 'item' ? 1 : 2

  return (
    <ModuleScreen icon={moduleIcon('relocation')} title={t('relocation')} step={step} steps={['stepFrom', 'stepItem', 'stepTo']}>
      {stage === 'source' && (
        <ScanField icon={MapPin} title={t('relScanSource')} hint={t('relScanSourceHint')} onScan={handleSource} demoCodes={sourceDemo} />
      )}

      {(stage === 'item' || stage === 'target') && from && source && product && (
        <>
          <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-base text-muted-foreground">{t('stepFrom')}</span>
              <CellBadge cell={from} large />
            </div>
            <p className="text-xl font-bold">{product.name}</p>
            <p className="text-base text-muted-foreground">
              {t('available')}: <span className="font-mono font-bold text-foreground">{source.qty}</span> {t('pcs')}
            </p>
          </div>

          {stage === 'item' && (
            <ScanField variant="compact" icon={Barcode} title={t('relScanItem')} onScan={handleItem} demoCodes={[product.barcode]} />
          )}

          {stage === 'target' && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-card p-4">
                <span className="text-lg font-bold">{t('quantity')}</span>
                <QtyStepper value={qty} onChange={setQty} min={1} max={source.qty} />
              </div>
              <ArrowDown className="mx-auto size-8 text-primary" aria-hidden />
              <ScanField
                variant="compact"
                icon={MapPin}
                title={t('relScanTarget')}
                onScan={handleTarget}
                demoCodes={targetDemo.slice(0, 3)}
              />
            </>
          )}

          <ActionButton variant="secondary" onClick={reset}>
            {t('cancel')}
          </ActionButton>
        </>
      )}

      {stage === 'done' && from && to && (
        <ResultPanel
          title={t('relDone')}
          subtitle={`${from} → ${to}`}
          actions={<ActionButton onClick={reset}>{t('scanNext')}</ActionButton>}
        >
          <p className="text-lg">
            {t('quantity')}: <span className="font-mono font-bold text-success">{qty}</span> {t('pcs')}
          </p>
        </ResultPanel>
      )}
    </ModuleScreen>
  )
}
