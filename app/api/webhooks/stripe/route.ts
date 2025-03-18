import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import {
  createOrUpdateSubscription,
  updateUserPoints,
} from '@/utils/db/actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  if (!signature) {
    console.error('No stripe signature found');
    return new NextResponse('No signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook Error:', err);
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string;

    if (!userId || !subscriptionId) {
      console.error('Missing userId or subscriptionId');
      return new NextResponse('Missing userId or subscriptionId', {
        status: 400,
      });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (!subscription.items.data.length) {
        console.error('No subscription items found');
        return new NextResponse('No subscription items found', {
          status: 400,
        });
      }

      const priceId = subscription.items.data[0].price.id;

      let plan: string;
      let pointsToAdd: number;

      // Map price IDs to plan names and points
      switch (priceId) {
        case 'price_1R3RvKDniTjXmmW21ofwtiyE':
          plan = 'Basic';
          pointsToAdd = 100;
          break;
        case 'price_1R3RujDniTjXmmW2HRhGdnPH':
          plan = 'Pro';
          pointsToAdd = 500;
          break;
        default:
          console.error('Unknown price ID', { priceId });
          return NextResponse.json(
            { error: 'Unknown price ID' },
            { status: 400 }
          );
      }

      console.log('Creating subscription for user', userId, 'with plan', plan);
      const updateSubscription = await createOrUpdateSubscription(
        userId,
        subscriptionId,
        plan,
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000)
      );

      if (!updateSubscription) {
        console.error('Failed to create or update subscription');
        return new NextResponse('Failed to create or update subscription', {
          status: 500,
        });
      }

      console.log("Updating user points for user", userId);
      await updateUserPoints(userId, pointsToAdd);

      console.log('User points updated successfully for user', userId);
    } catch (error) {
      console.error('Error processing checkout session:', error);
      return new NextResponse('Error processing checkout session', {
        status: 500,
      });
    }

    console.log(`Payment for session ${session.id} succeeded.`);
    // Handle successful payment
  }

  return NextResponse.json({ received: true });
}
