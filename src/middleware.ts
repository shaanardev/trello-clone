import { authMiddleware, redirectToSignIn  } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth(auth, req) {
        const { userId, orgId, isPublicRoute } = auth;
        const { url } = req;

        if (userId && isPublicRoute) {
            const path = orgId ? `/organization/${orgId}` : "/select-org";
            return NextResponse.redirect(new URL(path, url));
        }

        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: url });
        }
      
        if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
            return NextResponse.redirect(new URL("/select-org", url));
        }
    }
});
 
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};