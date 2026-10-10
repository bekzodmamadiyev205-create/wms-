'use client'

import { useState } from 'react'
import { QrCode, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { findProduct } from '@/lib/wms/data'
import { ActionButton, BigCounter, InfoCard, ModuleScreen, QtyStepper, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useInitialScan, useWms } from '../wms-provider'
import { moduleIcon } from './registry'

type Stage = 'scan' | 'count' | 'done'

export function ReceivingModule() {
  const { t, data, notify, actions, navigate } = useWms()
  const [stage, setStage] = useState<Stage>('scan')
  const [code, setCode] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})

  const handleScan = (c: string) => {
    const wb = data.waybills[c]
    if (!wb) return notify('error', t('invalidCode', { code: c }))
    if (wb.status !== 'new') return notify('error', t('waybillAlreadyReceived'))
    setCode(c)
    setCounts(Object.fromEntries(wb.lines.map((l) => [l.barcode, l.qty])))
    setStage('count')
    notify('success', `${t('waybill')} ${c}`)
  }
  useInitialScan(handleScan)

  const waybill = code ? data.waybills[code] : null
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const newWaybills = Object.values(data.waybills)
    .filter((w) => w.status === 'new')
    .map((w) => w.code)

  const reset = () => {
    setStage('scan')
    setCode(null)
    setCounts({})
  }

  return (
    <ModuleScreen icon={moduleIcon('receiving')} title={t('receiving')} step={stage === 'scan' ? 0 : stage === 'count' ? 1 : 2}>
      {stage === 'scan' && (
        <ScanField
          icon={QrCode}
          title={t('recvScanTitle')}
          hint={t('recvScanHint')}
          onScan={handleScan}
          demoCodes={newWaybills}
        />
      )}

      {stage === 'count' && waybill && (
        <>
          <div className="flex flex-col gap-2">
            <InfoCard label={t('waybill')} value={waybill.code} />
            <InfoCard label={t('supplier')} value={waybill.supplier} mono={false} />
          </div>

          <BigCounter value={total} label={t('totalAccepted')} tone="success" />

          <p className="text-base text-muted-foreground">{t('recvCountHint')}</p>
          <ul className="flex flex-col gap-2">
            {waybill.lines.map((line) => {
              const product = findProduct(line.barcode)
              const value = counts[line.barcode] ?? 0
              const mismatch = value !== line.qty
              return (
                <li
                  key={line.barcode}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border-2 bg-card p-3',
                    mismatch ? 'border-primary' : 'border-transparent',
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-tight">{product?.name}</p>
                    <p className="font-mono text-sm text-muted-foreground">{line.barcode}</p>
                    <p className={cn('text-sm font-semibold', mismatch ? 'text-primary' : 'text-muted-foreground')}>
                      {t('expected')}: {line.qty} {t('pcs')}
                    </p>
                  </div>
                  <QtyStepper
                    value={value}
                    onChange={(v) => setCounts((prev) => ({ ...prev, [line.barcode]: v }))}
                  />
                </li>
              )
            })}
          </ul>

          <div className="sticky bottom-24 -mx-4 flex flex-col gap-2 bg-background px-4 pb-2 pt-3 shadow-[0_-8px_16px_-8px_rgba(0,0,0,0.4)]">
            <ActionButton
              disabled={total === 0}
              onClick={() => {
                actions.receiveWaybill(waybill.code, counts)
                setStage('done')
                notify('success', t('recvDone'))
              }}
            >
              <Send className="size-6" aria-hidden />
              {t('sendToPutaway')}
            </ActionButton>
            <ActionButton variant="secondary" onClick={reset}>
              {t('cancel')}
            </ActionButton>
          </div>
        </>
      )}

      {stage === 'done' && code && (
        <ResultPanel
          title={t('recvDone')}
          subtitle={code}
          actions={
            <>
              <ActionButton onClick={reset}>{t('scanNext')}</ActionButton>
              <ActionButton variant="secondary" onClick={() => navigate('putaway', code)}>
                {t('openPutaway')}
              </ActionButton>
            </>
          }
        >
          <p className="text-lg">
            {t('totalAccepted')}: <span className="font-mono font-bold text-success">{total}</span> {t('pcs')}
          </p>
        </ResultPanel>
      )}
    </ModuleScreen>
  )
}
