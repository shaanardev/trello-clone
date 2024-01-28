import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const ratelimits = {
    free: new Ratelimit({
        redis: kv,
        // 1 requests from the same IP in 5 minutes
        limiter: Ratelimit.slidingWindow(1, '5 m'),
    }),
    paid: new Ratelimit({
        redis: kv,
        // 5 requests from the same IP in 5 minutes
        limiter: Ratelimit.slidingWindow(5, '5 m'),
    })
};