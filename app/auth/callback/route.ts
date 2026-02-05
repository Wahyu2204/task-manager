import { NextResponse } from 'next/server'
// Ganti import ini sesuai lokasi file server client lo
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // "next" ini buat nentuin habis login mau dilempar kemana (default ke home '/')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // Ini proses ajaibnya: Nuker kode dari URL jadi Session Cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Kalau sukses nuker, lempar user ke halaman tujuan (Home)
      // forwardForwardedHeaders buat handling proxy kalau nanti di-deploy (opsional tapi bagus)
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // Kalau di localhost
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Kalau udah di Vercel nanti
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Kalau kode salah atau kadaluarsa, balikin ke login pake pesan error
  return NextResponse.redirect(`${origin}/login?message=Kode verifikasi kadaluarsa atau salah`)
}