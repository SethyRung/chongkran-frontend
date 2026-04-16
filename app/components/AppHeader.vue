<script setup lang="ts">
const route = useRoute();

const navigation = [
  { label: "Home", to: "/" },
  { label: "Recipes", to: "/recipes" },
  { label: "Categories", to: "/categories" },
];

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
}
</script>

<template>
  <UHeader class="border-b border-muted">
    <template #title>
      <UIcon name="i-lucide:cooking-pot" class="text-primary size-8" />
      <span class="text-xl font-bold">Chongkran</span>
    </template>

    <template #default>
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium transition-colors"
          :class="[isActive(item.to) ? 'text-primary' : 'text-muted hover:text-default']"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </template>

    <template #right>
      <div class="flex items-center gap-3">
        <UButton icon="i-lucide:search" color="neutral" variant="ghost" />
        <UColorModeButton />
        <UButton to="/auth/login">Login</UButton>
      </div>
    </template>
  </UHeader>
</template>
