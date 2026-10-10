'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { translate, type Lang, type TKey, type TParams } from '@/lib/wms/i18n'
import {
  createSeedData,
  findProduct,
  generateOrder,
  nowTime,
  ROUTES,
  type Alert,
  type Marketplace,
  type ModuleId,
  type Screen,
  type WmsData,
} from '@/lib/wms/data'

type FeedbackType = 'success' | 'error'
interface Feedback {
  id: number
  type: FeedbackType
  message: string
}

interface WmsContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TKey, params?: TParams) => string
  routeName: (m: Marketplace) => string
  screen: Screen
  screenKey: number
  initialScan: string | null
  navigate: (screen: Screen, scanCode?: string) => void
  training: boolean
  setTraining: (v: boolean) => void
  online: boolean
  setOnline: (v: boolean) => void
  data: WmsData
  feedback: Feedback | null
  notify: (type: FeedbackType, message: string) => void
  dismissFeedback: () => void
  stats: { scans: number; tasks: number }
  registerScan: () => void
  pendingCounts: Record<ModuleId, number>
  unreadAlerts: number
  actions: {
    receiveWaybill: (code: string, accepted: Record<string, number>) => void
    putawayItem: (code: string, barcode: string) => void
    acceptPickTask: () => void
    pickItem: (barcode: string) => void
    linkPickBox: (boxCode: string) => void
    packToPackage: (boxCode: string, pkgCode: string) => void
    sortPackage: (pkgCode: string) => void
    finishShipment: (vehicleCode: string, pkgCodes: string[]) => void
    relocate: (from: string, to: string, qty: number) => void
    saveInventory: (cell: string, counted: number) => void
    markAlertsRead: () => void
    syncNow: () => void
  }
}

const WmsContext = createContext<WmsContextValue | null>(null)

const makeAlert = (key: TKey, tone: Alert['tone'], params?: TParams): Alert => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  key,
  params,
  tone,
  time: nowTime(),
  read: false,
})

