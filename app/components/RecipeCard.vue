<script lang="ts" setup>
import type { Recipe, Author } from "~/shared/types";

type Props = {
  recipe: Recipe & {
    author?: Author;
    isLiked?: boolean;
  };
};

const props = defineProps<Props>();

// Computed properties
const author = computed(() => props.recipe.author);
const currentUserId = computed(() => {
  // Get current user ID from auth state
  // This would come from your auth store/composable
  return null; // Replace with actual user ID
});

const difficultyColor = computed(() => {
  const colors = {
    easy: "green",
    medium: "yellow",
    hard: "red",
  };
  return colors[props.recipe.difficulty] || "gray";
});

// Methods
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};
</script>

<template>
  <div
    v-motion-slide-visible-once-bottom
    class="group relative w-full p-6 flex flex-col gap-4 justify-between bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
  >
    <!-- Recipe Image -->
    <div class="relative overflow-hidden rounded-lg">
      <NuxtImg
        :src="recipe.image"
        class="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
        :alt="recipe.title"
      />

      <!-- Overlay badges -->
      <div class="absolute top-3 left-3 flex gap-2">
        <UBadge :label="recipe.category" variant="soft" color="primary" size="sm" />
        <UBadge :label="recipe.difficulty" variant="soft" :color="difficultyColor" size="sm" />
      </div>

      <!-- Stats overlay -->
      <div class="absolute top-3 right-3 flex gap-2">
        <div class="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
          <Icon name="i-lucide-eye" class="w-3 h-3" />
          {{ formatNumber(recipe.views) }}
        </div>
        <div class="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
          <Icon name="i-lucide-heart" class="w-3 h-3" />
          {{ formatNumber(recipe.likes) }}
        </div>
      </div>
    </div>

    <!-- Recipe Content -->
    <div class="space-y-3">
      <h3 class="text-xl font-bold text-gray-900 line-clamp-2">
        {{ recipe.title }}
      </h3>

      <p v-if="recipe.description" class="text-gray-600 text-sm line-clamp-2">
        {{ recipe.description }}
      </p>

      <!-- Author Section -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <NuxtImg
            :src="author?.avatar || '/images/default-avatar.png'"
            :alt="author?.firstName"
            class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div class="flex flex-col">
            <span class="font-semibold text-sm text-gray-900">
              {{ author?.firstName }} {{ author?.lastName }}
            </span>
            <span class="text-xs text-gray-500">
              {{ recipe.cookTime }} min • {{ recipe.difficulty }}
            </span>
          </div>
        </div>

        <!-- Follow button -->
        <FollowButton
          v-if="author && author.id !== currentUserId"
          :author-id="author.id"
          :is-following="author.isFollowing"
          size="sm"
          variant="outline"
        />
      </div>

      <!-- Tags -->
      <div v-if="recipe.tags?.length" class="flex flex-wrap gap-1">
        <UBadge
          v-for="tag in recipe.tags.slice(0, 3)"
          :key="tag"
          :label="tag"
          variant="soft"
          color="gray"
          size="xs"
        />
        <UBadge
          v-if="recipe.tags.length > 3"
          :label="`+${recipe.tags.length - 3}`"
          variant="soft"
          color="gray"
          size="xs"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <UButton
        icon="i-lucide-book-open"
        label="View Recipe"
        block
        :to="`recipes/${recipe.id}`"
        variant="soft"
        color="primary"
      />
      <UButton
        icon="i-lucide-heart"
        variant="subtle"
        color="red"
        :class="{ 'text-red-500': recipe.isLiked }"
      />
    </div>
  </div>
</template>
