'use client'

import { useState } from 'react'
import { Barcode, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { findProduct } from '@/lib/wms/data'
import { ActionButton, CellBadge, ModuleScreen, QtyStepper, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useInitialScan, useWms } from '../wms-provider'
import { moduleIcon } from './registry'

export function InventoryModule() {
  const { t, data, notify, actions } = useWms()
  const [cell, setCell] = useState<string | null>(null)
  const [counted, setCounted] = useState(0)
  const [result, setResult] = useState<{ cell: string; system: number; counted: number } | null>(null)

  const handleCell = (c: string) => {
    if (!data.stock[c]) return notify('error', t('cellNotFound'))
    setCell(c)
    setCounted(0)
    setResult(null)
    notify('success', `${t('cell')} ${c}`)
  }
  useInitialScan(handleCell)

  const stock = cell ? data.stock[cell] : null
  const product = stock?.barcode ? findProduct(stock.barcode) : null

  const handleItem = (barcode: string) => {
    if (!stock?.barcode || barcode !== stock.barcode) return notify('error', t('wrongItem'))
    setCounted((c) => c + 1)
  }

  const confirm = () => {
    if (!cell || !stock) return
    actions.saveInventory(cell, counted)
    setResult({ cell, system: stock.qty, counted })
    setCell(null)
    notify('success', t('invDone'))
  }

  const diff = result ? result.counted - result.system : 0

  return (
    <ModuleScreen icon={moduleIcon('inventory')} title={t('inventory')} step={result ? 2 : cell ? 1 : 0}>
      {result && (
        <ResultPanel
          title={t('invDone')}
          subtitle={result.cell}
          actions={<ActionButton onClick={() => setResult(null)}>{t('scanNext')}</ActionButton>}
        >
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-xl bg-background p-3">
              <p className="text-sm text-muted-foreground">{t('inSystem')}</p>
              <p className="font-mono text-3xl font-bold">{result.system}</p>
            </div>
            <div className="rounded-xl bg-background p-3">
              <p className="text-sm text-muted-foreground">{t('counted')}</p>
              <p className="font-mono text-3xl font-bold">{result.counted}</p>
            </div>
          </div>
          <p className={cn('text-xl font-bold', diff === 0 ? 'text-success' : 'text-primary')}>
            {diff === 0 ? t('invMatch') : t('invDiff', { n: diff > 0 ? `+${diff}` : diff })}
          </p>
        </ResultPanel>
      )}

      {!result && !cell && (
        <ScanField
          icon={MapPin}
          title={t('invScanCell')}
          hint={t('invScanCellHint')}
          onScan={handleCell}
          demoCodes={['A-01-02', 'B-02-03', 'C-03-05']}
        />
      )}

      {!result && cell && stock && (
        <>
          <div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-base text-muted-foreground">{t('cell')}</span>
              <CellBadge cell={cell} large />
            </div>
            <p className="text-xl font-bold">{product?.name ?? t('emptyCellCount')}</p>
            {product && <p className="font-mono text-sm text-muted-foreground">{product.barcode}</p>}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-card p-5" aria-live="polite">
            <p className="text-base font-semibold uppercase tracking-wide text-muted-foreground">{t('counted')}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-7xl font-bold tabular-nums leading-none text-primary">{counted}</span>
              <QtyStepper value={counted} onChange={setCounted} />
            </div>
          </div>

          {product && (
            <ScanField
              variant="compact"
              icon={Barcode}
              title={t('invCountHint')}
              onScan={handleItem}
              demoCodes={[product.barcode]}
            />
          )}

          <ActionButton onClick={confirm}>{t('confirmCount')}</ActionButton>
          <ActionButton variant="secondary" onClick={() => setCell(null)}>
            {t('cancel')}
          </ActionButton>
        </>
      )}
    </ModuleScreen>
  )
}
