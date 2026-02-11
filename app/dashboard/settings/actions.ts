'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. UPDATE USERNAME (Masuk ke tabel 'profiles')
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const username = formData.get('username') as string

  // pake 'upsert' (Update kalau ada, Insert kalau belum ada)
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

// UPDATE EMAIL
export async function updateEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.updateUser({ email: email })

  if (error) {
    return redirect(`/dashboard/settings?error=${error.message}`)
  }

  return redirect('/dashboard/settings?message=Cek email baru lo buat konfirmasi!')
}

// GANTI PASSWORD
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

// HAPUS AKUN
export async function deleteAccount() {
  // Cek dulu user yang login siapa (Pake client SSR biasa)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Bikin Admin Client (Pake format BARU)
  // pake 'supabase-js' langsung karena butuh akses root/admin
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Eksekusi Hapus User (BYPASS RLS)
  // "admin.deleteUser" ini cuma bisa jalan kalau pake sbs_ key
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('Gagal hapus akun:', error.message)
    return redirect('/dashboard/settings?error=Gagal menghapus akun')
  }

  // Logout & Cabut
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login?message=Akun berhasil dihapus permanen.')
}