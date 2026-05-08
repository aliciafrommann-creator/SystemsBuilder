import { StayProvider } from '@/lib/alpineflow/stay-context'
import { ModeProvider } from '@/lib/alpineflow/mode-context'
import ConciergeChat from '@/components/alpineflow/ConciergeChat'

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <StayProvider>
      <ModeProvider>
        {children}
        <ConciergeChat />
      </ModeProvider>
    </StayProvider>
  )
}
