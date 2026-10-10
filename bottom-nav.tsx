'use client'

import { Bell, House, RefreshCw, ScanLine, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Screen } from '@/lib/wms/data'
import type { TKey } from '@/lib/wms/i18n'
import { useWms } from './wms-provider'

function NavItem({
  icon: Icon,
  label,
  target,
  badge,
}: {
  icon: LucideIcon
  label: TKey
  target: Screen
  badge?: number
}) {
  const { t, screen, navigate } = useWms()
  const active = screen === target
  return (
    <button
      type="button"
      onClick={() => navigate(target)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold',
        active ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      <Icon className="size-6" aria-hidden />
      <span>{t(label)}</span>
      {badge ? (
        <span className="absolute right-[18%] top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

export function BottomNav({ onScan }: { onScan: () => void }) {
  const { t, unreadAlerts, data } = useWms()
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
    >
      <div className="flex items-end gap-1">
        <NavItem icon={House} label="home" target="home" />
        <NavItem icon={Bell} label="alerts" target="alerts" badge={unreadAlerts} />
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={onScan}
            className="-mt-8 flex size-[72px] flex-col items-center justify-center gap-0.5 rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95"
          >
            <ScanLine className="size-8" aria-hidden />
            <span className="text-[11px] font-bold">{t('scan')}</span>
          </button>
        </div>
        <NavItem icon={RefreshCw} label="sync" target="sync" badge={data.pendingOps} />
        <NavItem icon={User} label="profile" target="profile" />
      </div>
    </nav>
  )
}
