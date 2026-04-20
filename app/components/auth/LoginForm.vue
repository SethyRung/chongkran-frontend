<script setup lang="ts">
import { z } from "zod";

const toast = useToast();

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginSchema = z.output<typeof loginSchema>;

const loginState = reactive<Partial<LoginSchema>>({
  email: "",
  password: "",
});

const loginForm = ref();
const isLoading = ref(false);

async function onSubmit() {
  const valid = await loginForm.value?.validate();
  if (!valid) return;

  isLoading.value = true;

  try {
    toast.add({
      title: "Welcome back!",
      description: "You have been logged in successfully.",
      color: "success",
      icon: "i-lucide-check-circle",
    });

    await navigateTo("/");
  } catch (error: any) {
    toast.add({
      title: "Login failed",
      description: error.data?.message || "Please check your credentials.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    isLoading.value = false;
  }
}

function setEmail(email: string) {
  loginState.email = email;
  loginState.password = "";
}

defineExpose({
  setEmail,
});
</script>

<template>
  <UForm
    ref="loginForm"
    :schema="loginSchema"
    :state="loginState"
    class="space-y-6"
    @submit="onSubmit"
  >
    <UFormField name="email" label="Email" required>
      <UInput
        v-model="loginState.email"
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
        v-model="loginState.password"
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

    <UButton label="Sign in" type="submit" :loading="isLoading" block size="xl" />

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
