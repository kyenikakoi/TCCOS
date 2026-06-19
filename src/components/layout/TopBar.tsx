export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-4 pt-6 pb-2">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-[#666] mt-1">{subtitle}</p>}
    </div>
  )
}