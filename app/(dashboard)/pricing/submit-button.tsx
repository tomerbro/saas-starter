'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Zap } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full"
      size="lg"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
