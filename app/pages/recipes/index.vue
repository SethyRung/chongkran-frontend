<script lang="ts" setup>
const route = useRoute();
const router = useRouter();

const searchQuery = ref((route.query.search as string) || "");
const selectedCategory = ref((route.query.category as string) || "");
const selectedDifficulty = ref((route.query.difficulty as string) || "");
const currentPage = ref(Number(route.query.page) || 1);

const categories = ref<Category[]>([
  { id: "all", name: "All Categories", createdAt: "", updatedAt: "" },
  { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
  { id: "c2", name: "Asian", createdAt: "", updatedAt: "" },
  { id: "c3", name: "American", createdAt: "", updatedAt: "" },
  { id: "c4", name: "Indian", createdAt: "", updatedAt: "" },
  { id: "c5", name: "Desserts", createdAt: "", updatedAt: "" },
]);

const difficultyOptions = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const allRecipes = ref<Recipe[]>([
  {
    id: "1",
    title: "Classic Spaghetti Carbonara",
    description: "A traditional Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    ingredients: [],
    steps: [],
    author: {
      id: "a1",
      firstName: "Marco",
      lastName: "Rossi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    },
    tags: ["Italian", "Pasta"],
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600",
    cookTime: 30,
    likes: 3,
    views: 1250,
    difficulty: "medium",
    status: "approved",
    category: { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Khmer Green Curry",
    description: "Aromatic and creamy Khmer curry with vegetables and your choice of protein.",
    ingredients: [],
    steps: [],
    author: {
      id: "a2",
      firstName: "Suki",
      lastName: "Tanaka",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suki",
    },
    tags: ["Khmer", "Curry"],
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600",
    cookTime: 45,
    likes: 2,
    views: 890,
    difficulty: "medium",
    status: "approved",
    category: { id: "c2", name: "Asian", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Classic Beef Burger",
    description: "Juicy homemade beef burger with all the classic toppings.",
    ingredients: [],
    steps: [],
    author: {
      id: "a3",
      firstName: "John",
      lastName: "Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    tags: ["American", "Grill"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    cookTime: 25,
    likes: 4,
    views: 2100,
    difficulty: "easy",
    status: "approved",
    category: { id: "c3", name: "American", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Chicken Tikka Masala",
    description: "Creamy tomato-based curry with tender pieces of marinated chicken.",
    ingredients: [],
    steps: [],
    author: {
      id: "a4",
      firstName: "Priya",
      lastName: "Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
    tags: ["Indian", "Curry"],
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    cookTime: 60,
    likes: 6,
    views: 3200,
    difficulty: "hard",
    status: "approved",
    category: { id: "c4", name: "Indian", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: "5",
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a molten center that oozes when cut.",
    ingredients: [],
    steps: [],
    author: {
      id: "a1",
      firstName: "Marco",
      lastName: "Rossi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    },
    tags: ["Dessert", "Chocolate"],
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600",
    cookTime: 20,
    likes: 2,
    views: 1500,
    difficulty: "medium",
    status: "approved",
    category: { id: "c5", name: "Desserts", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
  {
    id: "6",
    title: "Pad Khmer",
    description: "Classic Khmer stir-fried rice noodles with shrimp, tofu, and peanuts.",
    ingredients: [],
    steps: [],
    author: {
      id: "a2",
      firstName: "Suki",
      lastName: "Tanaka",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suki",
    },
    tags: ["Khmer", "Noodles"],
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600",
    cookTime: 35,
    likes: 3,
    views: 1800,
    difficulty: "medium",
    status: "approved",
    category: { id: "c2", name: "Asian", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
]);

const filteredRecipes = computed(() => {
  let recipes = [...allRecipes.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    recipes = recipes.filter(
      (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query),
    );
  }

  if (selectedCategory.value) {
    recipes = recipes.filter((r) => {
      const cat = r.category as Category;
      return cat.id === selectedCategory.value;
    });
  }

  if (selectedDifficulty.value) {
    recipes = recipes.filter((r) => r.difficulty === selectedDifficulty.value);
  }

  return recipes;
});

const itemsPerPage = 9;
const totalPages = computed(() => Math.ceil(filteredRecipes.value.length / itemsPerPage));
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRecipes.value.slice(start, start + itemsPerPage);
});

function updateFilters() {
  const query: Record<string, string> = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (selectedDifficulty.value) query.difficulty = selectedDifficulty.value;
  if (currentPage.value > 1) query.page = currentPage.value.toString();

  void router.push({ query });
}

function clearFilters() {
  searchQuery.value = "";
  selectedCategory.value = "";
  selectedDifficulty.value = "";
  currentPage.value = 1;
  updateFilters();
}

watch([searchQuery, selectedCategory, selectedDifficulty], () => {
  currentPage.value = 1;
  updateFilters();
});

watch(currentPage, updateFilters);
</script>

<template>
  <UPage>
    <UContainer class="py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">All Recipes</h1>
        <p class="text-muted">Discover delicious recipes from our community</p>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search recipes..."
          class="flex-1"
        />

        <USelectMenu
          v-model="selectedCategory"
          :items="categories"
          placeholder="Category"
          label-key="name"
          value-key="_id"
          class="w-full md:w-48"
        />

        <USelectMenu
          v-model="selectedDifficulty"
          :items="difficultyOptions"
          placeholder="Difficulty"
          value-key="value"
          class="w-full md:w-40"
        />

        <UButton
          v-if="searchQuery || selectedCategory || selectedDifficulty"
          label="Clear"
          variant="subtle"
          icon="i-heroicons-x-mark"
          @click="clearFilters"
        />
      </div>

      <p class="text-sm text-muted mb-6">
        {{ filteredRecipes.length }} recipe{{ filteredRecipes.length !== 1 ? "s" : "" }} found
      </p>

      <div
        v-if="paginatedRecipes.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <RecipeCard v-for="recipe in paginatedRecipes" :key="recipe.id" :recipe="recipe" />
      </div>

      <div v-else class="text-center py-16">
        <UIcon name="i-heroicons-magnifying-glass" class="size-12 mx-auto mb-4 text-muted" />
        <h3 class="text-lg font-medium mb-2">No recipes found</h3>
        <p class="text-muted mb-4">Try adjusting your search or filters</p>
        <UButton label="Clear Filters" variant="outline" @click="clearFilters" />
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <UPagination
          v-model="currentPage"
          :total="filteredRecipes.length"
          :page-size="itemsPerPage"
        />
      </div>
    </UContainer>
  </UPage>
</template>
