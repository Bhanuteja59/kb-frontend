import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/announcements-documents/:path*", "/work-orders/:path*", "/violations-arc/:path*", "/residents-units/:path*", "/dues-ledger/:path*", "/settings/:path*"],
};

