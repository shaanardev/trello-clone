"use server";

import { auth, currentUser } from "@clerk/nextjs";

import type { ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirectSchema } from "./schema";
import { absoluteURL } from "@/lib/utils";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

const handler = async (): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    const user = await currentUser();

    if (!userId || !orgId || !user) {
        return {
            error: "Unauthorized"
        }
    }

    const settingsURL = absoluteURL(`/organization/${orgId}`);
    let url = "";

    try {
        const orgSubscription = await db.orgSubscription.findUnique({
            where: {
                orgId
            }
        });
        console.log(orgSubscription);
        if (orgSubscription && orgSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: orgSubscription.stripeCustomerId,
                return_url: settingsURL
            });

            url = stripeSession.url;
        } else {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingsURL,
                cancel_url: settingsURL,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "AUD",
                            product_data: {
                                name: "Taskify Pro",
                                description: "Unlimited boards for your organization"
                            },
                            unit_amount: 2000, //20
                            recurring: {
                                interval: "month"
                            }
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    orgId
                }
            });
            url = stripeSession.url || ""; 
        }
    } catch (error) {
        console.error(error);
        return {
            error: "Something went wrong."
        }
    }

    revalidatePath(`/organization/${orgId}`);
    return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedirectSchema, handler);