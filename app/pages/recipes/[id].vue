<script lang="ts" setup>
const route = useRoute();
const recipeId = route.params.id as string;

const recipe = ref<Recipe>({
  _id: recipeId,
  title: "Classic Spaghetti Carbonara",
  description:
    "A traditional Italian pasta dish made with eggs, cheese, pancetta, and pepper. This Roman classic is rich, creamy, and absolutely delicious. Perfect for a weeknight dinner or special occasion.",
  ingredients: [
    { name: "Spaghetti", quantity: "400g" },
    { name: "Pancetta or Guanciale", quantity: "200g" },
    { name: "Eggs", quantity: "4 large" },
    { name: "Pecorino Romano cheese", quantity: "100g, finely grated" },
    { name: "Parmesan cheese", quantity: "50g, finely grated" },
    { name: "Black pepper", quantity: "2 tsp, freshly ground" },
    { name: "Salt", quantity: "to taste" },
  ],
  steps: [
    "Bring a large pot of salted water to a boil. Add the spaghetti and cook according to package directions until al dente. Reserve 1 cup of pasta water before draining.",
    "While the pasta cooks, cut the pancetta into small cubes. Cook in a large skillet over medium heat until crispy, about 8-10 minutes. Remove from heat.",
    "In a bowl, whisk together the eggs, egg yolks, grated Pecorino, and Parmesan. Season with plenty of black pepper.",
    "Add the hot, drained pasta to the skillet with the pancetta. Toss to coat in the rendered fat.",
    "Remove the pan from the heat completely. Pour the egg mixture over the pasta and toss vigorously. The residual heat will cook the eggs into a creamy sauce.",
    "If the sauce is too thick, add a splash of the reserved pasta water to loosen it.",
    "Serve immediately with extra cheese and black pepper on top.",
  ],
  author: {
    _id: "a1",
    firstName: "Marco",
    lastName: "Rossi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    bio: "Italian chef passionate about traditional Roman cuisine",
    recipesCount: 25,
    followersCount: 1200,
  },
  tags: ["Italian", "Pasta", "Quick", "Classic", "Roman"],
  image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200",
  cookTime: 30,
  likes: ["u1", "u2", "u3", "u4", "u5"],
  views: 1250,
  difficulty: "medium",
  status: "approved",
  category: {
    _id: "c1",
    name: "Pasta",
    description: "Italian pasta dishes",
    createdAt: "",
    updatedAt: "",
  },
  createdAt: "2024-01-15",
  updatedAt: "2024-01-15",
});

const author = computed(() => recipe.value.author as Author);
const category = computed(() => recipe.value.category as Category);

const difficultyColor = computed(() => {
  switch (recipe.value.difficulty) {
    case "easy":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "error";
    default:
      return "neutral";
  }
});

const formattedCookTime = computed(() => {
  const time = recipe.value.cookTime;
  if (time < 60) return `${time} minutes`;
  const hours = Math.floor(time / 60);
  const mins = time % 60;
  return mins > 0
    ? `${hours} hour${hours > 1 ? "s" : ""} ${mins} min`
    : `${hours} hour${hours > 1 ? "s" : ""}`;
});

const formattedDate = computed(() => {
  return new Date(recipe.value.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const isLiked = ref(false);

function toggleLike() {
  isLiked.value = !isLiked.value;
  // TODO: API call to like/unlike
}

function shareRecipe() {
  if (navigator.share) {
    void navigator.share({
      title: recipe.value.title,
      text: recipe.value.description,
      url: window.location.href,
    });
  } else {
    void navigator.clipboard.writeText(window.location.href);
    // TODO: Show toast notification
  }
}
</script>

<template>
  <UPage class="pb-16">
    <div class="relative h-64 md:h-96 w-full mb-8">
      <img :src="recipe.image" :alt="recipe.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      <UContainer class="absolute bottom-0 left-0 right-0 pb-6">
        <UBadge :color="difficultyColor" class="capitalize mb-3">
          {{ recipe.difficulty }}
        </UBadge>
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          {{ recipe.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-white/90">
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="size-5" />
            {{ formattedCookTime }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-heart" class="size-5" />
            {{ recipe.likes.length }} likes
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-eye" class="size-5" />
            {{ recipe.views }} views
          </span>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <UCard>
            <p class="text-default leading-relaxed">
              {{ recipe.description }}
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-clipboard-document-list" class="size-5 text-primary" />
                <h2 class="text-xl font-semibold">Ingredients</h2>
              </div>
            </template>
            <ul class="space-y-3">
              <li
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
                class="flex items-start gap-3"
              >
                <UCheckbox :id="`ingredient-${index}`" />
                <label :for="`ingredient-${index}`" class="flex-1 cursor-pointer">
                  <span class="font-medium">{{ ingredient.name }}</span>
                  <span class="text-muted ml-2">{{ ingredient.quantity }}</span>
                </label>
              </li>
            </ul>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-list-bullet" class="size-5 text-primary" />
                <h2 class="text-xl font-semibold">Instructions</h2>
              </div>
            </template>
            <ol class="space-y-6">
              <li v-for="(step, index) in recipe.steps" :key="index" class="flex gap-4">
                <span
                  class="shrink-0 w-8 h-8 rounded-full bg-elevated text-primary flex items-center justify-center font-semibold"
                >
                  {{ index + 1 }}
                </span>
                <p class="flex-1 pt-1 text-default leading-relaxed">
                  {{ step }}
                </p>
              </li>
            </ol>
          </UCard>

          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tag in recipe.tags" :key="tag" variant="soft" size="lg">
              {{ tag }}
            </UBadge>
          </div>
        </div>

        <div class="space-y-6">
          <UCard>
            <div class="flex gap-3">
              <UButton
                :icon="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                :label="isLiked ? 'Liked' : 'Like'"
                :color="isLiked ? 'error' : 'neutral'"
                variant="soft"
                block
                @click="toggleLike"
              />

              <UButton
                icon="i-heroicons-share"
                label="Share"
                variant="soft"
                block
                @click="shareRecipe"
              />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <span class="text-sm text-muted">Recipe by</span>
            </template>
            <div class="flex items-center gap-4">
              <UAvatar
                :src="author.avatar"
                :alt="`${author.firstName} ${author.lastName}`"
                size="xl"
              />
              <div>
                <NuxtLink
                  :to="`/authors/${author._id}`"
                  class="font-semibold hover:text-primary transition-colors"
                >
                  {{ author.firstName }} {{ author.lastName }}
                </NuxtLink>
                <p class="text-sm text-muted">
                  {{ author.recipesCount }} recipes · {{ author.followersCount }} followers
                </p>
              </div>
            </div>
            <template #footer>
              <UButton label="Follow" variant="outline" block />
            </template>
          </UCard>

          <UCard>
            <template #header>
              <span class="text-sm text-muted">Recipe Details</span>
            </template>
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-muted">Category</dt>
                <dd>
                  <NuxtLink
                    :to="`/recipes?category=${category._id}`"
                    class="text-primary hover:underline"
                  >
                    {{ category.name }}
                  </NuxtLink>
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted">Difficulty</dt>
                <dd class="capitalize">{{ recipe.difficulty }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted">Cook Time</dt>
                <dd>{{ formattedCookTime }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted">Published</dt>
                <dd>{{ formattedDate }}</dd>
              </div>
            </dl>
          </UCard>
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
