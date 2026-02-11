'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  
  // Ambil user yang lagi login (buat tau siapa yang bikin task)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const priority = formData.get('priority') as string

  // Validasi simple
  if (!title) {
    redirect('/dashboard/tasks/new-task?error=Judul task gak boleh kosong')
  }

  // Insert ke database
  const { error } = await supabase.from('tasks').insert({
    title: title,
    priority: priority || 'Medium',
    user_id: user.id,
    is_completed: false
  })

  if (error) {
    console.error('Error creating task:', error)
    redirect('/dashboard/tasks/new-task?error=Gagal simpan ke database')
  }

  // Refresh halaman list task biar data baru muncul
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard')
  
  // Balik ke halaman list task
  redirect('/dashboard/tasks')
}

export async function toggleTask(formData: FormData) {
  const supabase = await createClient()
  
  // Ambil ID task dan Status sekarang dari Form
  const taskId = formData.get('taskId')
  const currentStatus = formData.get('currentStatus') === 'true' // Konversi string "true" jadi boolean
  
  // Update ke Database (Status dibalik pake tanda seru '!')
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: !currentStatus })
    .eq('id', taskId)

  if (error) {
    console.error('Gagal update status:', error)
    return
  }

  // Refresh halaman biar UI langsung berubah
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard') // Refresh dashboard juga biar angkanya update
}

export async function archiveTask(taskId: number) {
  const supabase = await createClient()
  await supabase.from('tasks').update({ is_archived: true }).eq('id', taskId)
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard/archive')
}

export async function restoreTask(taskId: number) {
  const supabase = await createClient()
  await supabase.from('tasks').update({ is_archived: false }).eq('id', taskId)
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard/archive')
}

export async function deleteTaskPermanently(taskId: number) {
  const supabase = await createClient()
  await supabase.from('tasks').delete().eq('id', taskId)
  revalidatePath('/dashboard/archive')
}

// Buat Archive Banyak Sekaligus
export async function bulkArchiveTasks(taskIds: number[]) {
  const supabase = await createClient()
  await supabase.from('tasks').update({ is_archived: true }).in('id', taskIds)
  revalidatePath('/dashboard/tasks')
}