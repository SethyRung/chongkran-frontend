<script lang="ts" setup>
import * as z from "zod";
import { useAuthor } from "~/composables/useAuthor";

definePageMeta({
  middleware: ["author"],
  layout: "author",
});

const { updateAuthorProfile } = useAuthor();
const toast = useToast();

const isSaving = ref(false);
const activeTab = ref("profile");
const profileFormRef = ref();
const profilePhotoInput = ref<HTMLInputElement>();

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().optional(),
});

type ProfileSchema = z.output<typeof profileSchema>;

const profileState = reactive<
  Partial<ProfileSchema> & {
    profilePhoto?: string;
  }
>({
  displayName: "Sethy Rung",
  email: "rungsethyhk@gmail.com",
  bio: "Passionate home chef sharing delicious recipes and cooking tips. Love experimenting with flavors and creating easy-to-follow recipes for everyone to enjoy.",
  website: "",
  location: "Phnom Penh, Cambodia",
  profilePhoto: "",
});

const socialLinks = reactive({
  instagram: "",
  twitter: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  linkedin: "",
});

const notifications = reactive({
  email: true,
  comments: true,
  likes: true,
  weeklySummary: true,
  newFollowers: true,
  recipeMentions: true,
});

const privacy = reactive({
  publicProfile: true,
  showEmail: false,
  allowMessages: true,
  showActivity: true,
  allowSearchIndexing: true,
});

const appearance = reactive({
  theme: "light",
  language: "en",
  dateFormat: "MM/DD/YYYY",
  timezone: "Asia/Phnom_Penh",
});

const settingsTabs = [
  {
    label: "Profile",
    value: "profile",
    slot: "profile",
    icon: "i-lucide-user",
  },
  {
    label: "Social",
    value: "social",
    slot: "social",
    icon: "i-lucide-share-2",
  },
  {
    label: "Notifications",
    value: "notifications",
    slot: "notifications",
    icon: "i-lucide-bell",
  },
  {
    label: "Privacy",
    value: "privacy",
    slot: "privacy",
    icon: "i-lucide-lock",
  },
  {
    label: "Appearance",
    value: "appearance",
    slot: "appearance",
    icon: "i-lucide-palette",
  },
  {
    label: "Account",
    value: "account",
    slot: "account",
    icon: "i-lucide-settings",
  },
];

function triggerProfilePhotoInput() {
  profilePhotoInput.value?.click();
}

function handleProfilePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    // Handle file upload - you'll need to implement Cloudinary integration
    const reader = new FileReader();
    reader.onload = (e) => {
      profileState.profilePhoto = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function saveSettings() {
  isSaving.value = true;
  try {
    // Validate profile form
    if (activeTab.value === "profile") {
      const valid = await profileFormRef.value?.validate();
      if (!valid) {
        return;
      }
    }

    const profileData = {
      ...profileState,
      socialLinks,
      notifications,
      privacy,
      appearance,
    };

    await updateAuthorProfile(profileData);
    toast.add({
      title: "Success",
      description: "Settings saved successfully",
      color: "success",
    });
  } catch (error) {
    // Error is handled by the composable
  } finally {
    isSaving.value = false;
  }
}

function confirmDeleteAccount() {
  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    // Implement account deletion logic
    toast.add({
      title: "Account Deletion",
      description: "Account deletion feature will be implemented soon.",
      color: "info",
    });
  }
}

