<script setup lang="ts">
const year = computed(() => new Date().getFullYear());
</script>

<template>
  <UFooter class="border-t border-muted py-8">
    <template #left>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide:cooking-pot" class="text-primary size-6" />
        <span class="font-semibold">Chongkran</span>
      </div>
    </template>

    <template #default>
      <p class="text-sm text-muted">© {{ year }} Chongkran. All rights reserved.</p>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <NuxtLink to="https://sethyrung.com" class="text-sm text-muted hover:text-default">
          About
        </NuxtLink>
      </div>
    </template>
  </UFooter>
</template>
