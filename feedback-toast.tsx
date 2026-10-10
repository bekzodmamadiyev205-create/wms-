'use client'

import { useEffect } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWms } from './wms-provider'

export function FeedbackToast() {
  const { feedback, dismissFeedback } = useWms()

  useEffect(() => {
    if (!feedback) return
    const id = setTimeout(dismissFeedback, feedback.type === 'error' ? 3500 : 1800)
    return () => clearTimeout(id)
  }, [feedback, dismissFeedback])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-28 z-50 mx-auto max-w-md px-4" aria-live="assertive">
      {feedback && (
        <button
          key={feedback.id}
          type="button"
          onClick={dismissFeedback}
          className={cn(
            'pointer-events-auto flex w-full animate-in fade-in slide-in-from-top-2 items-center gap-3 rounded-2xl px-4 py-4 text-left text-lg font-bold shadow-xl',
            feedback.type === 'success' ? 'bg-success text-success-foreground' : 'bg-destructive text-white',
          )}
        >
          {feedback.type === 'success' ? (
            <CircleCheck className="size-7 shrink-0" aria-hidden />
          ) : (
            <CircleAlert className="size-7 shrink-0" aria-hidden />
          )}
          <span className="text-pretty">{feedback.message}</span>
        </button>
      )}
    </div>
  )
}
