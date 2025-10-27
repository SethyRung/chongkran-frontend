<script lang="ts" setup>
import type { Author } from "#shared/types";

const { getAuthors, getPopularAuthors, searchAuthors } = useAuthor();

const authors = ref<Author[]>([]);
const popularAuthors = ref<Author[]>([]);
const isLoading = ref(false);
const isSearching = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const selectedExpertise = ref("");
const sortBy = ref("followers");
const currentPage = ref(1);
const limit = ref(12);
const totalAuthors = ref(0);

const debouncedSearch = useDebounceFn(async () => {
  if (!searchQuery.value.trim()) {
    authors.value = [];
    totalAuthors.value = 0;
    return;
  }

  isSearching.value = true;
  try {
    const results = await searchAuthors(searchQuery.value.trim(), 50);
    authors.value = results;
    totalAuthors.value = results.length;
  } catch (err: any) {
    error.value = err.message || "Failed to search authors";
  } finally {
    isSearching.value = false;
  }
}, 300);

const expertiseOptions = [
  "Italian",
  "Asian",
  "Mexican",
  "French",
  "Indian",
  "Japanese",
  "Thai",
  "Mediterranean",
  "Vegan",
  "Desserts",
  "BBQ",
  "Baking",
];

const sortOptions = [
  { label: "Most Followers", value: "followers" },
  { label: "Most Recipes", value: "recipes" },
  { label: "Newest", value: "newest" },
  { label: "Most Views", value: "views" },
];

const totalPages = computed(() => Math.ceil(totalAuthors.value / limit.value));

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedExpertise.value;
});

const getExpertiseIcon = (expertise: string) => {
  const icons: Record<string, string> = {
    Italian: "i-lucide-pizza",
    Asian: "i-lucide-bowl",
    Mexican: "i-lucide-pepper",
    French: "i-lucide-wine",
    Indian: "i-lucide-spice",
    Japanese: "i-lucide-chopsticks",
    Thai: "i-lucide-utensils",
    Mediterranean: "i-lucide-fish",
    Vegan: "i-lucide-leaf",
    Desserts: "i-lucide-cake",
    BBQ: "i-lucide-flame",
    Baking: "i-lucide-bread",
  };
  return icons[expertise] || "i-lucide-utensils";
};

const fetchAuthors = async () => {
  if (!searchQuery.value && !selectedExpertise.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const params = {
      page: currentPage.value,
      limit: limit.value,
      search: searchQuery.value || undefined,
      expertise: selectedExpertise.value || undefined,
    };

    const response = await getAuthors(
      params.page,
      params.limit,
      params.search,
      params.expertise
    );

    authors.value = response.content;
    totalAuthors.value = response.total;
  } catch (err: any) {
    error.value = err.message || "Failed to fetch authors";
  } finally {
    isLoading.value = false;
  }
};

