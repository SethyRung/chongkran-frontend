<script lang="ts" setup>
import { useFollow } from "~/composables/useFollow";

interface Props {
  authorId: string;
  isFollowing?: boolean;
  variant?: "solid" | "outline" | "soft" | "subtle" | "ghost";
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
  isFollowing: false,
  variant: "solid",
  size: "sm",
});

const { followUser, unfollowUser, isLoading } = useFollow();

const isFollowing = ref(props.isFollowing);

// Optimistic update function
const handleFollowClick = async () => {
  const originalValue = isFollowing.value;

  // Optimistic update
  isFollowing.value = !originalValue;

  try {
    if (originalValue) {
      await unfollowUser(props.authorId);
    } else {
      await followUser(props.authorId);
    }
  } catch (error) {
    // Revert on error
    isFollowing.value = originalValue;
    console.error("Follow/unfollow failed:", error);
  }
};

// Watch for prop changes (in case parent component updates)
watch(
  () => props.isFollowing,
  (newValue) => {
    isFollowing.value = newValue;
  },
);
</script>

<template>
  <UButton
    :icon="isFollowing ? 'i-lucide-user-check' : 'i-lucide-user-plus'"
    :label="isFollowing ? 'Following' : 'Follow'"
    :variant="variant"
    :size="size"
    :color="isFollowing ? 'primary' : 'gray'"
    :loading="isLoading"
    :class="[
      'transition-all duration-200',
      isFollowing ? 'bg-primary-500 text-white hover:bg-primary-600' : 'hover:bg-gray-100',
    ]"
    @click="handleFollowClick"
  />
</template>
