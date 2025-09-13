import { checkoutAction } from '@/lib/payments/actions';
import { Check, Star, Zap } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a free trial period.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            name={basePlan?.name || 'Base'}
            price={basePrice?.unitAmount || 800}
            interval={basePrice?.interval || 'month'}
            trialDays={basePrice?.trialPeriodDays || 7}
            features={[
              'Unlimited Usage',
              'Unlimited Workspace Members',
              'Email Support',
            ]}
            priceId={basePrice?.id}
          />
          <PricingCard
            name={plusPlan?.name || 'Plus'}
            price={plusPrice?.unitAmount || 1200}
            interval={plusPrice?.interval || 'month'}
            trialDays={plusPrice?.trialPeriodDays || 7}
            features={[
              'Everything in Base, and:',
              'Early Access to New Features',
              '24/7 Support + Slack Access',
            ]}
            priceId={plusPrice?.id}
            popular
          />
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
  popular = false,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
  popular?: boolean;
}) {
  return (
    <Card className={`relative ${popular ? 'border-primary shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>
          {trialDays} day free trial included
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold">
            ${price / 100}
            <span className="text-lg font-normal text-muted-foreground">
              /{interval}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            per user
          </p>
        </div>
        
        <Separator />
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <form action={checkoutAction} className="pt-4">
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
