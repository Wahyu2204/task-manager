'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. UPDATE USERNAME (Masuk ke tabel 'profiles')
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const username = formData.get('username') as string

  // Kita pake 'upsert' (Update kalau ada, Insert kalau belum ada)
  const { error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id, 
      username: username,
      updated_at: new Date().toISOString()
    })

  if (error) {
    return redirect('/dashboard/settings?error=Gagal update profil')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  return redirect('/dashboard/settings?message=Profil berhasil diupdate')
}

// 2. UPDATE EMAIL (Hati-hati, Supabase bakal kirim email konfirmasi ke email BARU dan LAMA)
export async function updateEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.updateUser({ email: email })

  if (error) {
    return redirect(`/dashboard/settings?error=${error.message}`)
  }

  return redirect('/dashboard/settings?message=Cek email baru lo buat konfirmasi!')
}

// 3. GANTI PASSWORD
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return redirect('/dashboard/settings?error=Password tidak sama')
  }

  if (password.length < 6) {
    return redirect('/dashboard/settings?error=Password minimal 6 karakter')
  }

  const { error } = await supabase.auth.updateUser({ password: password })

  if (error) {
    return redirect(`/dashboard/settings?error=${error.message}`)
  }

  return redirect('/dashboard/settings?message=Password berhasil diganti')
}