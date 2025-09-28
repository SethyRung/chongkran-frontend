<script lang="ts" setup></script>

<template>
  <div class="font-sans">
    <AppHeader />
    <UMain>
      <UContainer>
        <slot></slot>
      </UContainer>
    </UMain>
    <AppFooter />
  </div>
</template>