const fetchPopularAuthors = async () => {
  try {
    const results = await getPopularAuthors(8);
    popularAuthors.value = results;
  } catch (err: any) {
    console.error("Failed to fetch popular authors:", err);
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  debouncedSearch();
};

const handlePageChange = () => {
  fetchAuthors();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
  fetchAuthors();
};

const clearAllFilters = () => {
  searchQuery.value = "";
  selectedExpertise.value = "";
  currentPage.value = 1;
  authors.value = [];
  totalAuthors.value = 0;
};

watch([selectedExpertise, currentPage, sortBy], () => {
  if (selectedExpertise.value || currentPage.value > 1) {
    fetchAuthors();
  }
});

onMounted(() => {
  fetchPopularAuthors();
});

useSeoMeta({
  title: "Discover Recipe Authors - Find Your Favorite Creators",
  description:
    "Explore talented recipe authors, discover new cuisines, and follow your favorite creators to get daily inspiration.",
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50"
  >
    <div class="container mx-auto px-4 py-8">
      <header v-motion-slide-visible-once-bottom class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Amazing Authors
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore talented recipe creators and follow your favorites to get
          inspired
        </p>
      </header>

      <section
        v-motion-slide-visible-once-bottom
        :delay="100"
        class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/20"
      >
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              placeholder="Search authors by name, bio, or expertise..."
              icon="i-lucide-search"
              size="lg"
              :loading="isSearching"
              @input="handleSearch"
            />
          </div>

          <div class="lg:w-64">
            <USelectMenu
              v-model="selectedExpertise"
              :options="expertiseOptions"
              placeholder="Filter by expertise"
              size="lg"
              clearable
            />
          </div>

          <div class="lg:w-48">
            <USelectMenu
              v-model="sortBy"
              :options="sortOptions"
              placeholder="Sort by"
              size="lg"
            />
          </div>
        </div>

        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-4">
          <UBadge
            v-if="searchQuery"
            :label="`Search: ${searchQuery}`"
            color="primary"
            variant="soft"
            class="cursor-pointer"
            @click="clearSearch"
          />
          <UBadge
            v-if="selectedExpertise"
            :label="`Expertise: ${selectedExpertise}`"
            color="primary"
            variant="soft"
            class="cursor-pointer"
            @click="selectedExpertise = ''"
          />
          <UBadge
            label="Clear all"
            color="neutral"
            variant="soft"
            class="cursor-pointer"
            @click="clearAllFilters"
          />
        </div>
      </section>

      <section
        v-if="!searchQuery && !selectedExpertise"
        v-motion-slide-visible-once-bottom
        :delay="200"
        class="mb-12"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Popular Authors</h2>
          <UButton
            to="/authors/popular"
            variant="ghost"
            color="primary"
            trailing-icon="i-lucide-arrow-right"
          >
            View All
          </UButton>
        </div>

        <div
          v-if="popularAuthors.length"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AuthorCard
            v-for="author in popularAuthors"
            :key="author.id"
            :author="author"
            compact
          />
        </div>

        <div v-else class="text-center py-8">
          <UIcon
            name="i-lucide-users"
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <p class="text-gray-500">No popular authors found</p>
        </div>
      </section>

      <section v-motion-slide-visible-once-bottom :delay="300">
        <div
          v-if="searchQuery || selectedExpertise"
          class="flex items-center justify-between mb-6"
        >
          <h2 class="text-2xl font-bold text-gray-900">
            Search Results
            <span
              v-if="totalAuthors > 0"
              class="text-lg font-normal text-gray-600 ml-2"
            >
              ({{ totalAuthors }} found)
            </span>
          </h2>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <UIcon
            name="i-lucide-loader-2"
            class="w-8 h-8 animate-spin text-primary-500"
          />
        </div>

        <UAlert
          v-else-if="error"
          color="error"
          variant="subtle"
          :description="error"
          class="mb-6"
        />

        <div
          v-else-if="authors.length"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AuthorCard
            v-for="author in authors"
            :key="author.id"
            :author="author"
          />
        </div>

        <div v-else class="text-center py-16">
          <UIcon
            name="i-lucide-search-x"
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            No authors found
          </h3>
          <p class="text-gray-600 mb-6">
            Try adjusting your search or filters to find more authors.
          </p>
          <UButton
            variant="outline"
            label="Clear filters"
            @click="clearAllFilters"
          />
        </div>

        <UPagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :page-count="limit"
          :total="totalAuthors"
          :max="7"
          class="justify-center mt-8"
          @update:model-value="handlePageChange"
        />
      </section>

      <section
        v-if="!searchQuery && !selectedExpertise"
        v-motion-slide-visible-once-bottom
        :delay="400"
        class="mt-16"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Browse by Expertise
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <UButton
            v-for="expertise in expertiseOptions"
            :key="expertise"
            :label="expertise"
            variant="outline"
            size="lg"
            class="h-20 flex flex-col items-center justify-center gap-2"
            @click="selectedExpertise = expertise"
          >
            <template #trailing>
              <UIcon :name="getExpertiseIcon(expertise)" class="w-5 h-5" />
            </template>
          </UButton>
        </div>
      </section>
    </div>
  </div>
</template>
