'use client'

import { X } from 'lucide-react'
import { ScanField } from './scan-field'
import { useWms } from './wms-provider'

export function GlobalScanSheet({ onClose }: { onClose: () => void }) {
  const { t, data, navigate, notify } = useWms()

  const handleScan = (code: string) => {
    const wb = data.waybills[code]
    if (wb) {
      onClose()
      return navigate(wb.status === 'new' ? 'receiving' : 'putaway', code)
    }
    const target = data.pickBoxes[code]
      ? 'packing'
      : data.packages[code]
        ? 'sorting'
        : data.vehicles[code]
          ? 'shipping'
          : code in data.stock
            ? 'inventory'
            : null
    if (!target) return notify('error', t('invalidCode', { code }))
    onClose()
    navigate(target, code)
  }

  const demo = [
    'NK-24001',
    'NK-23998',
    'BOX-1001',
    'PKG-2001',
    'TRK-01A777AA',
    'B-02-01',
  ]

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70" role="dialog" aria-modal="true" aria-label={t('globalScanTitle')}>
      <button type="button" className="absolute inset-0 cursor-default" aria-label={t('close')} onClick={onClose} tabIndex={-1} />
      <div className="relative w-full max-w-md animate-in slide-in-from-bottom-8 rounded-t-3xl bg-background p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-base font-semibold text-muted-foreground">{t('scan')}</span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-12 items-center justify-center rounded-xl bg-card"
            aria-label={t('close')}
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>
        <ScanField title={t('globalScanTitle')} hint={t('globalScanHint')} onScan={handleScan} demoCodes={demo} />
      </div>
    </div>
  )
}
