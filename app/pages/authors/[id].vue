<script lang="ts" setup>
import type { Author, Recipe } from '~/shared/types'

// Page setup
const route = useRoute()
const { $api } = useNuxtApp()
const { user } = useAuth()

// State
const author = ref<Author | null>(null)
const recipes = ref<Recipe[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('recipes')
const currentPage = ref(1)
const limit = ref(9)
const sortBy = ref('recent')
const totalRecipes = ref(0)

// Computed properties
const authorId = computed(() => route.params.id as string)
const currentUserId = computed(() => user.value?.id)

const totalPages = computed(() => Math.ceil(totalRecipes.value / limit.value))

const hasSocialLinks = computed(() => {
  return author.value?.website || author.value?.instagram ||
         author.value?.youtube || author.value?.tiktok
})

const authorStats = computed(() => {
  if (!author.value) return []

  return [
    { key: 'followersCount', label: 'Followers', value: author.value.followersCount || 0 },
    { key: 'recipesCount', label: 'Recipes', value: author.value.recipesCount || 0 },
    { key: 'totalViews', label: 'Views', value: author.value.totalViews || 0 },
    { key: 'totalLikes', label: 'Likes', value: author.value.totalLikes || 0 },
  ]
})

const tabs = computed(() => [
  { key: 'recipes', label: 'Recipes' },
  { key: 'about', label: 'About' },
])

const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Top Rated', value: 'rated' },
]

// Methods
const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

const fetchAuthor = async () => {
  try {
    isLoading.value = true
    const response = await $api(`/users/authors/${authorId.value}`)
    author.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch author'
  } finally {
    isLoading.value = false
  }
}

const fetchAuthorRecipes = async () => {
  try {
    const params: any = { page: currentPage.value, limit: limit.value }

    if (sortBy.value === 'popular') {
      params.sort = 'views'
      params.order = 'desc'
    } else if (sortBy.value === 'rated') {
      params.sort = 'likes'
      params.order = 'desc'
    } else {
      params.sort = 'createdAt'
      params.order = 'desc'
    }

    const response = await $api(`/recipes/author/${authorId.value}`, { params })
    recipes.value = response.data.content
    totalRecipes.value = response.data.total
  } catch (err: any) {
    console.error('Failed to fetch recipes:', err)
  }
}

// Watchers
watch([currentPage, sortBy], () => {
  fetchAuthorRecipes()
})

// Lifecycle
onMounted(() => {
  fetchAuthor()
  fetchAuthorRecipes()
})

