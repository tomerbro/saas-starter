import { createClient } from '@/lib/supabase/server'
import { User, ActivityLog } from '@/lib/supabase/types'

export async function getUser(): Promise<User | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // First try to get existing user profile
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (existingUser) {
    return existingUser
  }

  // If user doesn't exist in our database, create them
  if (fetchError && fetchError.code === 'PGRST116') {
    try {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || null,
          role: 'member'
        })
        .select()
        .single()

      if (createError) {
        console.error('Failed to create user profile:', createError)
        return null
      }

      return newUser
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }

  return null
}

export async function getUserByStripeCustomerId(customerId: string): Promise<User | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    stripeSubscriptionId: string | null
    stripeProductId: string | null
    planName: string | null
    subscriptionStatus: string
  }
) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('users')
    .update({
      ...subscriptionData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    throw new Error(`Failed to update user subscription: ${error.message}`)
  }
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      id,
      action,
      timestamp,
      ip_address
    `)
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Failed to fetch activity logs:', error)
    return []
  }

  return data || []
}

export async function createUser(userData: {
  id: string
  email: string
  name?: string
  role?: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userData.id,
      email: userData.email,
      name: userData.name || null,
      role: userData.role || 'member'
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }

  return data
}
