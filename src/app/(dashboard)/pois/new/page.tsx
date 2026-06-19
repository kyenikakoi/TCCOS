import TopBar from '@/components/layout/TopBar'
import POIForm from '@/components/pois/POIForm'

export default function NewPOIPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="New POI" subtitle="Define a price zone to monitor" />
      <POIForm />
    </div>
  )
}