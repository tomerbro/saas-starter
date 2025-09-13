'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ActivityType } from '@/lib/supabase/types'

export async function signIn(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Ensure user profile exists in our database
  if (authData.user) {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', authData.user.id)
        .single()

      if (!existingUser) {
        // Create user profile if it doesn't exist
        await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.user_metadata?.name || null,
            role: 'member'
          })
      }
    } catch (profileError) {
      console.error('Failed to check/create user profile:', profileError)
      // Don't fail the signin if profile creation fails
    }

    // Log activity
    await logActivity(authData.user.id, ActivityType.SIGN_IN)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?revalidated=true')
}

export async function signUp(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Create user profile in our database
  if (authData.user) {
    try {
      await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name || null,
          role: 'member'
        })
    } catch (profileError) {
      console.error('Failed to create user profile:', profileError)
      // Don't fail the signup if profile creation fails
    }

    // Log activity
    await logActivity(authData.user.id, ActivityType.SIGN_UP)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?revalidated=true')
}

export async function signOut() {
  const supabase = await createClient()

  // Log activity before signing out
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await logActivity(user.id, ActivityType.SIGN_OUT)
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

export async function updatePassword(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const data = {
    password: formData.get('newPassword') as string,
  }

  const { error } = await supabase.auth.updateUser(data)

  if (error) {
    return { error: error.message }
  }

  // Log activity
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await logActivity(user.id, ActivityType.UPDATE_PASSWORD)
  }

  revalidatePath('/', 'layout')
  return { success: 'Password updated successfully' }
}

export async function updateAccount(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
  }

  // Get current user first
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'User not authenticated' }
  }

  // Update user in Supabase Auth
  const { error: authError } = await supabase.auth.updateUser({
    data: { name: data.name },
    email: data.email,
  })

  if (authError) {
    return { error: authError.message }
  }

  // Update user in our custom users table
  const { error: dbError } = await supabase
    .from('users')
    .update({
      name: data.name,
      email: data.email,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (dbError) {
    console.error('Failed to update user in database:', dbError)
    return { error: 'Failed to update user profile' }
  }

  // Log activity
  await logActivity(user.id, ActivityType.UPDATE_ACCOUNT)

  revalidatePath('/', 'layout')
  return { success: 'Account updated successfully' }
}

export async function deleteAccount(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Log activity before deleting
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await logActivity(user.id, ActivityType.DELETE_ACCOUNT)
  }

  const { error } = await supabase.auth.admin.deleteUser(
    user?.id || ''
  )

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

async function logActivity(userId: string, action: ActivityType, ipAddress?: string) {
  const supabase = await createClient()
  
  await supabase
    .from('activity_logs')
    .insert({
      user_id: userId,
      action,
      ip_address: ipAddress || null
    })
}
