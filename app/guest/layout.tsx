import { StayProvider } from '@/lib/alpineflow/stay-context'
import ConciergeChat from '@/components/alpineflow/ConciergeChat'

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <StayProvider>
      {children}
      <ConciergeChat />
    </StayProvider>
  )
}
