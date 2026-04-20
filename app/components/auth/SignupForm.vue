<script setup lang="ts">
import { z } from "zod";

const toast = useToast();
const emit = defineEmits<{
  success: [email: string];
}>();

const signupSchema = z
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

type SignupSchema = z.output<typeof signupSchema>;

const signupState = reactive<Partial<SignupSchema>>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const signupForm = ref();
const isLoading = ref(false);

async function onSubmit() {
  const valid = await signupForm.value?.validate();
  if (!valid) return;

  isLoading.value = true;

  try {
    toast.add({
      title: "Account created!",
      description: "Please log in with your new account.",
      color: "success",
      icon: "i-lucide-check-circle",
    });

    emit("success", signupState.email || "");
  } catch (error: any) {
    toast.add({
      title: "Signup failed",
      description: error.data?.message || "Please try again.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UForm
    ref="signupForm"
    :schema="signupSchema"
    :state="signupState"
    class="space-y-6"
    @submit="onSubmit"
  >
    <div class="flex gap-6">
      <UFormField name="firstName" label="First name" required class="flex-1">
        <UInput
          v-model="signupState.firstName"
          icon="i-lucide-user"
          placeholder="John"
          autocomplete="given-name"
          size="xl"
          class="w-full"
        />
      </UFormField>

      <UFormField name="lastName" label="Last name" required class="flex-1">
        <UInput
          v-model="signupState.lastName"
          placeholder="Doe"
          autocomplete="family-name"
          size="xl"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField name="email" label="Email" required>
      <UInput
        v-model="signupState.email"
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
        v-model="signupState.password"
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
        v-model="signupState.confirmPassword"
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

    <UButton type="submit" label="Create account" :loading="isLoading" block size="xl" />
  </UForm>
</template>
