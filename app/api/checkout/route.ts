/**
 * AlpineFlow Checkout API Route
 *
 * This is the scaffold for real Stripe Connect payments.
 * To activate: add STRIPE_SECRET_KEY to your Vercel environment variables.
 *
 * Each hotel stores their stripe_account_id in Supabase.
 * Payments go directly to the hotel — AlpineFlow collects a platform fee.
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      serviceName: string
      priceEur: number
      durationMin: number
      slot: string
      roomNumber: string
      hotelStripeAccountId?: string
    }

    // When STRIPE_SECRET_KEY is configured and the hotel has connected their
    // Stripe account, this creates a real checkout session on their account.
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    if (!stripeKey) {
      // Demo mode — return a simulated booking reference
      return NextResponse.json({
        demo: true,
        bookingRef: `AF-${Date.now().toString(36).toUpperCase()}`,
        message: 'Demo booking confirmed. Connect hotel Stripe account to enable real payments.',
      })
    }

    // Real Stripe Connect checkout (requires stripe package + hotel account ID)
    // Uncomment when stripe is installed: npm install stripe
    //
    // const stripe = new Stripe(stripeKey)
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   line_items: [{
    //     price_data: {
    //       currency: 'eur',
    //       unit_amount: body.priceEur * 100,
    //       product_data: {
    //         name: body.serviceName,
    //         description: `${body.durationMin} min · ${body.slot} · Room ${body.roomNumber}`,
    //       },
    //     },
    //     quantity: 1,
    //   }],
    //   success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url:  `${appUrl}/guest/wellness`,
    //   metadata: { roomNumber: body.roomNumber, slot: body.slot },
    //   ...(body.hotelStripeAccountId && {
    //     payment_intent_data: {
    //       application_fee_amount: Math.round(body.priceEur * 0.05 * 100), // 5% platform fee
    //       transfer_data: { destination: body.hotelStripeAccountId },
    //     },
    //   }),
    // })
    // return NextResponse.json({ url: session.url, sessionId: session.id })

    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
