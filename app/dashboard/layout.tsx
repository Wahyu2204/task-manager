import { Sidebar } from "./sidebar" // <--- Import komponen yang tadi dibuat

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      
      {/* Panggil Sidebar disini */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {children}
      </main>
      
    </div>
  )
}