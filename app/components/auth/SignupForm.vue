<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const toast = useToast();
const emit = defineEmits<{
  success: [email: string];
}>();

const schema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;

    const { data } = event;

    const res = await useApi("/api/auth/signup", {
      method: "POST",
      body: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Account created!",
        description: "Please log in with your new account.",
        color: "success",
        icon: "i-lucide-check-circle",
      });

      emit("success", data.email);
    } else {
      toast.add({
        title: "Signup failed",
        description: res.status.message || "Please try again.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Signup failed",
      description: "Please try again.",
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
    <div class="flex gap-6">
      <UFormField name="firstName" label="First name" required class="flex-1">
        <UInput
          v-model="state.firstName"
          icon="i-lucide-user"
          placeholder="John"
          autocomplete="given-name"
          size="xl"
          class="w-full"
        />
      </UFormField>

      <UFormField name="lastName" label="Last name" required class="flex-1">
        <UInput
          v-model="state.lastName"
          placeholder="Doe"
          autocomplete="family-name"
          size="xl"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField name="email" label="Email" required>
      <UInput
        v-model="state.email"
        type="email"
        icon="i-lucide-mail"
        placeholder="you@example.com"
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
        autocomplete="new-password"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField name="confirmPassword" label="Confirm password" required>
      <UInput
        v-model="state.confirmPassword"
        type="password"
        placeholder="••••••••"
        icon="i-lucide:lock"
        autocomplete="new-password"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField name="terms">
      <UCheckbox label="I agree to the Terms of Service and Privacy Policy" required />
    </UFormField>

    <UButton type="submit" label="Create account" :loading="loading" block size="xl" />
  </UForm>
</template>
