const PUBLIC_ROUTES = ["/auth", "/recipes", "/categories"];

export default defineNuxtRouteMiddleware((to) => {
  if (PUBLIC_ROUTES.some((route) => to.path === "/" || to.path.startsWith(route))) {
    return;
  }

  const user = useUser();

  if (!user.value) {
    return navigateTo("/auth");
  }
});