// SEO
useSeoMeta({
  title: () => author.value ? `${author.value.firstName} ${author.value.lastName} - Recipes & Profile` : 'Author Profile',
  description: () => author.value?.bio || `Discover amazing recipes by ${author.value?.firstName} ${author.value?.lastName}`,
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="error"
      color="red"
      variant="subtle"
      class="max-w-2xl mx-auto mt-8"
      :description="error"
    />

    <!-- Author Profile -->
    <div v-else-if="author" class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <section
        v-motion-slide-visible-once-bottom
        class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-white/20"
      >
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Author Avatar -->
          <div class="flex-shrink-0">
            <div class="relative group">
              <NuxtImg
                :src="author.avatar || '/images/default-avatar.png'"
                :alt="`${author.firstName} ${author.lastName}`"
                class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg">
                <UIcon name="i-lucide-check" class="w-4 h-4" />
              </div>
            </div>
          </div>

          <!-- Author Info -->
          <div class="flex-1 space-y-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {{ author.firstName }} {{ author.lastName }}
                </h1>
                <p v-if="author.bio" class="text-gray-600 text-lg max-w-2xl">
                  {{ author.bio }}
                </p>
              </div>

              <!-- Follow Button -->
              <FollowButton
                v-if="author.id !== currentUserId"
                :author-id="author.id"
                :is-following="author.isFollowing"
                size="lg"
              />
            </div>

            <!-- Expertise Tags -->
            <div v-if="author.expertise?.length" class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in author.expertise"
                :key="skill"
                :label="skill"
                variant="soft"
                color="primary"
              />
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialLinks" class="flex gap-3">
              <UButton
                v-if="author.website"
                :to="author.website"
                target="_blank"
                variant="ghost"
                color="gray"
                size="sm"
                icon="i-lucide-globe"
              />
              <UButton
                v-if="author.instagram"
                :to="`https://instagram.com/${author.instagram}`"
                target="_blank"
                variant="ghost"
                color="gray"
                size="sm"
                icon="i-lucide-camera"
              />
              <UButton
                v-if="author.youtube"
                :to="`https://youtube.com/${author.youtube}`"
                target="_blank"
                variant="ghost"
                color="gray"
                size="sm"
                icon="i-lucide-play"
              />
              <UButton
                v-if="author.tiktok"
                :to="`https://tiktok.com/@${author.tiktok}`"
                target="_blank"
                variant="ghost"
                color="gray"
                size="sm"
                icon="i-lucide-music"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <section
        v-motion-slide-visible-once-bottom
        :delay="100"
        class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div
          v-for="stat in authorStats"
          :key="stat.label"
          class="bg-white/70 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:shadow-lg transition-shadow duration-300"
        >
          <div class="text-2xl md:text-3xl font-bold text-primary-600 mb-1">
            {{ formatNumber(stat.value) }}
          </div>
          <div class="text-sm text-gray-600">{{ stat.label }}</div>
        </div>
      </section>

      <!-- Tabs Section -->
      <section
        v-motion-slide-visible-once-bottom
        :delay="200"
        class="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
      >
        <UTabs v-model="activeTab" :items="tabs" class="p-6">
          <!-- Recipes Tab -->
          <template #recipes="{ item }">
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ item.label }} ({{ authorStats.find(s => s.key === 'recipesCount')?.value || 0 }})
                </h3>
                <USelectMenu
                  v-model="sortBy"
                  :options="sortOptions"
                  placeholder="Sort by"
                  size="sm"
                />
              </div>

              <!-- Recipe Grid -->
              <div v-if="recipes.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RecipeCard
                  v-for="recipe in recipes"
                  :key="recipe.id"
                  :recipe="recipe"
                />
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-12">
                <UIcon name="i-lucide-utensils" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p class="text-gray-500">No recipes found</p>
              </div>

              <!-- Pagination -->
              <UPagination
                v-if="totalPages > 1"
                v-model="currentPage"
                :page-count="limit"
                :total="totalRecipes"
                :max="7"
                class="justify-center"
              />
            </div>
          </template>

          <!-- About Tab -->
          <template #about>
            <div class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-900">About {{ author.firstName }}</h3>

              <div v-if="author.bio" class="prose max-w-none">
                <p class="text-gray-600 leading-relaxed">{{ author.bio }}</p>
              </div>

              <div v-if="author.expertise?.length" class="space-y-3">
                <h4 class="font-semibold text-gray-900">Expertise</h4>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="skill in author.expertise"
                    :key="skill"
                    :label="skill"
                    variant="soft"
                    color="primary"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3">Connect</h4>
                  <div class="space-y-2">
                    <UButton
                      v-if="author.website"
                      :to="author.website"
                      target="_blank"
                      variant="outline"
                      block
                      icon="i-lucide-globe"
                      label="Website"
                    />
                    <UButton
                      v-if="author.instagram"
                      :to="`https://instagram.com/${author.instagram}`"
                      target="_blank"
                      variant="outline"
                      block
                      icon="i-lucide-camera"
                      label="Instagram"
                    />
                  </div>
                </div>

                <div>
                  <h4 class="font-semibold text-gray-900 mb-3">Statistics</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Member since</span>
                      <span class="font-medium">{{ formatDate(author.createdAt) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Total recipes</span>
                      <span class="font-medium">{{ author.recipesCount || 0 }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Total views</span>
                      <span class="font-medium">{{ formatNumber(author.totalViews || 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </section>
    </div>
  </div>
</template>