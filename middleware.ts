import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

// const isProtected = createRouteMatcher(["/"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtected(req)) {
//     auth().protect();
//   }
// });

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
