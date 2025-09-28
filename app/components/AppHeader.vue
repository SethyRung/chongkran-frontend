<script lang="ts" setup>
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { StatusCode } from "#shared/enums/base";

const accessToken = useCookie("access_token");
const refreshToken = useCookie("refresh_token");
const isAuthenticated = useCookie<boolean>("authenticated");
const isOpen = ref<boolean>(false);

const { isAuthor, getUserName } = useAuth();

const route = useRoute();
watch(route, () => {
  isOpen.value = false;
});

const toast = useToast();

const logout = async () => {
  const response = await useApi("/auth/logout", {
    method: "POST",
  });
  if (response.status.code === StatusCode.OK) {
    isAuthenticated.value = false;
    accessToken.value = null;
    refreshToken.value = null;
    navigateTo("/");
  } else {
    toast.add({
      title: "Error",
      description: response.status.message,
      color: "error",
    });
  }
};

const profileItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      icon: "i-lucide-user",
      label: getUserName.value || "Your Profile",
      to: "/profile",
    },
    {
      icon: "i-lucide-heart",
      label: "Favorites",
      to: "/recipes?tab=favorites",
    },
    isAuthor.value
      ? {
          icon: "i-lucide-layout-dashboard",
          label: "Author Dashboard",
          to: "/author",
        }
      : { icon: "i-lucide-user-pen", label: "Become Author" },
  ],
  [{ icon: "i-lucide-log-out", label: "Logout", onSelect: logout }],
]);

const navigationItems = reactive<NavigationMenuItem[]>([
  {
    icon: "i-lucide-house",
    label: "Home",
    to: "/",
  },
  {
    icon: "i-lucide-notebook",
    label: "Recipes",
    to: "/recipes",
  },
]);
</script>

<template>
  <UHeader
    to="/"
    mode="slideover"
    :ui="{
      title: 'text-primary-500',
    }"
  >
    <template #title>
      <UIcon name="i-lucide-cooking-pot" size="24" /> Chongkran
    </template>
    <UNavigationMenu :items="navigationItems" />
    <template #right>
      <UDropdownMenu v-if="isAuthenticated" :items="profileItems">
        <UButton
          icon="i-lucide-user"
          size="lg"
          color="primary"
          variant="soft"
          class="rounded-full"
        />
      </UDropdownMenu>
      <UButton v-else label="Log in" variant="outline" to="/auth/login" />
    </template>
    <template #body>
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
