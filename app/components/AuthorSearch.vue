<script lang="ts" setup>
import type { Author } from "~/shared/types";

interface Props {
  placeholder?: string;
  icon?: string;
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
  showFollowButton?: boolean;
  maxResults?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search authors...",
  icon: "i-lucide-search",
  size: "md",
  showFollowButton: true,
  maxResults: 5,
});

const emit = defineEmits<{
  select: [author: Author];
}>();

// Composables
const { searchAuthors } = useAuthor();
const { user } = useAuth();

// State
const searchQuery = ref("");
const searchResults = ref<Author[]>([]);
const isLoading = ref(false);
const showResults = ref(false);

// Computed properties
const currentUserId = computed(() => user.value?.id);

// Debounced search
const debouncedSearch = useDebounceFn(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;
  try {
    const results = await searchAuthors(searchQuery.value.trim(), props.maxResults);
    searchResults.value = results;
  } catch (error) {
    console.error("Search failed:", error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
}, 300);

// Methods
const handleSearch = () => {
  debouncedSearch();
};

const handleBlur = () => {
  // Delay hiding results to allow clicking on results
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const selectAuthor = (author: Author) => {
  emit("select", author);
  showResults.value = false;
  searchQuery.value = "";
};

// Watch for external changes to search query
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== searchQuery.value) {
      searchQuery.value = newValue || "";
    }
  },
);
</script>

<template>
  <div class="relative">
    <!-- Search Input -->
    <UInput
      v-model="searchQuery"
      :placeholder="placeholder"
      :icon="icon"
      :size="size"
      :loading="isLoading"
      class="w-full"
      @input="handleSearch"
      @focus="showResults = true"
      @blur="handleBlur"
    />

    <!-- Search Results Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showResults && (searchResults.length || searchQuery)"
        class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
      >
        <!-- Loading State -->
        <div v-if="isLoading" class="p-4 text-center">
          <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-primary-500 mx-auto" />
          <p class="text-sm text-gray-600 mt-2">Searching authors...</p>
        </div>

        <!-- Results -->
        <div v-else-if="searchResults.length" class="py-2">
          <div
            v-for="author in searchResults"
            :key="author.id"
            class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
            @click="selectAuthor(author)"
          >
            <!-- Author Avatar -->
            <NuxtImg
              :src="author.avatar || '/images/default-avatar.png'"
              :alt="`${author.firstName} ${author.lastName}`"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />

            <!-- Author Info -->
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate">
                {{ author.firstName }} {{ author.lastName }}
              </div>
              <div class="text-sm text-gray-600 truncate">
                {{ author.followersCount }} followers
                <span v-if="author.expertise?.length">
                  • {{ author.expertise.slice(0, 2).join(", ") }}
                  <span v-if="author.expertise.length > 2">+{{ author.expertise.length - 2 }}</span>
                </span>
              </div>
            </div>

            <!-- Follow Button -->
            <FollowButton
              v-if="showFollowButton && author.id !== currentUserId"
              :author-id="author.id"
              :is-following="author.isFollowing"
              size="xs"
              variant="outline"
            />
          </div>

          <!-- View All Results -->
          <div
            v-if="searchQuery && searchResults.length >= 5"
            class="px-4 py-3 border-t border-gray-100"
          >
            <UButton
              :to="`/authors?search=${encodeURIComponent(searchQuery)}`"
              variant="ghost"
              color="primary"
              size="sm"
              block
              trailing-icon="i-lucide-arrow-right"
            >
              View all results for "{{ searchQuery }}"
            </UButton>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery && !isLoading" class="p-4 text-center">
          <UIcon name="i-lucide-search-x" class="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p class="text-sm text-gray-600">No authors found for "{{ searchQuery }}"</p>
        </div>
      </div>
    </Transition>

    <!-- Overlay to close dropdown when clicking outside -->
    <div v-if="showResults" class="fixed inset-0 z-40" @click="showResults = false" />
  </div>
</template>
