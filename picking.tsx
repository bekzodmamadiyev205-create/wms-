'use client'

import { useState } from 'react'
import { Barcode, BellRing, Box, Check, Hourglass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { findProduct, ROUTES, unitsIn, type Marketplace } from '@/lib/wms/data'
import { ActionButton, BigCounter, CellBadge, ModuleScreen, ResultPanel } from '../primitives'
import { ScanField } from '../scan-field'
import { useWms } from '../wms-provider'
import { moduleIcon } from './registry'

export function RouteTag({ marketplace }: { marketplace: Marketplace }) {
  const { routeName } = useWms()
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-bold text-white"
      style={{ backgroundColor: ROUTES[marketplace].color }}
    >
      {routeName(marketplace)}
    </span>
  )
}

export function PickingModule() {
  const { t, data, notify, actions } = useWms()
  const [boxStage, setBoxStage] = useState(false)
  const [linked, setLinked] = useState<{ box: string; order: string } | null>(null)

  const active = data.activePick
  const nextOrder = data.queue[0]

  const rows = active
    ? [...active.order.lines]
        .map((l) => ({ ...l, product: findProduct(l.barcode)!, picked: active.picked[l.barcode] ?? 0 }))
        .sort((a, b) => a.product.cell.localeCompare(b.product.cell))
    : []
  const totalUnits = active ? unitsIn(active.order.lines) : 0
  const pickedUnits = rows.reduce((s, r) => s + r.picked, 0)
  const allPicked = active !== null && pickedUnits >= totalUnits
  const currentRow = rows.find((r) => r.picked < r.qty)

  const handleItem = (barcode: string) => {
    const row = rows.find((r) => r.barcode === barcode)
    if (!row) return notify('error', t('wrongItem'))
    if (row.picked >= row.qty) return notify('error', t('itemAlreadyComplete'))
    actions.pickItem(barcode)
    notify('success', `${row.product.name} ${row.picked + 1}/${row.qty}`)
  }

  const handleBox = (code: string) => {
    if (!code.startsWith('BOX-')) return notify('error', t('invalidBox'))
    if (data.pickBoxes[code]) return notify('error', t('boxInUse'))
    if (!active) return
    const orderId = active.order.id
    actions.linkPickBox(code)
    setLinked({ box: code, order: orderId })
    setBoxStage(false)
    notify('success', t('pickDone'))
  }

  const freeBox = () => {
    let n = 1002
    while (data.pickBoxes[`BOX-${n}`]) n++
    return `BOX-${n}`
  }

  const step = linked ? 2 : boxStage ? 2 : active ? 1 : 0

  return (
    <ModuleScreen
      icon={moduleIcon('picking')}
      title={t('picking')}
      step={step}
      steps={['stepAccept', 'stepPick', 'stepBox']}
    >
      {linked && (
        <ResultPanel
          title={t('pickDone')}
          subtitle={linked.box}
          actions={<ActionButton onClick={() => setLinked(null)}>{t('nextTask')}</ActionButton>}
        >
          <p className="text-lg">
            {t('order')}: <span className="font-mono font-bold">{linked.order}</span>
          </p>
        </ResultPanel>
      )}

      {!linked && !active && nextOrder && (
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-primary bg-card p-5">
          <p className="flex items-center gap-2 text-lg font-bold text-primary">
            <BellRing className="size-6 animate-pulse" aria-hidden />
            {t('newTask')}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-3xl font-bold">{nextOrder.id}</span>
            <RouteTag marketplace={nextOrder.marketplace} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-background p-3">
              <p className="text-sm text-muted-foreground">{t('total')}</p>
              <p className="font-mono text-2xl font-bold">
                {unitsIn(nextOrder.lines)} <span className="text-base">{t('pcs')}</span>
              </p>
            </div>
            <div className="rounded-xl bg-background p-3">
              <p className="text-sm text-muted-foreground">{t('cell')}</p>
              <p className="font-mono text-2xl font-bold">
                {nextOrder.lines.length} <span className="text-base">{t('rows')}</span>
              </p>
            </div>
          </div>
          <ActionButton onClick={actions.acceptPickTask}>
            <Check className="size-6" aria-hidden />
            {t('acceptTask')}
          </ActionButton>
          {data.queue.length > 1 && (
            <p className="text-center text-sm text-muted-foreground">{t('inQueue', { n: data.queue.length - 1 })}</p>
          )}
        </div>
      )}

      {!linked && !active && !nextOrder && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-5 py-12 text-center">
          <Hourglass className="size-12 animate-pulse text-primary" aria-hidden />
          <p className="text-xl font-bold">{t('waitingOrders')}</p>
          <p className="text-base text-muted-foreground">{t('waitingHint')}</p>
        </div>
      )}

      {!linked && active && !boxStage && (
        <>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-card px-4 py-3">
            <span className="font-mono text-xl font-bold">{active.order.id}</span>
            <RouteTag marketplace={active.order.marketplace} />
          </div>
          <BigCounter value={totalUnits - pickedUnits} total={totalUnits} label={t('remaining')} />

          {!allPicked && (
            <ScanField
              variant="compact"
              icon={Barcode}
              title={t('pickScanItem')}
              onScan={handleItem}
              demoCodes={currentRow ? [currentRow.barcode] : []}
            />
          )}

          <ol className="flex flex-col gap-2">
            {rows.map((r) => {
              const complete = r.picked >= r.qty
              const isCurrent = currentRow?.barcode === r.barcode
              return (
                <li
                  key={r.barcode}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 bg-card p-3',
                    isCurrent ? 'border-primary' : 'border-transparent',
                    complete && 'opacity-60',
                  )}
                >
                  <CellBadge cell={r.product.cell} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold">{r.product.name}</p>
                    <p className="font-mono text-sm text-muted-foreground">{r.barcode}</p>
                  </div>
                  <span className={cn('font-mono text-xl font-bold tabular-nums', complete && 'text-success')}>
                    {complete ? <Check className="size-7" aria-label={t('done')} /> : `${r.picked}/${r.qty}`}
                  </span>
                </li>
              )
            })}
          </ol>

          {allPicked && (
            <ActionButton variant="success" onClick={() => setBoxStage(true)}>
              <Check className="size-6" aria-hidden />
              {t('finishPicking')}
            </ActionButton>
          )}
        </>
      )}

      {!linked && active && boxStage && (
        <ScanField
          icon={Box}
          title={t('scanBoxTitle')}
          hint={t('scanBoxHint')}
          onScan={handleBox}
          demoCodes={[freeBox()]}
        />
      )}
    </ModuleScreen>
  )
}