function exportData() {
  // Export user data
  const exportData = {
    profile: profileState,
    socialLinks,
    notifications,
    privacy,
    appearance,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `chongkran-settings-${new Date().toISOString().split("T")[0]}.json`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.add({
    title: "Data Exported",
    description: "Your settings have been exported successfully.",
    color: "success",
  });
}

// Load current settings on component mount
onMounted(async () => {
  try {
    // Load current author profile
    // const response = await getAuthorProfile();
    // Update form with current data
  } catch (error) {
    // Error is handled by the composable
  }
});
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Settings
          </h1>
          <p class="text-base sm:text-lg text-gray-600">
            Manage your author profile and preferences
          </p>
        </div>
        <div class="flex gap-2 sm:gap-3">
          <UButton
            label="Export Data"
            variant="outline"
            size="lg"
            class="hidden sm:flex rounded-xl"
            icon="i-lucide-download"
            @click="exportData"
          />
          <UButton
            icon="i-lucide-download"
            size="lg"
            class="sm:hidden rounded-xl"
            @click="exportData"
          />
          <UButton
            label="Save Changes"
            size="lg"
            class="rounded-xl"
            :loading="isSaving"
            @click="saveSettings"
          />
        </div>
      </div>

      <!-- Settings Tabs -->
      <UTabs v-model="activeTab" :items="settingsTabs" class="w-full">
        <!-- Profile Tab -->
        <template #profile="{ item }">
          <div class="space-y-6">
            <!-- Profile Information -->
            <UCard variant="outline" class="rounded-[12px]">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon :name="item.icon" size="20" />
                  <h2 class="text-lg font-semibold">Profile Information</h2>
                </div>
              </template>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Profile Photo -->
                <div class="lg:col-span-1">
                  <div class="text-center space-y-4">
                    <div class="relative inline-block">
                      <NuxtImg
                        :src="
                          profileState.profilePhoto ||
                          'https://avatars.githubusercontent.com/u/72643226?v=4'
                        "
                        alt="Profile photo"
                        class="w-32 h-32 rounded-full object-cover mx-auto"
                      />
                      <UButton
                        icon="i-lucide-camera"
                        variant="ghost"
                        size="sm"
                        class="absolute bottom-0 right-0 rounded-full"
                        @click="triggerProfilePhotoInput"
                      />
                    </div>
                    <div>
                      <p class="text-sm text-[#666] mb-2">Upload a new profile photo</p>
                      <p class="text-xs text-[#666]">JPG, PNG or GIF. Max size of 5MB.</p>
                      <input
                        ref="profilePhotoInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleProfilePhotoUpload"
                      />
                    </div>
                  </div>
                </div>

                <!-- Profile Form -->
                <div class="lg:col-span-2">
                  <UForm
                    ref="profileFormRef"
                    :schema="profileSchema"
                    :state="profileState"
                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <UFormField label="Display Name" name="displayName" required size="xl">
                      <UInput
                        v-model="profileState.displayName"
                        placeholder="Your display name"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField label="Email" name="email" required size="xl">
                      <UInput
                        v-model="profileState.email"
                        type="email"
                        placeholder="your@email.com"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField label="Website" name="website" size="xl">
                      <UInput
                        v-model="profileState.website"
                        placeholder="https://yourwebsite.com"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField label="Location" name="location" size="xl">
                      <UInput
                        v-model="profileState.location"
                        placeholder="City, Country"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField label="Bio" name="bio" size="xl" class="md:col-span-2">
                      <UTextarea
                        v-model="profileState.bio"
                        placeholder="Tell us about yourself and your cooking style..."
                        :rows="4"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>
                  </UForm>
                </div>
              </div>
            </UCard>

            <!-- Quick Stats -->
            <UCard variant="outline" class="rounded-[12px]">
              <template #header>
                <h3 class="text-lg font-semibold">Profile Stats</h3>
              </template>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <p class="text-2xl font-bold text-primary">24</p>
                  <p class="text-sm text-[#666]">Recipes</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-blue-500">15.2K</p>
                  <p class="text-sm text-[#666]">Views</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-green-500">892</p>
                  <p class="text-sm text-[#666]">Likes</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-purple-500">156</p>
                  <p class="text-sm text-[#666]">Comments</p>
                </div>
              </div>
            </UCard>
          </div>
        </template>

        <!-- Social Tab -->
        <template #social="{ item }">
          <UCard variant="outline" class="rounded-[12px]">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon :name="item.icon" size="20" />
                <h2 class="text-lg font-semibold">Social Media Links</h2>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-instagram" size="20" class="text-pink-500" />
                  <UInput
                    v-model="socialLinks.instagram"
                    placeholder="Instagram username"
                    class="flex-1"
                    :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                  />
                </div>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-twitter" size="20" class="text-blue-400" />
                  <UInput
                    v-model="socialLinks.twitter"
                    placeholder="Twitter username"
                    class="flex-1"
                    :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                  />
                </div>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-facebook" size="20" class="text-blue-600" />
                  <UInput
                    v-model="socialLinks.facebook"
                    placeholder="Facebook profile URL"
                    class="flex-1"
                    :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                  />
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-youtube" size="20" class="text-red-600" />
                  <UInput
                    v-model="socialLinks.youtube"
                    placeholder="YouTube channel URL"
                    class="flex-1"
                    :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                  />
                </div>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-music" size="20" class="text-black" />
                  <UInput
                    v-model="socialLinks.tiktok"
                    placeholder="TikTok username"
                    class="flex-1"
                    :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                  />
                </div>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-linkedin" size="20" class="text-blue-700" />
                  <UInput
                    v-model="socialLinks.linkedin"
                    placeholder="LinkedIn profile URL"
                    class="flex-1"
                    :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- Notifications Tab -->
        <template #notifications="{ item }">
          <UCard variant="outline" class="rounded-[12px]">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon :name="item.icon" size="20" />
                <h2 class="text-lg font-semibold">Notification Preferences</h2>
              </div>
            </template>
            <div class="space-y-6">
              <!-- Email Notifications -->
              <div>
                <h3 class="font-medium mb-4">Email Notifications</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-mail" size="20" class="text-blue-500" />
                      <div>
                        <p class="font-medium">General Email Updates</p>
                        <p class="text-sm text-[#666]">
                          Receive important updates about your account
                        </p>
                      </div>
                    </div>
                    <UToggle v-model="notifications.email" size="lg" />
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-heart" size="20" class="text-red-500" />
                      <div>
                        <p class="font-medium">Likes on Your Recipes</p>
                        <p class="text-sm text-[#666]">
                          Get notified when someone likes your recipes
                        </p>
                      </div>
                    </div>
                    <UToggle v-model="notifications.likes" size="lg" />
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-message-circle" size="20" class="text-green-500" />
                      <div>
                        <p class="font-medium">New Comments</p>
                        <p class="text-sm text-[#666]">
                          Get notified when someone comments on your recipes
                        </p>
                      </div>
                    </div>
                    <UToggle v-model="notifications.comments" size="lg" />
                  </div>
                </div>
              </div>

              <!-- Social Notifications -->
              <div>
                <h3 class="font-medium mb-4">Social Notifications</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-user-plus" size="20" class="text-purple-500" />
                      <div>
                        <p class="font-medium">New Followers</p>
                        <p class="text-sm text-[#666]">Get notified when someone follows you</p>
                      </div>
                    </div>
                    <UToggle v-model="notifications.newFollowers" size="lg" />
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-at-sign" size="20" class="text-blue-500" />
                      <div>
                        <p class="font-medium">Recipe Mentions</p>
                        <p class="text-sm text-[#666]">
                          Get notified when someone mentions your recipes
                        </p>
                      </div>
                    </div>
                    <UToggle v-model="notifications.recipeMentions" size="lg" />
                  </div>
                </div>
              </div>

              <!-- Summary Notifications -->
              <div>
                <h3 class="font-medium mb-4">Summary Reports</h3>
                <div class="flex items-center justify-between p-4 rounded-lg border">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-bar-chart-3" size="20" class="text-orange-500" />
                    <div>
                      <p class="font-medium">Weekly Performance Summary</p>
                      <p class="text-sm text-[#666]">
                        Receive a weekly summary of your recipe performance
                      </p>
                    </div>
                  </div>
                  <UToggle v-model="notifications.weeklySummary" size="lg" />
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- Privacy Tab -->
        <template #privacy="{ item }">
          <UCard variant="outline" class="rounded-[12px]">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon :name="item.icon" size="20" />
                <h2 class="text-lg font-semibold">Privacy Settings</h2>
              </div>
            </template>
            <div class="space-y-6">
              <!-- Profile Visibility -->
              <div>
                <h3 class="font-medium mb-4">Profile Visibility</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-globe" size="20" class="text-green-500" />
                      <div>
                        <p class="font-medium">Public Profile</p>
                        <p class="text-sm text-[#666]">Make your profile visible to other users</p>
                      </div>
                    </div>
                    <UToggle v-model="privacy.publicProfile" size="lg" />
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-search" size="20" class="text-blue-500" />
                      <div>
                        <p class="font-medium">Search Engine Indexing</p>
                        <p class="text-sm text-[#666]">
                          Allow search engines to index your profile
                        </p>
                      </div>
                    </div>
                    <UToggle v-model="privacy.allowSearchIndexing" size="lg" />
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h3 class="font-medium mb-4">Contact Information</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-mail" size="20" class="text-red-500" />
                      <div>
                        <p class="font-medium">Show Email Address</p>
                        <p class="text-sm text-[#666]">
                          Display your email address on your profile
                        </p>
                      </div>
                    </div>
                    <UToggle v-model="privacy.showEmail" size="lg" />
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-lg border">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-message-square" size="20" class="text-purple-500" />
                      <div>
                        <p class="font-medium">Allow Messages</p>
                        <p class="text-sm text-[#666]">Allow other users to send you messages</p>
                      </div>
                    </div>
                    <UToggle v-model="privacy.allowMessages" size="lg" />
                  </div>
                </div>
              </div>

              <!-- Activity Settings -->
              <div>
                <h3 class="font-medium mb-4">Activity Settings</h3>
                <div class="flex items-center justify-between p-4 rounded-lg border">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-activity" size="20" class="text-orange-500" />
                    <div>
                      <p class="font-medium">Show Activity Status</p>
                      <p class="text-sm text-[#666]">
                        Display your recent activity on your profile
                      </p>
                    </div>
                  </div>
                  <UToggle v-model="privacy.showActivity" size="lg" />
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- Appearance Tab -->
        <template #appearance="{ item }">
          <UCard variant="outline" class="rounded-[12px]">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon :name="item.icon" size="20" />
                <h2 class="text-lg font-semibold">Appearance Settings</h2>
              </div>
            </template>
            <div class="space-y-6">
              <!-- Theme Settings -->
              <div>
                <h3 class="font-medium mb-4">Theme Preferences</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    :class="{
                      'ring-2 ring-primary': appearance.theme === 'light',
                    }"
                    @click="appearance.theme = 'light'"
                  >
                    <div class="text-center">
                      <UIcon name="i-lucide-sun" size="32" class="mx-auto mb-2 text-yellow-500" />
                      <p class="font-medium">Light</p>
                    </div>
                  </div>
                  <div
                    class="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    :class="{
                      'ring-2 ring-primary': appearance.theme === 'dark',
                    }"
                    @click="appearance.theme = 'dark'"
                  >
                    <div class="text-center">
                      <UIcon name="i-lucide-moon" size="32" class="mx-auto mb-2 text-blue-500" />
                      <p class="font-medium">Dark</p>
                    </div>
                  </div>
                  <div
                    class="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    :class="{
                      'ring-2 ring-primary': appearance.theme === 'system',
                    }"
                    @click="appearance.theme = 'system'"
                  >
                    <div class="text-center">
                      <UIcon name="i-lucide-monitor" size="32" class="mx-auto mb-2 text-gray-500" />
                      <p class="font-medium">System</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Regional Settings -->
              <div>
                <h3 class="font-medium mb-4">Regional Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UFormField label="Language" size="xl">
                    <USelect
                      v-model="appearance.language"
                      :items="[
                        { label: 'English', value: 'en' },
                        { label: 'ភាសាខ្មែរ', value: 'km' },
                        { label: 'Français', value: 'fr' },
                      ]"
                      placeholder="Select language"
                      class="w-full"
                      :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                    />
                  </UFormField>

                  <UFormField label="Timezone" size="xl">
                    <USelect
                      v-model="appearance.timezone"
                      :items="[
                        { label: 'Asia/Phnom_Penh', value: 'Asia/Phnom_Penh' },
                        { label: 'UTC', value: 'UTC' },
                        {
                          label: 'America/New_York',
                          value: 'America/New_York',
                        },
                      ]"
                      placeholder="Select timezone"
                      class="w-full"
                      :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                    />
                  </UFormField>

                  <UFormField label="Date Format" size="xl">
                    <USelect
                      v-model="appearance.dateFormat"
                      :items="[
                        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                      ]"
                      placeholder="Select date format"
                      class="w-full"
                      :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                    />
                  </UFormField>
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <!-- Account Tab -->
        <template #account="{ item }">
          <div class="space-y-6">
            <!-- Account Security -->
            <UCard variant="outline" class="rounded-[12px]">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon :name="item.icon" size="20" />
                  <h2 class="text-lg font-semibold">Account Security</h2>
                </div>
              </template>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 rounded-lg border">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-shield-check" size="20" class="text-green-500" />
                    <div>
                      <p class="font-medium">Two-Factor Authentication</p>
                      <p class="text-sm text-[#666]">Add an extra layer of security</p>
                    </div>
                  </div>
                  <UButton label="Enable" variant="outline" size="sm" />
                </div>
                <div class="flex items-center justify-between p-4 rounded-lg border">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-key" size="20" class="text-blue-500" />
                    <div>
                      <p class="font-medium">Change Password</p>
                      <p class="text-sm text-[#666]">Update your account password</p>
                    </div>
                  </div>
                  <UButton label="Change" variant="outline" size="sm" />
                </div>
              </div>
            </UCard>

            <!-- Connected Accounts -->
            <UCard variant="outline" class="rounded-[12px]">
              <template #header>
                <h3 class="text-lg font-semibold">Connected Accounts</h3>
              </template>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 rounded-lg border">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-google" size="20" class="text-red-500" />
                    <div>
                      <p class="font-medium">Google</p>
                      <p class="text-sm text-[#666]">Connected</p>
                    </div>
                  </div>
                  <UButton label="Disconnect" variant="outline" size="sm" color="error" />
                </div>
                <div class="flex items-center justify-between p-4 rounded-lg border">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-github" size="20" class="text-gray-800" />
                    <div>
                      <p class="font-medium">GitHub</p>
                      <p class="text-sm text-[#666]">Not connected</p>
                    </div>
                  </div>
                  <UButton label="Connect" variant="outline" size="sm" />
                </div>
              </div>
            </UCard>

            <!-- Danger Zone -->
            <UCard class="border-red-200">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-alert-triangle" size="20" class="text-red-600" />
                  <h2 class="text-lg font-semibold text-red-600">Danger Zone</h2>
                </div>
              </template>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p class="font-medium text-red-800">Delete Account</p>
                    <p class="text-sm text-red-600">
                      Permanently delete your account and all your data
                    </p>
                  </div>
                  <UButton
                    label="Delete Account"
                    color="error"
                    variant="outline"
                    @click="confirmDeleteAccount"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
