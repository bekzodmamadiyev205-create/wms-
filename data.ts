import type { Lang, TKey, TParams } from './i18n'

export type Marketplace = 'uzum' | 'wb' | 'ozon'

export type ModuleId =
  | 'receiving'
  | 'putaway'
  | 'picking'
  | 'packing'
  | 'sorting'
  | 'relocation'
  | 'shipping'
  | 'inventory'

export type Screen = 'home' | ModuleId | 'alerts' | 'sync' | 'profile'

export const ROUTES: Record<Marketplace, { name: Record<Lang, string>; box: string; color: string }> = {
  uzum: { name: { uz: 'Uzum Market', ru: 'Uzum Market' }, box: 'RB-UZUM', color: '#8B5CF6' },
  wb: { name: { uz: 'Wildberries', ru: 'Wildberries' }, box: 'RB-WB', color: '#D946EF' },
  ozon: { name: { uz: 'Ozon sklad', ru: 'Ozon склад' }, box: 'RB-OZON', color: '#3B82F6' },
}

export const MARKETPLACES: Marketplace[] = ['uzum', 'wb', 'ozon']

export interface Product {
  barcode: string
  name: string
  cell: string
}

export const PRODUCTS: Product[] = [
  { barcode: '4600001000011', name: 'Xiaomi Redmi Buds 5', cell: 'A-01-02' },
  { barcode: '4600001000028', name: 'Samsung 25W Charger', cell: 'A-01-04' },
  { barcode: '4600001000035', name: 'Logitech M190 Mouse', cell: 'B-02-01' },
  { barcode: '4600001000042', name: 'JBL Go 3 Speaker', cell: 'B-02-03' },
  { barcode: '4600001000059', name: 'Anker PowerCore 10000', cell: 'C-03-02' },
  { barcode: '4600001000066', name: 'Baseus USB-C Cable 1m', cell: 'C-03-05' },
]

export function findProduct(barcode: string) {
  return PRODUCTS.find((p) => p.barcode === barcode)
}

export interface Line {
  barcode: string
  qty: number
}

export interface Waybill {
  code: string
  supplier: string
  lines: Line[]
  status: 'new' | 'received' | 'stored'
  accepted: Record<string, number>
  placed: Record<string, number>
}

export interface Order {
  id: string
  marketplace: Marketplace
  lines: Line[]
}

export interface ActivePick {
  order: Order
  picked: Record<string, number>
}

export interface PickBox {
  code: string
  order: Order
  status: 'picked' | 'packed'
}

export interface Package {
  code: string
  order: Order
  status: 'packed' | 'sorted' | 'shipped'
}

export interface Vehicle {
  code: string
  plate: string
  driver: string
}

export interface Alert {
  id: string
  key: TKey
  params?: TParams
  time: string
  read: boolean
  tone: 'info' | 'warn' | 'success'
}

export interface StockCell {
  barcode: string | null
  qty: number
}

export interface WmsData {
  waybills: Record<string, Waybill>
  queue: Order[]
  activePick: ActivePick | null
  pickBoxes: Record<string, PickBox>
  packages: Record<string, Package>
  routeBoxes: Record<Marketplace, string[]>
  stock: Record<string, StockCell>
  vehicles: Record<string, Vehicle>
  relocationTasks: number
  inventoryTasks: number
  alerts: Alert[]
  pendingOps: number
  lastSync: string
  orderSeq: number
}

export const unitsIn = (lines: Line[]) => lines.reduce((sum, l) => sum + l.qty, 0)

export const normalizeCode = (raw: string) => raw.trim().toUpperCase()

export const nowTime = () =>
  new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const P = PRODUCTS.map((p) => p.barcode)

export function generateOrder(seq: number): Order {
  const marketplace = MARKETPLACES[seq % 3]
  const first = seq % P.length
  const second = (seq + 2) % P.length
  return {
    id: `ORD-${seq}`,
    marketplace,
    lines: [
      { barcode: P[first], qty: (seq % 2) + 1 },
      { barcode: P[second], qty: 1 },
    ],
  }
}

