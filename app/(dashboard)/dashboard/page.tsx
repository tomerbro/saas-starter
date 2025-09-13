'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { customerPortalAction } from '@/lib/payments/actions';
import { User } from '@/lib/supabase/types';
import useSWR from 'swr';
import { Suspense } from 'react';
import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SubscriptionSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
    </Card>
  );
}

function ManageSubscription() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'trialing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'trialing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Trial</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {user?.planName || 'Free Plan'}
                </h3>
                {user?.subscriptionStatus && getStatusBadge(user.subscriptionStatus)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {user?.subscriptionStatus && getStatusIcon(user.subscriptionStatus)}
                <span>
                  {user?.subscriptionStatus === 'active'
                    ? 'Billed monthly'
                    : user?.subscriptionStatus === 'trialing'
                    ? 'Trial period'
                    : 'No active subscription'}
                </span>
              </div>
            </div>
            <form action={customerPortalAction}>
              <Button type="submit" variant="outline" className="w-full sm:w-auto">
                Manage Subscription
              </Button>
            </form>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Plan</h4>
              <p className="text-lg font-semibold">{user?.planName || 'Free'}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <div className="flex items-center gap-2">
                {user?.subscriptionStatus && getStatusIcon(user.subscriptionStatus)}
                <span className="capitalize">{user?.subscriptionStatus || 'Inactive'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Billing</h4>
              <p className="text-sm">
                {user?.subscriptionStatus === 'active' ? 'Monthly' : 'None'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your account.
        </p>
      </div>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <ManageSubscription />
      </Suspense>
    </div>
  );
}
