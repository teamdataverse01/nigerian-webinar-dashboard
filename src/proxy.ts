import { NextResponse, type NextRequest } from "next/server";

const africaDpoUrl = "https://webinar-dashboard-psi.vercel.app/";

export function proxy(request: NextRequest) {
  const continent = request.headers.get("x-vercel-ip-continent");
  const country = request.headers.get("x-vercel-ip-country");

  if (continent === "AF" || country === "GB") {
    const response = NextResponse.redirect(africaDpoUrl, 307);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
