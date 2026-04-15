<script lang="ts" setup></script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <AppHeader />

    <UMain class="flex-1">
      <slot></slot>
    </UMain>

    <AppFooter />
  </div>
</template>
