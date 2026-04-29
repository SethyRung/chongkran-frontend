<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const toast = useToast();

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
});

const loading = ref(false);
const user = useUser();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;

    const { data } = event;

    const res = await useApi("/api/auth/login", {
      method: "POST",
      body: { email: data.email, password: data.password },
    });

    if (res.status.code === ApiResponseCode.Success) {
      const res = await useApi("/api/auth/me");

      if (res.status.code === ApiResponseCode.Success) {
        user.value = res.data;
      }

      toast.add({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
        color: "success",
        icon: "i-lucide-check-circle",
      });

      await navigateTo("/");
    } else {
      toast.add({
        title: "Login failed",
        description: res.status.message || "Please check your credentials.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Login failed",
      description: "Please check your credentials.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
    <UFormField name="email" label="Email" required>
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@example.com"
        icon="i-lucide-mail"
        autocomplete="email"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField name="password" label="Password" required>
      <UInput
        v-model="state.password"
        type="password"
        placeholder="••••••••"
        icon="i-lucide-lock"
        autocomplete="current-password"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <div class="flex items-center justify-between">
      <UCheckbox label="Remember me" size="xl" />
      <ULink to="/auth" variant="soft" color="neutral"> Forgot password? </ULink>
    </div>

    <UButton label="Sign in" type="submit" :loading="loading" block size="xl" />

    <USeparator label="OR" />

    <UButton
      icon="i-lucide-home"
      label="Continue as guest"
      size="xl"
      variant="outline"
      color="neutral"
      block
      to="/"
    />
  </UForm>
</template>
