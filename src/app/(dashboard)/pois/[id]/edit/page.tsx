import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/layout/TopBar'
import POIForm from '@/components/pois/POIForm'
import type { POI } from '@/lib/types'

export default async function EditPOIPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('pois')
    .select('*, rules:poi_rules(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  return (
    <div className="min-h-screen">
      <TopBar title="Edit POI" subtitle={data.symbol} />
      <POIForm existing={data as POI} />
    </div>
  )
}