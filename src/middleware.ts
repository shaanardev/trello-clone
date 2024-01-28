import { authMiddleware, redirectToSignIn  } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: ["/", "/api/webhook"],
    afterAuth(auth, req) {
        const { userId, orgId, isPublicRoute } = auth;
        const { url, nextUrl } = req;

        if (userId && isPublicRoute) {
            const path = orgId ? `/organization/${orgId}` : "/select-org";
            return NextResponse.redirect(new URL(path, url));
        }

        if (!userId && !isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: url });
        }
      
        if (userId && !orgId && nextUrl.pathname !== "/select-org") {
            return NextResponse.redirect(new URL("/select-org", url));
        }
    }
});
 
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};