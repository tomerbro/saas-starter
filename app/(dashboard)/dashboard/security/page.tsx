'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Lock, Trash2, Loader2, Shield, AlertTriangle } from 'lucide-react';
import { useActionState } from 'react';
import { updatePassword, deleteAccount } from '@/lib/auth/actions';

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
};

function PasswordForm() {
  const [formState, formAction, isPending] = useActionState(updatePassword, { error: '' });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                placeholder="Enter your new password"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
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
            <Button type="submit" disabled={isPending} className="min-w-[140px]">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DeleteAccountForm() {
  const [formState, formAction, isPending] = useActionState(deleteAccount, { error: '' });

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-destructive">
                Warning: This action is irreversible
              </h4>
              <p className="text-sm text-destructive/80">
                Once you delete your account, all your data, including subscriptions, 
                activity logs, and personal information will be permanently removed.
              </p>
            </div>
          </div>
        </div>
        
        <form action={formAction} className="space-y-6">
          {formState?.error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {formState.error}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending} 
              variant="destructive"
              className="min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SecurityPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>
        <p className="text-muted-foreground">
          Manage your account security and privacy settings
        </p>
      </div>
      
      <div className="space-y-6">
        <PasswordForm />
        <DeleteAccountForm />
      </div>
    </div>
  );
}