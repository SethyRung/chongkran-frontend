export const useAuth = () => {
  const isAuthenticated = useCookie<boolean>("authenticated");
  const userProfile = useCookie<UserProfile>("user_profile");

  const userRole = computed(() => userProfile.value?.role);

  const hasRole = (role: string | string[]) => {
    if (!userRole.value) return false;

    if (Array.isArray(role)) {
      return role.includes(userRole.value);
    }

    return userRole.value === role;
  };

  const isAuthor = computed(() => hasRole(["author", "admin"]));
  const isAdmin = computed(() => hasRole("admin"));

  const getUserName = computed(() => {
    if (!userProfile.value) return "";
    return `${userProfile.value.firstName} ${userProfile.value.lastName}`.trim();
  });

  const getUserInitials = computed(() => {
    if (!userProfile.value) return "";
    const first = userProfile.value.firstName?.charAt(0) || "";
    const last = userProfile.value.lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase();
  });

  return {
    isAuthenticated: readonly(isAuthenticated),
    userProfile: readonly(userProfile),
    userRole: readonly(userRole),
    isAuthor,
    isAdmin,
    hasRole,
    getUserName,
    getUserInitials,
  };
};
