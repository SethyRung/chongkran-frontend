<script lang="ts" setup>
import type { Author } from '~/shared/types'

interface Props {
  author: Author
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const { followUser, unfollowUser, isLoading } = useFollow()
const { user } = useAuth()

// Computed properties
const currentUserId = computed(() => user.value?.id)

// Methods
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const handleFollowClick = async () => {
  if (!props.author || isLoading.value) return

  const originalValue = props.author.isFollowing || false

  // Optimistic update
  props.author.isFollowing = !originalValue
  if (props.author.followersCount !== undefined) {
    props.author.followersCount += originalValue ? -1 : 1
  }

  try {
    if (originalValue) {
      await unfollowUser(props.author.id)
    } else {
      await followUser(props.author.id)
    }
  } catch (error) {
    // Revert on error
    props.author.isFollowing = originalValue
    if (props.author.followersCount !== undefined) {
      props.author.followersCount += originalValue ? 1 : -1
    }
    console.error('Follow/unfollow failed:', error)
  }
}
</script>

<template>
  <div
    v-motion-slide-visible-once-bottom
    class="group bg-white/70 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden"
  >
    <!-- Author Header -->
    <div class="p-6">
      <div class="flex items-center gap-4 mb-4">
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <NuxtImg
            :src="author.avatar || '/images/default-avatar.png'"
            :alt="`${author.firstName} ${author.lastName}`"
            class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-if="author.role === 'author'"
            class="absolute -bottom-1 -right-1 bg-primary-500 text-white p-1 rounded-full"
          >
            <UIcon name="i-lucide-check" class="w-3 h-3" />
          </div>
        </div>

        <!-- Author Info -->
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {{ author.firstName }} {{ author.lastName }}
          </h3>
          <p v-if="author.expertise?.length" class="text-sm text-gray-600 truncate">
            {{ author.expertise.slice(0, 2).join(', ') }}
            <span v-if="author.expertise.length > 2">+{{ author.expertise.length - 2 }}</span>
          </p>
        </div>

        <!-- Follow Button -->
        <FollowButton
          v-if="!compact && author.id !== currentUserId"
          :author-id="author.id"
          :is-following="author.isFollowing"
          size="sm"
          variant="outline"
        />
      </div>

      <!-- Bio -->
      <p
        v-if="author.bio && !compact"
        class="text-sm text-gray-600 line-clamp-2 mb-4"
      >
        {{ author.bio }}
      </p>

      <!-- Stats -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex gap-4 text-sm">
          <div class="text-center">
            <div class="font-semibold text-gray-900">{{ formatNumber(author.followersCount || 0) }}</div>
            <div class="text-gray-600">Followers</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-900">{{ formatNumber(author.recipesCount || 0) }}</div>
            <div class="text-gray-600">Recipes</div>
          </div>
          <div v-if="!compact" class="text-center">
            <div class="font-semibold text-gray-900">{{ formatNumber(author.totalViews || 0) }}</div>
            <div class="text-gray-600">Views</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <UButton
          :to="`/authors/${author.id}`"
          variant="soft"
          color="primary"
          size="sm"
          block
          :label="compact ? 'View' : 'View Profile'"
        />
        <UButton
          v-if="compact && author.id !== currentUserId"
          :icon="author.isFollowing ? 'i-lucide-user-check' : 'i-lucide-user-plus'"
          variant="ghost"
          color="gray"
          size="sm"
          @click="handleFollowClick"
        />
      </div>
    </div>

    <!-- Expertise Tags -->
    <div v-if="author.expertise?.length && !compact" class="px-6 pb-4">
      <div class="flex flex-wrap gap-1">
        <UBadge
          v-for="skill in author.expertise.slice(0, 3)"
          :key="skill"
          :label="skill"
          variant="soft"
          color="gray"
          size="xs"
        />
        <UBadge
          v-if="author.expertise.length > 3"
          :label="`+${author.expertise.length - 3}`"
          variant="soft"
          color="gray"
          size="xs"
        />
      </div>
    </div>
  </div>
</template>