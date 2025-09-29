<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { StatusCode } from "#shared/enums/base";

definePageMeta({
  layout: "auth",
});

const config = useRuntimeConfig();
const toast = useToast();
const route = useRoute();

const isLogin = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);

onMounted(() => {
  if (route.query.mode === "signup") {
    isLogin.value = false;
  }
});

function switchToLogin() {
  isLogin.value = true;
}

function switchToSignup() {
  isLogin.value = false;
}

const loginFields: any[] = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
    autocomplete: "email",
    size: "lg",
  },
  {
    name: "password",
    type: "password" as const,
    label: "Password",
    placeholder: "Enter your password",
    required: true,
    size: "lg",
  },
];

const signupFields: any[] = [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "Enter your first name",
    required: true,
    autocomplete: "given-name",
    size: "lg",
  },
  {
    name: "lastName",
    type: "text" as const,
    label: "Last Name",
    placeholder: "Enter your last name",
    required: true,
    autocomplete: "family-name",
    size: "lg",
  },
  {
    name: "email",
    type: "text" as const,
    label: "Email",
    placeholder: "Enter your email",
    required: true,
    autocomplete: "email",
    size: "lg",
  },
  {
    name: "password",
    type: "password" as const,
    label: "Password",
    placeholder: "Create a password",
    required: true,
    autocomplete: "new-password",
    size: "lg",
  },
  {
    name: "confirmPassword",
    type: "password" as const,
    label: "Confirm Password",
    placeholder: "Confirm your password",
    required: true,
    size: "lg",
  },
];

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginSchema = z.output<typeof loginSchema>;
type SignupSchema = z.output<typeof signupSchema>;

// Cookie setup
const accessToken = useCookie("access_token", {
  secure: true,
  sameSite: "strict",
  maxAge: parseInt(config.public.atMaxAge),
});
const refreshToken = useCookie("refresh_token", {
  secure: true,
  sameSite: "strict",
  maxAge: parseInt(config.public.rtMaxAge),
});
const isAuthenticated = useCookie<boolean>("authenticated", {
  secure: true,
  sameSite: "strict",
  maxAge: parseInt(config.public.rtMaxAge),
});
const userProfile = useCookie<UserProfile>("user_profile", {
  secure: true,
  sameSite: "strict",
  maxAge: parseInt(config.public.rtMaxAge),
});

async function onSubmit(event: FormSubmitEvent<LoginSchema | SignupSchema>) {
  isSubmitting.value = true;

  try {
    if (isLogin.value) {
      await handleLogin(event as FormSubmitEvent<LoginSchema>);
    } else {
      await handleSignup(event as FormSubmitEvent<SignupSchema>);
    }
  } catch {
    toast.add({
      title: "Error",
      description: "An unexpected error occurred",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

async function handleLogin(event: FormSubmitEvent<LoginSchema>) {
  const response = await useApi<{
    accessToken: string;
    refreshToken: string;
  }>("/auth/login", {
    method: "POST",
    body: event.data,
  });

  if (response.status.code === StatusCode.OK) {
    isAuthenticated.value = true;
    accessToken.value = response.data.accessToken;
    refreshToken.value = response.data.refreshToken;

    try {
      const profileResponse = await useApi<UserProfile>("/auth/me", {
        method: "GET",
      });

      if (profileResponse.status.code === StatusCode.OK) {
        userProfile.value = profileResponse.data;
      }
    } catch {
      toast.add({
        title: "Warning",
        description: "Logged in successfully but couldn't fetch profile data",
        color: "warning",
      });
    }

    toast.add({
      title: "Welcome back!",
      description: "Successfully signed in",
      color: "success",
    });

    navigateTo("/");
  } else {
    toast.add({
      title: "Sign in failed",
      description: response.status.message,
      color: "error",
    });
  }
}

async function handleSignup(event: FormSubmitEvent<SignupSchema>) {
  const response = await useApi<string>("/auth/signup", {
    method: "POST",
    body: {
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      email: event.data.email,
      password: event.data.password,
    },
  });

  if (response.status.code === StatusCode.OK) {
    toast.add({
      title: "Account created!",
      description: "Please sign in with your new account",
      color: "success",
    });

    isLogin.value = true;
  } else {
    toast.add({
      title: "Sign up failed",
      description: response.status.message,
      color: "error",
    });
  }
}

function handleForgotPassword() {
  toast.add({
    title: "Forgot Password",
    description: "Password reset functionality coming soon",
    color: "info",
  });
}

function handleTerms() {
  toast.add({
    title: "Terms of Service",
    description: "Terms page coming soon",
    color: "info",
  });
}

function handlePrivacy() {
  toast.add({
    title: "Privacy Policy",
    description: "Privacy policy page coming soon",
    color: "info",
  });
}
</script>

<template>
  <UPageCard>
    <UAuthForm
      v-if="isLogin"
      :schema="loginSchema"
      :fields="loginFields"
      title="Welcome Back"
      description="Enter your credentials to access your account"
      icon="i-lucide-cooking-pot"
      :loading="isSubmitting"
      :submit="{
        label: 'Sign In',
        block: true,
        size: 'lg',
      }"
      :ui="{
        leadingIcon: 'size-12 text-primary-600',
        input: 'w-full',
      }"
      @submit="onSubmit"
    >
      <template #description>
        <span class="text-gray-600">
          Don't have an account?
          <UButton
            variant="link"
            label="Sign up"
            class="text-primary-600 font-semibold hover:text-primary-700 p-0 h-auto"
            @click="switchToSignup"
          />
        </span>
      </template>

      <template #password-hint>
        <UButton
          variant="link"
          label="Forgot password?"
          class="text-primary-600 font-semibold hover:text-primary-700 p-0 h-auto text-sm"
          @click="handleForgotPassword"
        />
      </template>

      <template #footer>
        <p class="text-xs text-gray-500">
          By continuing, you agree to our
          <UButton
            variant="link"
            label="Terms of Service"
            class="text-primary-600 font-semibold hover:text-primary-700 p-0 h-auto text-xs"
            @click="handleTerms"
          />
          and
          <UButton
            variant="link"
            label="Privacy Policy"
            class="text-primary-600 font-semibold hover:text-primary-700 p-0 h-auto text-xs"
            @click="handlePrivacy"
          />
        </p>
      </template>
    </UAuthForm>

    <UAuthForm
      v-else
      :schema="signupSchema"
      :fields="signupFields"
      title="Create Account"
      description="Join our community of recipe creators"
      icon="i-lucide-cooking-pot"
      :loading="isSubmitting"
      :submit="{
        label: 'Create Account',
        block: true,
        size: 'lg',
        loading: isSubmitting,
      }"
      :ui="{
        leadingIcon: 'size-12 text-primary-600',
        input: 'w-full',
      }"
      @submit="onSubmit"
    >
      <template #description>
        <span class="text-gray-600">
          Already have an account?
          <UButton
            variant="link"
            label="Sign in"
            class="text-primary-600 font-semibold hover:text-primary-700 p-0 h-auto"
            @click="switchToLogin"
          />
        </span>
      </template>

      <template #footer>
        <p class="text-xs text-gray-500">
          By continuing, you agree to our
          <UButton
            variant="link"
            label="Terms of Service"
            class="text-primary-600 font-semibold hover:text-primary-700 p-0 h-auto text-xs"
            @click="handleTerms"
          />
          and
          <UButton
            variant="link"
            label="Privacy Policy"
            class="text-primary-600 font-semibold hover:text-primary-700 p-0 h-auto text-xs"
            @click="handlePrivacy"
          />
        </p>
      </template>
    </UAuthForm>
  </UPageCard>
</template>
