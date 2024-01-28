import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
        console.error(error);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const orgId = session?.metadata?.orgId;
        if (!orgId) {
            return new NextResponse("Organization ID is required", { status: 400 });
        }

        const { id, customer, items, current_period_end } = subscription;
        await db.orgSubscription.create({
            data: {
                orgId,
                stripeSubscriptionId: id,
                stripeCustomerId: customer as string,
                stripePriceId: items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(current_period_end * 1000)
            }
        });
    }

    // Renewed subscription
    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const { id, items, current_period_end } = subscription;

        await db.orgSubscription.update({
            where: {
                stripeSubscriptionId: id
            },
            data: {
                stripePriceId: items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(current_period_end * 1000)
            }
        })
    };

    return new NextResponse(null, { status: 200 });
};