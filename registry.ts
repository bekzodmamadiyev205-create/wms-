import {
  ArrowLeftRight,
  ClipboardList,
  Package,
  PackagePlus,
  ShoppingBasket,
  Split,
  Truck,
  Warehouse,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ModuleId } from '@/lib/wms/data'

export const MODULES: { id: ModuleId; icon: LucideIcon }[] = [
  { id: 'receiving', icon: PackagePlus },
  { id: 'putaway', icon: Warehouse },
  { id: 'picking', icon: ShoppingBasket },
  { id: 'packing', icon: Package },
  { id: 'sorting', icon: Split },
  { id: 'relocation', icon: ArrowLeftRight },
  { id: 'shipping', icon: Truck },
  { id: 'inventory', icon: ClipboardList },
]

export const moduleIcon = (id: ModuleId) => MODULES.find((m) => m.id === id)!.icon
