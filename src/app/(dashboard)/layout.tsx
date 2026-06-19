import BottomNav from '@/components/layout/BottomNav'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col w-full">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav unreadCount={count ?? 0} />
    </div>
  )
}