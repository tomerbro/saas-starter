import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CreditCard, Database, Zap, Shield, Users, Star } from 'lucide-react';
import { Terminal } from './terminal';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="mb-6">
                <Badge variant="secondary" className="text-sm">
                  <Star className="h-3 w-3 mr-1" />
                  Now with Supabase
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Build Your SaaS
                <span className="block text-primary">Faster Than Ever</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Launch your SaaS product in record time with our powerful,
                ready-to-use template. Packed with modern technologies and
                essential integrations.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a
                  href="https://vercel.com/templates/next.js/next-js-saas-starter"
                  target="_blank"
                >
                  <Button
                    size="lg"
                    className="text-lg"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Deploy your own
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Everything you need to launch
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies and best practices for optimal performance and developer experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground mb-4 mx-auto">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle>Next.js & React</CardTitle>
                <CardDescription>
                  Leverage the power of modern web technologies for optimal
                  performance and developer experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground mb-4 mx-auto">
                  <Database className="h-6 w-6" />
                </div>
                <CardTitle>Supabase & Auth</CardTitle>
                <CardDescription>
                  Powerful database and authentication solution with real-time
                  capabilities and built-in security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground mb-4 mx-auto">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle>Stripe Integration</CardTitle>
                <CardDescription>
                  Seamless payment processing and subscription management with
                  industry-leading Stripe integration.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to launch your SaaS?
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                Our template provides everything you need to get your SaaS up
                and running quickly. Don't waste time on boilerplate - focus on
                what makes your product unique.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a href="https://github.com/nextjs/saas-starter" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  View the code
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
