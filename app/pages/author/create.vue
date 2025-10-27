<script lang="ts" setup>
import * as z from "zod";

definePageMeta({
  middleware: ["author"],
  layout: "author",
});

const { createRecipe } = useAuthor();
const toast = useToast();

const currentStep = ref(0);
const stepperRef = useTemplateRef("stepperRef");
const isSaving = ref(false);
const isPublishing = ref(false);
const fileInput = ref<HTMLInputElement>();

const basicInfoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  prepTime: z
    .number()
    .min(1, "Prep time must be at least 1 minute")
    .max(1440, "Prep time must be less than 24 hours"),
  cookTime: z
    .number()
    .min(1, "Cook time must be at least 1 minute")
    .max(1440, "Cook time must be less than 24 hours"),
  servings: z
    .number()
    .min(1, "Servings must be at least 1")
    .max(100, "Servings must be less than 100"),
  difficulty: z.string().min(1, "Difficulty is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
});

const ingredientsSchema = z.object({
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        quantity: z.string().min(1, "Quantity is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
});

const instructionsSchema = z.object({
  instructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters")
    .max(10000, "Instructions must be less than 10000 characters"),
});

type BasicInfoSchema = z.output<typeof basicInfoSchema>;

const recipeState = reactive<
  Partial<BasicInfoSchema> & {
    image?: string;
    ingredients: Array<{ name: string; quantity: string }>;
    instructions?: string;
  }
>({
  title: "",
  category: "",
  prepTime: undefined,
  cookTime: undefined,
  servings: undefined,
  difficulty: "",
  description: "",
  instructions: "",
  ingredients: [],
});

const steps = [
  {
    title: "Basic Info",
    description: "Recipe title, category, and description",
    icon: "i-lucide-info",
    slot: "basic-info",
  },
  {
    title: "Ingredients",
    description: "List all ingredients needed",
    icon: "i-lucide-list",
    slot: "ingredients",
  },
  {
    title: "Instructions",
    description: "Step-by-step cooking guide",
    icon: "i-lucide-clipboard-list",
    slot: "instructions",
  },
  {
    title: "Review",
    description: "Preview and publish",
    icon: "i-lucide-eye",
    slot: "review",
  },
];

const basicInfoState = reactive({
  title: recipeState.title,
  category: recipeState.category,
  prepTime: recipeState.prepTime,
  cookTime: recipeState.cookTime,
  servings: recipeState.servings,
  difficulty: recipeState.difficulty,
  description: recipeState.description,
});

const ingredientsState = reactive({
  ingredients: recipeState.ingredients,
});

const instructionsState = reactive({
  instructions: recipeState.instructions,
});

watch(
  basicInfoState,
  (newState) => {
    Object.assign(recipeState, newState);
  },
  { deep: true }
);

watch(
  ingredientsState,
  (newState) => {
    recipeState.ingredients = newState.ingredients;
  },
  { deep: true }
);

watch(
  instructionsState,
  (newState) => {
    recipeState.instructions = newState.instructions;
  },
  { deep: true }
);

const stepValidation = computed(() => {
  switch (currentStep.value) {
    case 0: // Basic Info
      return (
        basicInfoState.title &&
        basicInfoState.category &&
        basicInfoState.prepTime &&
        basicInfoState.cookTime &&
        basicInfoState.servings &&
        basicInfoState.difficulty &&
        basicInfoState.description &&
        basicInfoState.description.length >= 10
      );
    case 1: // Ingredients
      return ingredientsState.ingredients.length > 0;
    case 2: // Instructions
      return (
        instructionsState.instructions &&
        instructionsState.instructions.length >= 10
      );
    case 3: // Review
      return true;
    default:
      return false;
  }
});

function nextStep() {
  stepperRef.value?.next();
}

function previousStep() {
  stepperRef.value?.prev();
}

const categoryOptions = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Dessert", value: "dessert" },
  { label: "Snack", value: "snack" },
  { label: "Beverage", value: "beverage" },
];

const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

function addIngredient() {
  recipeState.ingredients.push({ name: "", quantity: "" });
}

