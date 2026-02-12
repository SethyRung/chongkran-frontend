<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { useAuthor } from "~/composables/useAuthor";

definePageMeta({
  middleware: ["author"],
  layout: "author",
});

const { getMyRecipes, deleteRecipe, isLoading } = useAuthor();
const toast = useToast();

const searchQuery = ref("");
const statusFilter = ref("all");
const sortBy = ref("createdAt");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showAdvancedFilters = ref(false);
const categoryFilter = ref([]);
const difficultyFilter = ref([]);
const dateFrom = ref("");
const dateTo = ref("");

const stats = reactive({
  total: 24,
  published: 18,
  drafts: 6,
  totalViews: 15234,
});

const recipes = reactive([
  {
    id: 1,
    title: "Classic Beef Burger",
    description:
      "A juicy beef burger with all the classic fixings - lettuce, tomato, onion, and a special sauce that brings it all together.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "Lunch",
    difficulty: "Medium",
    status: "published",
    views: 1243,
    likes: 89,
    comments: 12,
    createdAt: "2024-01-15",
    publishedAt: "2024-01-16",
  },
  {
    id: 2,
    title: "Vegetarian Pasta",
    description:
      "A delicious and healthy vegetarian pasta dish packed with fresh vegetables and herbs.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    category: "Dinner",
    difficulty: "Easy",
    status: "published",
    views: 892,
    likes: 67,
    comments: 8,
    createdAt: "2024-01-10",
    publishedAt: "2024-01-12",
  },
  {
    id: 3,
    title: "Chocolate Cake",
    description:
      "Rich and moist chocolate cake with a velvety chocolate frosting that's perfect for any celebration.",
    image: "https://placehold.co/400x300/8B4513/FFFFFF?text=Chocolate+Cake",
    category: "Dessert",
    difficulty: "Medium",
    status: "draft",
    views: 567,
    likes: 45,
    comments: 3,
    createdAt: "2024-01-20",
    publishedAt: null,
  },
]);

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];

const categoryOptions = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Dessert", value: "Dessert" },
  { label: "Snack", value: "Snack" },
  { label: "Beverage", value: "Beverage" },
];

