import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoutes = createRouteMatcher([
    "/dashboard(.*)",
    "/account(.*)",
    "/transaction(.*)"
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoutes(req)) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}