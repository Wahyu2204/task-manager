'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient() // Pastikan createClient lo bener import-nya

  // Ambil data dari form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Kirim ke Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Kalau error, balikin ke halaman login lagi (bisa ditambahin pesan error nanti)
    console.error('Login Error:', error.message)
    return redirect('/login?message=Gagal login, cek email/password lo')
  }

  // Kalau sukses, revalidate layout dan pindah ke home
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // TAMBAHIN .trim() DI SINI
  // Ini bakal hapus spasi di depan/belakang otomatis
  const email = String(formData.get('email')).trim()
  const password = String(formData.get('password')).trim()

  // Logic Daftar
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // PENTING: Ganti URL ini sesuai URL lokal lo
      emailRedirectTo: 'http://localhost:3000/auth/callback',
    },
  })

  if (error) {
    // Kalau error, balikin ke /register
    return redirect(`/register?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  
  // Kalau sukses, lempar ke login suruh cek email
  return redirect('/login?message=Sukses! Cek email lo buat verifikasi.')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Ini bakal arahin user ke route.ts yang kita buat di langkah 1
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Hapus cache dan balik ke login
  revalidatePath('/', 'layout')
  redirect('/')
}