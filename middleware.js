import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect these routes with Clerk
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { default: arcjet, detectBot, shield } = await import("arcjet");
  const aj = arcjet({
    client:{
      key: process.env.ARCJET_API_KEY,
    },
    log: console,
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
      }),
    ],
  });

  const decision = await aj.protect(req);
  if (!decision.isAllowed) {
    return new Response("Bot or suspicious request detected", { status: 403 });
  }

  const { userId, redirectToSignIn } = await auth();
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  return;
});

export const config = {
  matcher: [
    // Apply to everything except static files and Next internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