export function createSeedData(): WmsData {
  const packedOrders: Order[] = [
    { id: 'ORD-5097', marketplace: 'uzum', lines: [{ barcode: P[0], qty: 2 }] },
    { id: 'ORD-5098', marketplace: 'wb', lines: [{ barcode: P[3], qty: 1 }, { barcode: P[5], qty: 1 }] },
    { id: 'ORD-5096', marketplace: 'ozon', lines: [{ barcode: P[4], qty: 1 }] },
    { id: 'ORD-5095', marketplace: 'uzum', lines: [{ barcode: P[1], qty: 1 }, { barcode: P[2], qty: 2 }] },
  ]

  return {
    waybills: {
      'NK-24001': {
        code: 'NK-24001',
        supplier: 'Artel Logistics',
        lines: [
          { barcode: P[0], qty: 4 },
          { barcode: P[1], qty: 3 },
          { barcode: P[2], qty: 2 },
        ],
        status: 'new',
        accepted: {},
        placed: {},
      },
      'NK-24002': {
        code: 'NK-24002',
        supplier: 'Asia Trade Group',
        lines: [
          { barcode: P[3], qty: 2 },
          { barcode: P[4], qty: 3 },
        ],
        status: 'new',
        accepted: {},
        placed: {},
      },
      'NK-23998': {
        code: 'NK-23998',
        supplier: 'Tashkent Import',
        lines: [
          { barcode: P[5], qty: 3 },
          { barcode: P[0], qty: 2 },
        ],
        status: 'received',
        accepted: { [P[5]]: 3, [P[0]]: 2 },
        placed: {},
      },
    },
    queue: [
      { id: 'ORD-5101', marketplace: 'uzum', lines: [{ barcode: P[0], qty: 1 }, { barcode: P[2], qty: 2 }] },
      {
        id: 'ORD-5102',
        marketplace: 'wb',
        lines: [
          { barcode: P[3], qty: 1 },
          { barcode: P[5], qty: 2 },
          { barcode: P[1], qty: 1 },
        ],
      },
    ],
    activePick: null,
    pickBoxes: {
      'BOX-1001': {
        code: 'BOX-1001',
        order: { id: 'ORD-5099', marketplace: 'ozon', lines: [{ barcode: P[1], qty: 1 }, { barcode: P[4], qty: 1 }] },
        status: 'picked',
      },
    },
    packages: {
      'PKG-2001': { code: 'PKG-2001', order: packedOrders[0], status: 'packed' },
      'PKG-2002': { code: 'PKG-2002', order: packedOrders[1], status: 'packed' },
      'PKG-2003': { code: 'PKG-2003', order: packedOrders[2], status: 'sorted' },
      'PKG-2004': { code: 'PKG-2004', order: packedOrders[3], status: 'sorted' },
    },
    routeBoxes: { uzum: ['PKG-2004'], wb: [], ozon: ['PKG-2003'] },
    stock: {
      'A-01-02': { barcode: P[0], qty: 12 },
      'A-01-04': { barcode: P[1], qty: 8 },
      'B-02-01': { barcode: P[2], qty: 15 },
      'B-02-03': { barcode: P[3], qty: 6 },
      'C-03-02': { barcode: P[4], qty: 9 },
      'C-03-05': { barcode: P[5], qty: 20 },
      'D-01-01': { barcode: null, qty: 0 },
      'D-01-02': { barcode: null, qty: 0 },
    },
    vehicles: {
      'TRK-01A777AA': { code: 'TRK-01A777AA', plate: '01 A 777 AA', driver: 'Sardor Rahimov' },
      'TRK-01B123CD': { code: 'TRK-01B123CD', plate: '01 B 123 CD', driver: 'Jasur Karimov' },
    },
    relocationTasks: 2,
    inventoryTasks: 3,
    alerts: [
      { id: 'a1', key: 'alertNewOrder', params: { id: 'ORD-5102' }, time: '08:14', read: false, tone: 'info' },
      { id: 'a2', key: 'alertWaybill', params: { id: 'NK-24002' }, time: '08:05', read: false, tone: 'warn' },
      { id: 'a3', key: 'alertShift', time: '08:00', read: true, tone: 'success' },
    ],
    pendingOps: 0,
    lastSync: '08:00',
    orderSeq: 5103,
  }
}
