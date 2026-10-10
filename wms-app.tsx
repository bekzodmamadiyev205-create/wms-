'use client'

import { useState } from 'react'
import { AppHeader } from './app-header'
import { BottomNav } from './bottom-nav'
import { Dashboard } from './dashboard'
import { FeedbackToast } from './feedback-toast'
import { GlobalScanSheet } from './global-scan-sheet'
import { InventoryModule } from './modules/inventory'
import { PackingModule } from './modules/packing'
import { PickingModule } from './modules/picking'
import { PutawayModule } from './modules/putaway'
import { ReceivingModule } from './modules/receiving'
import { RelocationModule } from './modules/relocation'
import { ShippingModule } from './modules/shipping'
import { SortingModule } from './modules/sorting'
import { AlertsScreen, ProfileScreen, SyncScreen } from './utility-screens'
import { useWms, WmsProvider } from './wms-provider'

const SCREENS = {
  home: Dashboard,
  receiving: ReceivingModule,
  putaway: PutawayModule,
  picking: PickingModule,
  packing: PackingModule,
  sorting: SortingModule,
  relocation: RelocationModule,
  shipping: ShippingModule,
  inventory: InventoryModule,
  alerts: AlertsScreen,
  sync: SyncScreen,
  profile: ProfileScreen,
}

function Shell() {
  const { screen, screenKey } = useWms()
  const [scanOpen, setScanOpen] = useState(false)
  const Current = SCREENS[screen]

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pb-28">
        <Current key={screenKey} />
      </main>
      <FeedbackToast />
      <BottomNav onScan={() => setScanOpen(true)} />
      {scanOpen && <GlobalScanSheet onClose={() => setScanOpen(false)} />}
    </div>
  )
}

export function WmsApp() {
  return (
    <WmsProvider>
      <Shell />
    </WmsProvider>
  )
}