function removeIngredient(index: number) {
  recipeState.ingredients.splice(index, 1);
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      recipeState.image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  recipeState.image = undefined;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

async function saveDraft() {
  if (!stepValidation.value) {
    toast.add({
      title: "Validation Error",
      description: "Please complete all required fields",
      color: "error",
    });
    return;
  }

  isSaving.value = true;
  try {
    await createRecipe({
      ...recipeState,
      ...basicInfoState,
      ...ingredientsState,
      ...instructionsState,
      status: "draft",
    });
    toast.add({
      title: "Success",
      description: "Recipe saved as draft",
      color: "success",
    });
  } catch {
    // Error is handled by the composable
  } finally {
    isSaving.value = false;
  }
}

async function publishRecipe() {
  if (!stepValidation.value) {
    toast.add({
      title: "Validation Error",
      description: "Please complete all required fields",
      color: "error",
    });
    return;
  }

  isPublishing.value = true;
  try {
    await createRecipe({
      ...recipeState,
      ...basicInfoState,
      ...ingredientsState,
      ...instructionsState,
      status: "published",
    });
    toast.add({
      title: "Success",
      description: "Recipe published successfully",
      color: "success",
    });
    navigateTo("/author/recipes");
  } catch {
    // Error is handled by the composable
  } finally {
    isPublishing.value = false;
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <UContainer>
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div class="flex-1">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
          >
            Create New Recipe
          </h1>
          <p class="text-base sm:text-lg text-gray-600">
            Share your culinary creation with the world
          </p>
        </div>
      </div>

      <UCard
        :ui="{
          footer: 'flex items-center justify-between ',
        }"
      >
        <UStepper
          ref="stepperRef"
          v-model="currentStep"
          :items="steps"
          linear
          class="w-full"
        >
          <template #basic-info>
            <div class="space-y-4">
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <h2 class="text-lg font-semibold">Basic Information</h2>
                </template>
                <UForm
                  :state="basicInfoState"
                  :schema="basicInfoSchema"
                  :validate-on="['blur']"
                  class="space-y-6"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormField
                      label="Recipe Title"
                      name="title"
                      required
                      size="xl"
                    >
                      <UInput
                        v-model="basicInfoState.title"
                        placeholder="Enter recipe title"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField
                      label="Category"
                      name="category"
                      required
                      size="xl"
                    >
                      <USelect
                        v-model="basicInfoState.category"
                        :items="categoryOptions"
                        placeholder="Select category"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField
                      label="Prep Time"
                      name="prepTime"
                      required
                      size="xl"
                    >
                      <UInput
                        v-model="basicInfoState.prepTime"
                        type="number"
                        placeholder="Minutes"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField
                      label="Cook Time"
                      name="cookTime"
                      required
                      size="xl"
                    >
                      <UInput
                        v-model="basicInfoState.cookTime"
                        type="number"
                        placeholder="Minutes"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField
                      label="Servings"
                      name="servings"
                      required
                      size="xl"
                    >
                      <UInput
                        v-model="basicInfoState.servings"
                        type="number"
                        placeholder="Number of servings"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>

                    <UFormField
                      label="Difficulty"
                      name="difficulty"
                      required
                      size="xl"
                    >
                      <USelect
                        v-model="basicInfoState.difficulty"
                        :items="difficultyOptions"
                        placeholder="Select difficulty"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>
                  </div>

                  <!-- Recipe Description -->
                  <UFormField
                    label="Recipe Description"
                    name="description"
                    required
                  >
                    <UTextarea
                      v-model="basicInfoState.description"
                      placeholder="Describe your recipe in detail. What makes it special? What's the story behind it?"
                      :rows="8"
                      class="w-full"
                      :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                    />
                    <div class="mt-4 text-sm text-[#666]">
                      <p>Minimum 10 characters required (max 2000)</p>
                      <p>
                        {{ basicInfoState.description?.length || 0 }} / 2000
                        characters
                      </p>
                    </div>
                  </UFormField>
                </UForm>

                <!-- Recipe Image -->
                <div class="mt-6">
                  <UFormField label="Recipe Image" name="image">
                    <div class="space-y-4">
                      <div
                        v-if="!recipeState.image"
                        class="border-2 border-dashed border-[#666]/35 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                        @click="triggerFileInput"
                      >
                        <UIcon
                          name="i-lucide-image-plus"
                          size="48"
                          class="mx-auto mb-2 text-[#666]"
                        />
                        <p class="text-[#666]">Click to upload recipe image</p>
                        <p class="text-xs text-[#666] mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                      <div v-if="recipeState.image" class="relative">
                        <NuxtImg
                          :src="recipeState.image"
                          alt="Recipe image"
                          class="w-full h-64 object-cover rounded-lg"
                        />
                        <UButton
                          icon="i-lucide-x"
                          variant="ghost"
                          color="error"
                          size="sm"
                          class="absolute top-2 right-2"
                          @click="removeImage"
                        />
                      </div>
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleFileUpload"
                      />
                    </div>
                  </UFormField>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Step 2: Ingredients -->
          <template #ingredients>
            <div class="space-y-4">
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold">Ingredients</h2>
                    <UButton
                      icon="i-lucide-plus"
                      label="Add Ingredient"
                      variant="outline"
                      size="sm"
                      @click="addIngredient"
                    />
                  </div>
                </template>
                <UForm
                  :state="ingredientsState"
                  :schema="ingredientsSchema"
                  :validate-on="['blur']"
                  class="space-y-3"
                >
                  <div
                    v-for="(ingredient, index) in ingredientsState.ingredients"
                    :key="index"
                    class="flex gap-3"
                  >
                    <UFormField
                      :name="`ingredients.${index}.name`"
                      class="flex-1"
                    >
                      <UInput
                        v-model="ingredient.name"
                        placeholder="Ingredient name"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>
                    <UFormField
                      :name="`ingredients.${index}.quantity`"
                      class="w-32"
                    >
                      <UInput
                        v-model="ingredient.quantity"
                        placeholder="Quantity"
                        class="w-full"
                        :ui="{ base: 'rounded-[12px] ring-[#666]/35' }"
                      />
                    </UFormField>
                    <UButton
                      icon="i-lucide-x"
                      variant="ghost"
                      color="error"
                      size="sm"
                      @click="removeIngredient(index)"
                    />
                  </div>
                  <UFormField name="ingredients" class="hidden" />
                  <p
                    v-if="ingredientsState.ingredients.length === 0"
                    class="text-[#666] text-center py-4"
                  >
                    No ingredients added yet
                  </p>
                </UForm>
              </UCard>
            </div>
          </template>

          <!-- Step 3: Instructions -->
          <template #instructions>
            <div class="space-y-4">
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <h2 class="text-lg font-semibold">Cooking Instructions</h2>
                </template>
                <UForm
                  :state="instructionsState"
                  :schema="instructionsSchema"
                  :validate-on="['blur']"
                  class="space-y-4"
                >
                  <UFormField name="instructions" required>
                    <TiptapEditor v-model="instructionsState.instructions" />
                  </UFormField>
                  <div class="mt-4 text-sm text-[#666]">
                    <p>Provide step-by-step instructions for your recipe</p>
                    <p>Minimum 10 characters required (max 10000)</p>
                    <p>
                      {{ instructionsState.instructions?.length || 0 }} / 10000
                      characters
                    </p>
                  </div>
                </UForm>
              </UCard>
            </div>
          </template>

          <!-- Step 4: Review -->
          <template #review>
            <div class="space-y-4">
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <h2 class="text-lg font-semibold">Review Your Recipe</h2>
                </template>
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 class="font-semibold mb-2">Basic Info</h3>
                      <p><strong>Title:</strong> {{ recipeState.title }}</p>
                      <p>
                        <strong>Category:</strong> {{ recipeState.category }}
                      </p>
                      <p>
                        <strong>Prep Time:</strong>
                        {{ recipeState.prepTime }} minutes
                      </p>
                      <p>
                        <strong>Cook Time:</strong>
                        {{ recipeState.cookTime }} minutes
                      </p>
                      <p>
                        <strong>Servings:</strong> {{ recipeState.servings }}
                      </p>
                      <p>
                        <strong>Difficulty:</strong>
                        {{ recipeState.difficulty }}
                      </p>
                    </div>
                    <div>
                      <h3 class="font-semibold mb-2">Metrics</h3>
                      <p>
                        <strong>Ingredients:</strong>
                        {{ recipeState.ingredients.length }} items
                      </p>
                      <p>
                        <strong>Description:</strong>
                        {{ recipeState.description?.length || 0 }} characters
                      </p>
                      <p>
                        <strong>Instructions:</strong>
                        {{ recipeState.instructions?.length || 0 }} characters
                      </p>
                      <p><strong>Status:</strong> Ready to publish</p>
                    </div>
                  </div>

                  <div v-if="recipeState.image" class="mt-4">
                    <h3 class="font-semibold mb-2">Recipe Image</h3>
                    <NuxtImg
                      :src="recipeState.image"
                      alt="Recipe preview"
                      class="w-32 h-32 rounded-lg object-cover"
                    />
                  </div>

                  <div class="border-t pt-4">
                    <h3 class="font-semibold mb-2">Description Preview</h3>
                    <p class="text-sm text-[#666]">
                      {{ recipeState.description }}
                    </p>
                  </div>

                  <div class="border-t pt-4">
                    <h3 class="font-semibold mb-2">Ingredients Preview</h3>
                    <ul class="list-disc list-inside text-sm">
                      <li
                        v-for="(ingredient, index) in recipeState.ingredients"
                        :key="index"
                      >
                        {{ ingredient.quantity }} {{ ingredient.name }}
                      </li>
                    </ul>
                  </div>
                </div>
              </UCard>
            </div>
          </template>
        </UStepper>

        <template #footer>
          <UButton
            icon="i-lucide-arrow-left"
            label="Previous"
            variant="outline"
            size="lg"
            class="rounded-[12px]"
            :disabled="!stepperRef?.hasPrev"
            @click="previousStep"
          />
          <div class="flex gap-3">
            <UButton
              icon="i-lucide-arrow-right"
              label="Next"
              size="lg"
              class="rounded-[12px]"
              :disabled="!stepperRef?.hasNext || !stepValidation"
              @click="nextStep"
            />
            <div v-if="!stepperRef?.hasNext" class="flex gap-3">
              <UButton
                label="Save Draft"
                variant="outline"
                size="lg"
                class="rounded-[12px]"
                :loading="isSaving"
                :disabled="!stepValidation"
                @click="saveDraft"
              />
              <UButton
                label="Publish Recipe"
                size="lg"
                class="rounded-[12px]"
                :loading="isPublishing"
                :disabled="!stepValidation"
                @click="publishRecipe"
              />
            </div>
          </div>
        </template>
      </UCard>
    </UContainer>
  </div>
</template>
