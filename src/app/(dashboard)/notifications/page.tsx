import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/layout/TopBar'
import NotificationList from '@/components/notifications/NotificationList'
import type { Notification } from '@/lib/types'

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen">
      <TopBar title="Alerts" subtitle="POI notifications" />
      <div className="px-4 py-4">
        <NotificationList notifications={(data ?? []) as Notification[]} />
      </div>
    </div>
  )
}