'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, User as UserIcon, Mail } from 'lucide-react';
import { updateAccount } from '@/lib/auth/actions';
import { User } from '@/lib/supabase/types';
import useSWR from 'swr';
import { Suspense } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  name?: string;
  email?: string;
  error?: string;
  success?: string;
};

function AccountForm({
  nameValue = '',
  emailValue = ''
}: {
  nameValue?: string;
  emailValue?: string;
}) {
  const [formState, formAction, isPending] = useActionState(updateAccount, { error: '' });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Update your personal information and account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={nameValue}
                required
                maxLength={100}
                placeholder="Enter your full name"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={emailValue}
                  required
                  maxLength={255}
                  placeholder="Enter your email address"
                  className="h-10 pl-10"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {formState?.error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {formState.error}
            </div>
          )}
          {formState?.success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              {formState.success}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="min-w-[120px]">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Account'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AccountFormWithData() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  return (
    <AccountForm
      nameValue={user?.name ?? ''}
      emailValue={user?.email ?? ''}
    />
  );
}

function AccountFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Update your personal information and account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function GeneralPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">General Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <Suspense fallback={<AccountFormSkeleton />}>
        <AccountFormWithData />
      </Suspense>
    </div>
  );
}