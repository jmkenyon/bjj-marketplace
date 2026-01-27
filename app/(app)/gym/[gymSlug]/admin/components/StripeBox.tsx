import { Button } from '@/components/ui/button'
import { Gym } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface StripeBoxProps {
    gym: Gym
    isLoadingStripe: boolean
    handleCreateAccount: () => void

}

const StripeBox = ({gym, isLoadingStripe, handleCreateAccount}: StripeBoxProps) => {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm mt-4">
    <div className="flex items-start justify-between gap-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">Payments</h3>
        <p className="mt-1 text-sm text-neutral-600 max-w-prose">
          Connect Stripe to accept drop-in payments. We never see or store
          your bank details.
        </p>

        <p className="mt-3 text-sm">
          Status:{" "}
          {gym.stripeEnabled ? (
            <span className="font-medium text-green-600">Connected</span>
          ) : (
            <span className="font-medium text-neutral-500">
              Not connected
            </span>
          )}
        </p>
      </div>

      <div className="shrink-0">
        {gym.stripeEnabled ? (
          <Button
            variant="outline"
            onClick={() =>
              window.open("https://dashboard.stripe.com", "_blank")
            }
          >
            Open Stripe Dashboard
          </Button>
        ) : (
          <Button
            className="bg-black text-white hover:bg-neutral-800"
            onClick={handleCreateAccount}
            disabled={isLoadingStripe}
          >
            {isLoadingStripe && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {isLoadingStripe ? "Connecting Stripe" : "Connect Stripe"}
          </Button>
        )}
      </div>
    </div>
  </section>
  )
}

export default StripeBox