import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'


  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session) {
      // Refresh the session to ensure it's properly established
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()

      // Get the user after successful OAuth
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Ensure user profile exists in our database and update avatar
        try {
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single()

          const googleAvatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

          if (!existingUser && fetchError?.code === 'PGRST116') {
            // Create user profile if it doesn't exist
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                avatar_url: googleAvatarUrl,
                role: 'member',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single()

            if (insertError) {
              console.error('Error creating user profile:', insertError)
            }
          } else if (existingUser) {
            // Update avatar URL if user exists (in case they changed their Google picture)
            const { error: updateError } = await supabase
              .from('users')
              .update({
                avatar_url: googleAvatarUrl,
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id)

            if (updateError) {
              console.error('Error updating user avatar:', updateError)
            }
          }
        } catch (error) {
          console.error('Error checking/creating user profile:', error)
        }
      }
      
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error('OAuth error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
