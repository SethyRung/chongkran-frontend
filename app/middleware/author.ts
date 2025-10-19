export default defineNuxtRouteMiddleware(() => {
  const isAuthenticated = useCookie<boolean>("authenticated");
  const userProfile = useCookie<UserProfile>("user_profile");

  // First check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo("/auth/login");
  }

  // Check if user profile exists and has author/admin role
  if (!userProfile.value || !userProfile.value.role) {
    // Profile data missing, redirect to login
    return navigateTo("/auth/login");
  }

  // Check if user has author or admin role
  if (
    userProfile.value.role !== "author" &&
    userProfile.value.role !== "admin"
  ) {
    // If user is normal user, redirect to home page
    return navigateTo("/");
  }
});