const difficultyOptions = [
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

const sortOptions = [
  { label: "Newest", value: "createdAt" },
  { label: "Oldest", value: "createdAt_asc" },
  { label: "Most Views", value: "views" },
  { label: "Most Likes", value: "likes" },
];

const columns = [
  {
    id: "name",
    key: "name",
    label: "Recipe",
    sortable: true,
  },
  {
    id: "category",
    key: "category",
    label: "Category",
    sortable: true,
  },
  {
    id: "difficulty",
    key: "difficulty",
    label: "Difficulty",
    sortable: true,
  },
  {
    id: "status",
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    id: "metrics",
    key: "metrics",
    label: "Metrics",
  },
  {
    id: "createdAt",
    key: "createdAt",
    label: "Created",
    sortable: true,
  },
  {
    id: "actions",
    key: "actions",
    label: "Actions",
  },
];

const filteredRecipes = computed(() => {
  let filtered = recipes;

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  // Status filter
  if (statusFilter.value !== "all") {
    filtered = filtered.filter((recipe) => recipe.status === statusFilter.value);
  }

  // Category filter
  if (categoryFilter.value.length > 0) {
    filtered = filtered.filter((recipe) => categoryFilter.value.includes(recipe.category));
  }

  // Difficulty filter
  if (difficultyFilter.value.length > 0) {
    filtered = filtered.filter((recipe) => difficultyFilter.value.includes(recipe.difficulty));
  }

  // Date range filter
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    filtered = filtered.filter((recipe) => new Date(recipe.createdAt) >= fromDate);
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter((recipe) => new Date(recipe.createdAt) <= toDate);
  }

  // Sort recipes
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "createdAt_asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "views":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredRecipes.value.length / itemsPerPage.value));

function getRecipeActions(recipe: any): DropdownMenuItem[][] {
  return [
    [
      {
        icon: "i-lucide-edit",
        label: "Edit Recipe",
        to: `/author/edit/${recipe.id}`,
      },
      {
        icon: "i-lucide-eye",
        label: "View Recipe",
        to: `/recipes/${recipe.id}`,
      },
    ],
    [
      {
        icon: "i-lucide-trash-2",
        label: "Delete Recipe",
        color: "error",
        onSelect: () => confirmDelete(recipe),
      },
    ],
  ];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function confirmDelete(recipe: any) {
  if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
    try {
      await deleteRecipe(recipe.id);
      // Remove from local array for demo
      const index = recipes.findIndex((r: any) => r.id === recipe.id);
      if (index > -1) {
        recipes.splice(index, 1);
      }
      toast.add({
        title: "Success",
        description: "Recipe deleted successfully",
        color: "success",
      });
    } catch (error) {
      // Error is handled by the composable
    }
  }
}

function handlePaginationUpdate(pagination: any) {
  currentPage.value = pagination.page;
  itemsPerPage.value = pagination.itemsPerPage;
}

function exportRecipes() {
  const exportData = filteredRecipes.value.map((recipe) => ({
    Title: recipe.title,
    Category: recipe.category,
    Difficulty: recipe.difficulty,
    Status: recipe.status,
    Views: recipe.views,
    Likes: recipe.likes,
    Comments: recipe.comments,
    "Created At": recipe.createdAt,
    "Published At": recipe.publishedAt || "Not published",
  }));

  const csvContent = [
    Object.keys(exportData[0]).join(","),
    ...exportData.map((row) => Object.values(row).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `recipes_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Load recipes on component mount
onMounted(async () => {
  try {
    const response = await getMyRecipes();
    // Update recipes with actual data
    // Object.assign(recipes, response.data.recipes);
  } catch (error) {
    // Error is handled by the composable
  }
});
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            My Recipes
          </h1>
          <p class="text-base sm:text-lg text-gray-600">Manage all your recipes in one place</p>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <UButton
            icon="i-lucide-plus"
            label="Create New Recipe"
            size="lg"
            class="rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            to="/author/create"
          />
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div
          class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-gray-900">
              {{ stats.total }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600">Total Recipes</p>
          </div>
        </div>
        <div
          class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-green-600">
              {{ stats.published }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600">Published</p>
          </div>
        </div>
        <div
          class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-yellow-600">
              {{ stats.drafts }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600">Drafts</p>
          </div>
        </div>
        <div
          class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-blue-600">
              {{ Math.round(stats.totalViews / stats.total || 0) }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600">Avg Views</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div
        class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <UInput
            v-model="searchQuery"
            placeholder="Search recipes..."
            icon="i-lucide-search"
            class="flex-1"
            :ui="{ base: 'rounded-xl ring-gray-200' }"
          />
          <USelect
            v-model="statusFilter"
            :items="statusOptions"
            placeholder="Filter by status"
            class="sm:w-48"
            :ui="{ base: 'rounded-xl ring-gray-200' }"
          />
          <USelect
            v-model="sortBy"
            :items="sortOptions"
            placeholder="Sort by"
            class="sm:w-48"
            :ui="{ base: 'rounded-xl ring-gray-200' }"
          />
        </div>
      </div>

      <!-- Recipes Table -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Recipes ({{ filteredRecipes.length }})</h3>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-download"
                label="Export"
                variant="outline"
                size="sm"
                @click="exportRecipes"
              />
              <UButton
                icon="i-lucide-filter"
                label="Filter"
                variant="outline"
                size="sm"
                @click="showAdvancedFilters = !showAdvancedFilters"
              />
            </div>
          </div>
        </template>

        <!-- Advanced Filters (Collapsible) -->
        <div v-if="showAdvancedFilters" class="mb-4 p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Category">
              <USelect
                v-model="categoryFilter"
                :items="categoryOptions"
                placeholder="All categories"
                multiple
                clearable
                :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
              />
            </UFormField>
            <UFormField label="Difficulty">
              <USelect
                v-model="difficultyFilter"
                :items="difficultyOptions"
                placeholder="All difficulties"
                multiple
                clearable
                :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
              />
            </UFormField>
            <UFormField label="Date Range">
              <div class="flex gap-2">
                <UInput
                  v-model="dateFrom"
                  type="date"
                  placeholder="From"
                  :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                />
                <UInput
                  v-model="dateTo"
                  type="date"
                  placeholder="To"
                  :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                />
              </div>
            </UFormField>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredRecipes.length === 0" class="text-center py-12">
          <UIcon name="i-lucide-inbox" size="48" class="mx-auto mb-4 text-[#666]" />
          <p class="text-[#666]">No recipes found</p>
          <UButton
            label="Create your first recipe"
            variant="outline"
            class="mt-4 h-12"
            to="/author/create"
          />
        </div>

        <!-- Mobile Card View -->
        <div v-if="filteredRecipes.length > 0" class="lg:hidden space-y-4">
          <div
            v-for="recipe in filteredRecipes.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage,
            )"
            :key="recipe.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start gap-4">
              <NuxtImg
                :src="recipe.image"
                :alt="recipe.title"
                class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-lg mb-1 truncate">
                  {{ recipe.title }}
                </h3>
                <div class="flex items-center gap-4 text-sm text-[#666] mb-2">
                  <span>{{ recipe.category }}</span>
                  <span>•</span>
                  <span>{{ recipe.difficulty }}</span>
                </div>
                <div class="flex items-center gap-3 mb-3">
                  <UBadge
                    :color="recipe.status === 'published' ? 'success' : 'warning'"
                    variant="soft"
                    size="sm"
                  >
                    {{ recipe.status }}
                  </UBadge>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-eye" size="14" />
                    {{ recipe.views }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-heart" size="14" />
                    {{ recipe.likes }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-message-circle" size="14" />
                    {{ recipe.comments }}
                  </span>
                </div>
                <div class="flex items-center justify-between mt-4">
                  <div class="text-xs text-[#666]">
                    {{ formatDate(recipe.createdAt) }}
                  </div>
                  <div class="flex items-center gap-2">
                    <UButton
                      icon="i-lucide-edit"
                      variant="ghost"
                      size="sm"
                      :to="`/author/edit/${recipe.id}`"
                      class="h-8 w-8"
                    />
                    <UButton
                      icon="i-lucide-eye"
                      variant="ghost"
                      size="sm"
                      :to="`/recipes/${recipe.id}`"
                      class="h-8 w-8"
                    />
                    <UDropdownMenu :items="getRecipeActions(recipe)" :content="{ align: 'end' }">
                      <UButton
                        icon="i-lucide-more-vertical"
                        variant="ghost"
                        size="sm"
                        color="neutral"
                        class="h-8 w-8"
                      />
                    </UDropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Pagination -->
          <div class="flex items-center justify-between px-4 py-3 bg-white border-t rounded-lg">
            <div class="text-sm text-[#666]">
              Showing
              {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredRecipes.length) }}
              to
              {{ Math.min(currentPage * itemsPerPage, filteredRecipes.length) }}
              of {{ filteredRecipes.length }} recipes
            </div>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-chevron-left"
                variant="ghost"
                size="sm"
                :disabled="currentPage === 1"
                class="h-8 w-8"
                @click="currentPage--"
              />
              <span class="text-sm text-[#666]">{{ currentPage }} of {{ totalPages }}</span>
              <UButton
                icon="i-lucide-chevron-right"
                variant="ghost"
                size="sm"
                :disabled="currentPage === totalPages"
                class="h-8 w-8"
                @click="currentPage++"
              />
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div v-if="filteredRecipes.length > 0" class="hidden lg:block overflow-x-auto">
          <UTable
            :data="filteredRecipes"
            :columns="columns"
            :pagination="{
              page: currentPage,
              itemsPerPage: itemsPerPage,
              total: filteredRecipes.length,
            }"
            :loading="isLoading"
            :selection="{ multiple: true }"
            :ui="{
              table: 'divide-y divide-gray-200',
              thead: 'bg-gray-50',
              th: 'text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              td: 'whitespace-nowrap text-sm text-gray-900',
              pagination: 'flex items-center justify-between px-4 py-3 bg-white border-t',
            }"
            @update:pagination="handlePaginationUpdate"
          >
            <template #name-data="{ row }">
              <div class="flex items-center gap-3">
                <NuxtImg
                  :src="row.image"
                  :alt="row.title"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <div class="font-medium">{{ row.title }}</div>
                  <div class="text-xs text-gray-500">{{ row.category }}</div>
                </div>
              </div>
            </template>

            <template #status-data="{ row }">
              <UBadge
                :color="row.status === 'published' ? 'success' : 'warning'"
                variant="soft"
                size="sm"
              >
                {{ row.status }}
              </UBadge>
            </template>

            <template #metrics-data="{ row }">
              <div class="flex items-center gap-4 text-sm">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-eye" size="14" />
                  {{ row.views }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-heart" size="14" />
                  {{ row.likes }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-message-circle" size="14" />
                  {{ row.comments }}
                </span>
              </div>
            </template>

            <template #actions-data="{ row }">
              <div class="flex items-center gap-2">
                <UButton
                  icon="i-lucide-edit"
                  variant="ghost"
                  size="sm"
                  :to="`/author/edit/${row.id}`"
                  class="h-8 w-8"
                />
                <UButton
                  icon="i-lucide-eye"
                  variant="ghost"
                  size="sm"
                  :to="`/recipes/${row.id}`"
                  class="h-8 w-8"
                />
                <UDropdownMenu :items="getRecipeActions(row)" :content="{ align: 'end' }">
                  <UButton
                    icon="i-lucide-more-vertical"
                    variant="ghost"
                    size="sm"
                    color="neutral"
                    class="h-8 w-8"
                  />
                </UDropdownMenu>
              </div>
            </template>
          </UTable>
        </div>
      </UCard>
    </div>
  </div>
</template>
