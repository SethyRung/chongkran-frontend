<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const tabs = [
  { label: "Login", value: "login" },
  { label: "Sign up", value: "signup" },
];

const mode = ref<"login" | "signup">("login");
const loginFormRef = ref();

function onSignupSuccess(email: string) {
  mode.value = "login";
  loginFormRef.value?.setEmail(email);
}

defineShortcuts({
  tab: () => {
    mode.value = mode.value === "login" ? "signup" : "login";
  },
});
</script>

<template>
  <UMain>
    <UContainer
      class="flex items-center justify-center min-h-[calc(100vh-var(--ui-header-height))] py-12"
    >
      <UCard class="w-full max-w-md">
        <template #header>
          <div class="text-center">
            <UIcon name="i-lucide:cooking-pot" class="text-primary size-12 mx-auto mb-2" />
            <h1 class="text-2xl font-bold">
              {{ mode === "login" ? "Welcome back" : "Create account" }}
            </h1>
            <p class="text-sm text-muted-foreground">
              {{
                mode === "login"
                  ? "Sign in to your account to continue"
                  : "Sign up to get started with Chongkran"
              }}
            </p>
          </div>
        </template>

        <UTabs
          v-model="mode"
          :items="tabs"
          size="lg"
          :ui="{
            content: 'pt-6',
          }"
        >
          <template #content>
            <AuthLoginForm v-if="mode === 'login'" ref="loginFormRef" />

            <AuthSignupForm v-else @success="onSignupSuccess" />
          </template>
        </UTabs>
      </UCard>
    </UContainer>
  </UMain>
</template>