export function WmsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('uz')
  const [screen, setScreen] = useState<Screen>('home')
  const [screenKey, setScreenKey] = useState(0)
  const [initialScan, setInitialScan] = useState<string | null>(null)
  const [training, setTraining] = useState(true)
  const [online, setOnline] = useState(true)
  const [data, setData] = useState<WmsData>(createSeedData)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [stats, setStats] = useState({ scans: 0, tasks: 0 })

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        if (prev.queue.length >= 3) return prev
        const order = generateOrder(prev.orderSeq)
        return {
          ...prev,
          orderSeq: prev.orderSeq + 1,
          queue: [...prev.queue, order],
          alerts: [makeAlert('alertNewOrder', 'info', { id: order.id }), ...prev.alerts],
        }
      })
    }, 45000)
    return () => clearInterval(id)
  }, [])

  const t = useCallback((key: TKey, params?: TParams) => translate(lang, key, params), [lang])
  const routeName = useCallback((m: Marketplace) => ROUTES[m].name[lang], [lang])

  const navigate = useCallback((next: Screen, scanCode?: string) => {
    setScreen(next)
    setInitialScan(scanCode ?? null)
    setScreenKey((k) => k + 1)
    window.scrollTo({ top: 0 })
  }, [])

  const notify = useCallback((type: FeedbackType, message: string) => {
    setFeedback({ id: Date.now(), type, message })
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(type === 'error' ? [90, 60, 90] : 35)
    }
  }, [])

  const dismissFeedback = useCallback(() => setFeedback(null), [])
  const registerScan = useCallback(() => setStats((s) => ({ ...s, scans: s.scans + 1 })), [])
  const completeTask = useCallback(() => setStats((s) => ({ ...s, tasks: s.tasks + 1 })), [])

  const commit = useCallback(
    (updater: (prev: WmsData) => WmsData) =>
      setData((prev) => {
        const next = updater(prev)
        return { ...next, pendingOps: next.pendingOps + 1 }
      }),
    [],
  )

  const actions = useMemo<WmsContextValue['actions']>(
    () => ({
      receiveWaybill: (code, accepted) => {
        commit((prev) => ({
          ...prev,
          waybills: { ...prev.waybills, [code]: { ...prev.waybills[code], status: 'received', accepted, placed: {} } },
        }))
        completeTask()
      },
      putawayItem: (code, barcode) =>
        commit((prev) => {
          const wb = prev.waybills[code]
          const placed = { ...wb.placed, [barcode]: (wb.placed[barcode] ?? 0) + 1 }
          const totalAccepted = Object.values(wb.accepted).reduce((a, b) => a + b, 0)
          const totalPlaced = Object.values(placed).reduce((a, b) => a + b, 0)
          const product = findProduct(barcode)
          const stock = { ...prev.stock }
          if (product) {
            const cell = stock[product.cell]
            stock[product.cell] = { barcode, qty: (cell?.qty ?? 0) + 1 }
          }
          return {
            ...prev,
            stock,
            waybills: {
              ...prev.waybills,
              [code]: { ...wb, placed, status: totalPlaced >= totalAccepted ? 'stored' : 'received' },
            },
          }
        }),
      acceptPickTask: () =>
        setData((prev) => {
          if (prev.activePick || prev.queue.length === 0) return prev
          const [order, ...rest] = prev.queue
          return { ...prev, queue: rest, activePick: { order, picked: {} } }
        }),
      pickItem: (barcode) =>
        commit((prev) => {
          if (!prev.activePick) return prev
          const product = findProduct(barcode)
          const stock = { ...prev.stock }
          if (product && stock[product.cell]) {
            stock[product.cell] = { ...stock[product.cell], qty: Math.max(0, stock[product.cell].qty - 1) }
          }
          const picked = { ...prev.activePick.picked, [barcode]: (prev.activePick.picked[barcode] ?? 0) + 1 }
          return { ...prev, stock, activePick: { ...prev.activePick, picked } }
        }),
      linkPickBox: (boxCode) => {
        commit((prev) => {
          if (!prev.activePick) return prev
          return {
            ...prev,
            activePick: null,
            pickBoxes: { ...prev.pickBoxes, [boxCode]: { code: boxCode, order: prev.activePick.order, status: 'picked' } },
          }
        })
        completeTask()
      },
      packToPackage: (boxCode, pkgCode) => {
        commit((prev) => {
          const box = prev.pickBoxes[boxCode]
          return {
            ...prev,
            pickBoxes: { ...prev.pickBoxes, [boxCode]: { ...box, status: 'packed' } },
            packages: { ...prev.packages, [pkgCode]: { code: pkgCode, order: box.order, status: 'packed' } },
          }
        })
        completeTask()
      },
      sortPackage: (pkgCode) => {
        commit((prev) => {
          const pkg = prev.packages[pkgCode]
          const m = pkg.order.marketplace
          return {
            ...prev,
            packages: { ...prev.packages, [pkgCode]: { ...pkg, status: 'sorted' } },
            routeBoxes: { ...prev.routeBoxes, [m]: [...prev.routeBoxes[m], pkgCode] },
          }
        })
        completeTask()
      },
      finishShipment: (vehicleCode, pkgCodes) => {
        commit((prev) => {
          const packages = { ...prev.packages }
          for (const code of pkgCodes) packages[code] = { ...packages[code], status: 'shipped' }
          const routeBoxes = { ...prev.routeBoxes }
          for (const m of Object.keys(routeBoxes) as Marketplace[]) {
            routeBoxes[m] = routeBoxes[m].filter((c) => !pkgCodes.includes(c))
          }
          return {
            ...prev,
            packages,
            routeBoxes,
            alerts: [makeAlert('alertShipped', 'success', { id: prev.vehicles[vehicleCode].plate }), ...prev.alerts],
          }
        })
        completeTask()
      },
      relocate: (from, to, qty) => {
        commit((prev) => {
          const source = prev.stock[from]
          const target = prev.stock[to]
          const left = source.qty - qty
          return {
            ...prev,
            relocationTasks: Math.max(0, prev.relocationTasks - 1),
            stock: {
              ...prev.stock,
              [from]: { barcode: left > 0 ? source.barcode : null, qty: left },
              [to]: { barcode: source.barcode, qty: target.qty + qty },
            },
          }
        })
        completeTask()
      },
      saveInventory: (cell, counted) => {
        commit((prev) => {
          const current = prev.stock[cell]
          const diff = counted - current.qty
          return {
            ...prev,
            inventoryTasks: Math.max(0, prev.inventoryTasks - 1),
            stock: { ...prev.stock, [cell]: { ...current, qty: counted } },
            alerts: diff !== 0 ? [makeAlert('alertDiscrepancy', 'warn', { id: cell }), ...prev.alerts] : prev.alerts,
          }
        })
        completeTask()
      },
      markAlertsRead: () =>
        setData((prev) => ({ ...prev, alerts: prev.alerts.map((a) => ({ ...a, read: true })) })),
      syncNow: () => setData((prev) => ({ ...prev, pendingOps: 0, lastSync: nowTime() })),
    }),
    [commit, completeTask],
  )

  const pendingCounts = useMemo<Record<ModuleId, number>>(() => {
    const waybills = Object.values(data.waybills)
    return {
      receiving: waybills.filter((w) => w.status === 'new').length,
      putaway: waybills.filter((w) => w.status === 'received').length,
      picking: data.queue.length + (data.activePick ? 1 : 0),
      packing: Object.values(data.pickBoxes).filter((b) => b.status === 'picked').length,
      sorting: Object.values(data.packages).filter((p) => p.status === 'packed').length,
      relocation: data.relocationTasks,
      shipping: Object.values(data.routeBoxes).filter((list) => list.length > 0).length,
      inventory: data.inventoryTasks,
    }
  }, [data])

  const unreadAlerts = data.alerts.filter((a) => !a.read).length

  const value: WmsContextValue = {
    lang,
    setLang,
    t,
    routeName,
    screen,
    screenKey,
    initialScan,
    navigate,
    training,
    setTraining,
    online,
    setOnline,
    data,
    feedback,
    notify,
    dismissFeedback,
    stats,
    registerScan,
    pendingCounts,
    unreadAlerts,
    actions,
  }

  return <WmsContext.Provider value={value}>{children}</WmsContext.Provider>
}

export function useWms() {
  const ctx = useContext(WmsContext)
  if (!ctx) throw new Error('useWms must be used inside WmsProvider')
  return ctx
}

export function useInitialScan(handler: (code: string) => void) {
  const { initialScan } = useWms()
  const handled = useRef(false)
  const handlerRef = useRef(handler)
  handlerRef.current = handler
  useEffect(() => {
    if (initialScan && !handled.current) {
      handled.current = true
      handlerRef.current(initialScan)
    }
  }, [initialScan])
}
