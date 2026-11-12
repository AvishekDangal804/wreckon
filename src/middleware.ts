import { defineMiddleware } from "astro:middleware";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./lib/adminSession";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminRoute && pathname !== "/admin/login") {
    const token = context.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifySessionToken(token)) {
      return context.redirect("/admin/login");
    }
  }

  return next();
});
