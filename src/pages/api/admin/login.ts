import type { APIRoute } from "astro";
import { ADMIN_SESSION_COOKIE, checkAdminPassword, createSessionToken, isAdminConfigured } from "../../../lib/adminSession";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!isAdminConfigured()) {
    return redirect("/admin/login");
  }

  const form = await request.formData();
  const password = form.get("password")?.toString() ?? "";

  if (!checkAdminPassword(password)) {
    return redirect("/admin/login?error=1");
  }

  cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
  });

  return redirect("/admin");
};
