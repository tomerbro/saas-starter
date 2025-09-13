'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CircleIcon, Loader2, Mail, Lock } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth/actions';

type ActionState = {
  error?: string;
  success?: string;
  email?: string;
  password?: string;
};

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CircleIcon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'signin'
              ? 'Sign in to your account to continue'
              : 'Get started with your free account'}
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {mode === 'signin' ? 'Sign in' : 'Sign up'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'signin'
                ? 'Enter your credentials to access your account'
                : 'Enter your details to create your account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" action={formAction}>
              <input type="hidden" name="redirect" value={redirect || ''} />
              <input type="hidden" name="priceId" value={priceId || ''} />
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={state.email}
                    required
                    maxLength={50}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={
                      mode === 'signin' ? 'current-password' : 'new-password'
                    }
                    defaultValue={state.password}
                    required
                    minLength={8}
                    maxLength={100}
                    placeholder="Enter your password"
                    className="pl-10"
                  />
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              {state?.error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : mode === 'signin' ? (
                  'Sign in'
                ) : (
                  'Sign up'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {mode === 'signin'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
              </span>
              <Link
                href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                  redirect ? `?redirect=${redirect}` : ''
                }${priceId ? `&priceId=${priceId}` : ''}`}
                className="text-primary hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
