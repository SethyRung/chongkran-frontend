<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
}

const navigation = computed<NavigationMenuItem[]>(() => [
  { label: "Home", active: isActive("/"), to: "/" },
  { label: "Recipes", active: isActive("/recipes"), to: "/recipes" },
  { label: "Categories", active: isActive("/categories"), to: "/categories" },
]);
</script>

<template>
  <UHeader class="border-b border-muted">
    <template #title>
      <UIcon name="i-lucide:cooking-pot" class="text-primary size-8" />
      <span class="text-xl font-bold">Chongkran</span>
    </template>

    <template #default>
      <UNavigationMenu
        :items="navigation"
        :ui="{
          link: 'before:bg-transparent',
        }"
      />
    </template>

    <template #right>
      <div class="flex items-center gap-3">
        <UButton icon="i-lucide:search" color="neutral" variant="ghost" />
        <UColorModeButton />
        <UButton to="/auth">Login</UButton>
      </div>
    </template>

    <template #body>
      <UNavigationMenu
        :items="navigation"
        orientation="vertical"
        :ui="{
          link: 'h-10',
        }"
      />
    </template>
  </UHeader>
</template>
