<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const navigationItems = reactive<NavigationMenuItem[]>([
  {
    icon: "i-lucide-layout-dashboard",
    label: "Dashboard",
    to: "/author",
  },
  {
    icon: "i-lucide-plus-circle",
    label: "Create Recipe",
    to: "/author/create",
  },
  {
    icon: "i-lucide-notebook-pen",
    label: "My Recipes",
    to: "/author/recipes",
  },
  {
    icon: "i-lucide-bar-chart-3",
    label: "Analytics",
    to: "/author/analytics",
  },
  {
    icon: "i-lucide-settings",
    label: "Settings",
    to: "/author/settings",
  },
]);
</script>

<template>
  <div class="w-64 bg-white border-r border-[#666]/35 flex flex-col h-full">
    <div class="p-6 border-b border-[#666]/35">
      <NuxtLink to="/" class="font-bold text-primary-500 flex items-center gap-1.5 text-lg">
        <UIcon name="i-lucide-cooking-pot" size="24" /> Chongkran
      </NuxtLink>
      <p class="text-sm text-[#666] mt-2">Author Dashboard</p>
    </div>

    <nav class="flex-1 p-4">
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        :ui="{
          item: 'rounded-lg mb-1',
          link: 'h-11 px-3 gap-3',
          active: 'bg-primary-50 text-primary-500',
        }"
      />
    </nav>

    <div class="p-4 border-t border-[#666]/35">
      <UButton
        icon="i-lucide-log-out"
        label="Back to Main Site"
        variant="ghost"
        color="neutral"
        class="w-full justify-start"
        to="/"
      />
    </div>
  </div>
</template>
