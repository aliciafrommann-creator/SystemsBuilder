/**
 * AlpineFlow Payment Architecture — Stripe Connect
 *
 * AlpineFlow is a multi-tenant platform. Each hotel connects its OWN Stripe account.
 * All payments flow directly to the hotel. AlpineFlow never holds guest funds.
 *
 * Flow:
 *   Guest books session
 *     → AlpineFlow creates a Stripe Checkout Session on the hotel's connected account
 *     → Guest pays via Stripe
 *     → Money lands in the hotel's Stripe account
 *     → AlpineFlow can optionally collect a platform fee (application_fee_amount)
 *     → Booking confirmed in Supabase
 *
 * Hotel onboarding:
 *   1. Hotel admin clicks "Connect Stripe" in hotel settings
 *   2. AlpineFlow redirects to Stripe Connect OAuth
 *   3. Hotel authorises AlpineFlow
 *   4. Stripe returns access_token + stripe_user_id
 *   5. AlpineFlow stores stripe_account_id in hotel record
 *
 * Environment variables needed per deployment:
 *   STRIPE_SECRET_KEY          — AlpineFlow platform key (secret, server only)
 *   STRIPE_PUBLISHABLE_KEY     — AlpineFlow platform key (public)
 *   STRIPE_WEBHOOK_SECRET      — For verifying webhook events
 *   NEXT_PUBLIC_APP_URL        — e.g. https://alpineflow.vercel.app
 *
 * Per hotel (stored in Supabase hotels table):
 *   stripe_account_id          — The hotel's connected Stripe account ID (acct_xxx)
 */

export interface AlpineFlowBooking {
  id: string
  hotelId: string
  guestId: string
  roomNumber: string
  service: {
    name: string
    description: string
    priceEur: number
    durationMin: number
    category: 'spa' | 'movement' | 'nourishment' | 'local_partner'
  }
  slot: {
    date: string   // ISO date
    time: string   // HH:MM
  }
  payment: {
    method: 'stripe_online' | 'room_bill'
    status: 'pending' | 'paid' | 'room_charged' | 'cancelled'
    stripeSessionId?: string
    stripePaymentIntentId?: string
  }
  createdAt: string
}

export interface HotelStripeConfig {
  hotelId: string
  stripeAccountId: string   // acct_xxx — the hotel's own Stripe account
  connectedAt: string
  chargesEnabled: boolean
  payoutsEnabled: boolean
  platformFeePercent: number  // AlpineFlow fee, e.g. 0.05 = 5%
}

/**
 * Creates a Stripe Checkout Session on the hotel's connected account.
 * Call this from a server-side API route (/api/checkout).
 *
 * Example implementation:
 *
 * import Stripe from 'stripe'
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
 *
 * const session = await stripe.checkout.sessions.create({
 *   mode: 'payment',
 *   line_items: [{
 *     price_data: {
 *       currency: 'eur',
 *       unit_amount: booking.service.priceEur * 100,
 *       product_data: { name: booking.service.name },
 *     },
 *     quantity: 1,
 *   }],
 *   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
 *   cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/guest/wellness`,
 *   metadata: { bookingId: booking.id, hotelId: booking.hotelId },
 *   payment_intent_data: {
 *     application_fee_amount: Math.round(booking.service.priceEur * hotelConfig.platformFeePercent * 100),
 *     transfer_data: { destination: hotelConfig.stripeAccountId },
 *   },
 * }, { stripeAccount: hotelConfig.stripeAccountId })
 *
 * return session.url
 */
export type CheckoutSessionResult =
  | { url: string; sessionId: string }
  | { error: string }

/**
 * Local partner discount voucher.
 * Generated client-side, redeemed by the partner (QR or code entry).
 */
export interface PartnerVoucher {
  code: string             // e.g. AF-AQUA-7X3K
  partnerName: string
  discountEur: number
  discountPct?: number
  guestName: string
  roomNumber: string
  validFrom: string
  validTo: string          // end of stay
  redeemed: boolean
}

export function generateVoucherCode(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `AF-${prefix.toUpperCase().slice(0, 4)}-${seg(4)}`
}
