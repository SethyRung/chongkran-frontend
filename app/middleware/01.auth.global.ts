export default defineNuxtRouteMiddleware((to, _from) => {
  const isAuthenticated = useCookie<boolean>("authenticated");

  const publicRoutes = [
    "/",
    "/recipes",
    "/recipes/",
    "/auth/login",
    "/auth/sign-up",
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => to.path === route || to.path.startsWith(route)
  );

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo("/auth/login");
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated.value && to.path.startsWith("/auth/")) {
    return navigateTo("/");
  }
});
