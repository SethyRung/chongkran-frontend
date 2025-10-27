<script lang="ts" setup>
import { useAuthor } from "~/composables/useAuthor";

definePageMeta({
  middleware: ["author"],
  layout: "author",
});

const { getAuthorAnalytics } = useAuthor();

const selectedPeriod = ref("month");
const activeTab = ref("overview");

const periodOptions = [
  { label: "Last 7 days", value: "week" },
  { label: "Last 30 days", value: "month" },
  { label: "Last 90 days", value: "quarter" },
  { label: "Last year", value: "year" },
];

const analyticsTabs = [
  {
    label: "Overview",
    value: "overview",
    slot: "overview",
    icon: "i-lucide-layout-dashboard",
  },
  {
    label: "Content",
    value: "content",
    slot: "content",
    icon: "i-lucide-book-open",
  },
  {
    label: "Audience",
    value: "audience",
    slot: "audience",
    icon: "i-lucide-users",
  },
  {
    label: "Engagement",
    value: "engagement",
    slot: "engagement",
    icon: "i-lucide-heart",
  },
];

const analytics = reactive({
  totalViews: 15234,
  viewsChange: 12.5,
  totalLikes: 892,
  likesChange: 8.3,
  engagementRate: 4.2,
  engagementChange: -2.1,
  newFollowers: 45,
  followersChange: 15.2,
  totalRecipes: 24,
  recipesChange: 8.7,
  avgRating: 4.6,
  ratingChange: 0.3,
});

// Enhanced data for charts
const viewsData = reactive({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Views",
      data: [1200, 1900, 3000, 2500, 2200, 3000, 2800],
      color: "rgb(59, 130, 246)",
    },
    {
      label: "Likes",
      data: [65, 85, 120, 100, 90, 125, 115],
      color: "rgb(239, 68, 68)",
    },
  ],
});

const monthlyTrend = reactive({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Views",
      data: [8000, 9500, 11000, 12500, 14000, 15234],
      color: "rgb(59, 130, 246)",
    },
    {
      label: "Likes",
      data: [450, 520, 680, 750, 820, 892],
      color: "rgb(239, 68, 68)",
    },
  ],
});

const topRecipes = reactive([
  {
    id: 1,
    title: "Classic Beef Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    views: 1243,
    likes: 89,
    comments: 12,
    growth: 23,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Vegetarian Pasta",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    views: 892,
    likes: 67,
    comments: 8,
    growth: 15,
    rating: 4.5,
  },
  {
    id: 3,
    title: "Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-6992861c2a0a?w=400",
    views: 567,
    likes: 45,
    comments: 3,
    growth: 8,
    rating: 4.9,
  },
  {
    id: 4,
    title: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    views: 445,
    likes: 34,
    comments: 5,
    growth: -2,
    rating: 4.2,
  },
]);

const demographics = reactive({
  ageGroups: [
    { group: "18-24", percentage: 25, color: "bg-blue-500" },
    { group: "25-34", percentage: 35, color: "bg-green-500" },
    { group: "35-44", percentage: 22, color: "bg-yellow-500" },
    { group: "45+", percentage: 18, color: "bg-purple-500" },
  ],
  gender: [
    { group: "Female", percentage: 65, color: "bg-pink-500" },
    { group: "Male", percentage: 32, color: "bg-blue-500" },
    { group: "Other", percentage: 3, color: "bg-gray-500" },
  ],
  locations: [
    { country: "United States", percentage: 35 },
    { country: "United Kingdom", percentage: 15 },
    { country: "Canada", percentage: 12 },
    { country: "Australia", percentage: 8 },
    { country: "Other", percentage: 30 },
  ],
});

const devices = reactive([
  {
    type: "Desktop",
    icon: "i-lucide-monitor",
    percentage: 45,
    colorClass: "bg-blue-500",
    views: 6855,
  },
  {
    type: "Mobile",
    icon: "i-lucide-smartphone",
    percentage: 40,
    colorClass: "bg-green-500",
    views: 6094,
  },
  {
    type: "Tablet",
    icon: "i-lucide-tablet",
    percentage: 15,
    colorClass: "bg-purple-500",
    views: 2285,
  },
]);

const engagement = reactive({
  avgTimeOnPage: "2:34",
  bounceRate: 32,
  commentsPerRecipe: 4.2,
  shareRate: 8.7,
  avgScrollDepth: 65,
  returnVisitorRate: 28,
});

const contentPerformance = reactive([
  {
    category: "Breakfast",
    recipes: 6,
    views: 3200,
    avgRating: 4.5,
    growth: 12,
  },
  {
    category: "Lunch",
    recipes: 8,
    views: 4500,
    avgRating: 4.3,
    growth: 8,
  },
  {
    category: "Dinner",
    recipes: 7,
    views: 5200,
    avgRating: 4.7,
    growth: 15,
  },
  {
    category: "Dessert",
    recipes: 3,
    views: 2334,
    avgRating: 4.9,
    growth: 22,
  },
]);

// Chart component
const ChartComponent = defineComponent({
  props: ["data", "type"],
  setup(props: any) {
    const chartHeight = ref(200);

    return () => {
      if (!props.data || !props.data.labels || !props.data.datasets) {
        return h(
          "div",
          { class: "flex items-center justify-center h-full text-gray-500" },
          "No data available"
        );
      }

      const maxValue = Math.max(
        ...props.data.datasets.flatMap((d: any) => d.data)
      );

      // Create grid lines
      const gridLines = [0, 0.25, 0.5, 0.75, 1].map((fraction, index) =>
        h("div", {
          key: `grid-${index}`,
          class: "absolute left-0 right-0 h-px bg-gray-200",
          style: { top: `${(1 - fraction) * 100}%` },
        })
      );

      // Create datasets
      const datasets = props.data.datasets.map(
        (dataset: any, datasetIndex: number) => {
          const points = dataset.data
            .map((value: number, index: number) => {
              const x = (index / (dataset.data.length - 1)) * 100;
              const y = ((maxValue - value) / maxValue) * 100;
              return `${x}%,${y}%`;
            })
            .join(" ");

          const circles = dataset.data.map((value: number, index: number) => {
            const x = (index / (dataset.data.length - 1)) * 100;
            const y = ((maxValue - value) / maxValue) * 100;
            return h("circle", {
              key: `circle-${datasetIndex}-${index}`,
              cx: `${x}%`,
              cy: `${y}%`,
              r: "4",
              fill: dataset.color,
            });
          });

          return h(
            "svg",
            {
              key: `dataset-${datasetIndex}`,
              class: "absolute inset-0 w-full h-full",
              style: { pointerEvents: "none" },
            },
            [
              h("polyline", {
                points,
                fill: "none",
                stroke: dataset.color,
                "stroke-width": "2",
              }),
              ...circles,
            ]
          );
        }
      );

      // Create x-axis labels
      const xLabels = props.data.labels.map((label: string, index: number) =>
        h("span", { key: `label-${index}` }, label)
      );

      return h("div", { class: "relative w-full h-full" }, [
        // Y-axis
        h(
          "div",
          {
            class:
              "absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500",
          },
          [
            h("span", {}, maxValue.toString()),
            h("span", {}, Math.round(maxValue * 0.75).toString()),
            h("span", {}, Math.round(maxValue * 0.5).toString()),
            h("span", {}, Math.round(maxValue * 0.25).toString()),
            h("span", {}, "0"),
          ]
        ),
        // Chart area
        h("div", { class: "ml-8 h-full" }, [
          h("div", { class: "relative w-full h-full" }, [
            ...gridLines,
            ...datasets,
            h(
              "div",
              {
                class:
                  "absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500",
              },
              xLabels
            ),
          ]),
        ]),
      ]);
    };
  },
});

// Load analytics when period changes
watch(selectedPeriod, async (newPeriod) => {
  try {
    const response = await getAuthorAnalytics({ period: newPeriod });
    // Update analytics with actual data
  } catch (error) {
    // Error is handled by the composable
  }
});

// Load initial analytics
onMounted(async () => {
  try {
    const response = await getAuthorAnalytics({ period: selectedPeriod.value });
    // Update analytics with actual data
  } catch (error) {
    // Error is handled by the composable
  }
});

function exportReport() {
  const exportData = {
    period: selectedPeriod.value,
    analytics: analytics,
    topRecipes: topRecipes,
    demographics: demographics,
    devices: devices,
    engagement: engagement,
    contentPerformance: contentPerformance,
    generatedAt: new Date().toISOString(),
  };

  const csvContent = [
    "Analytics Report - " + selectedPeriod.value,
    "Generated at: " + new Date().toLocaleString(),
    "",
    "Overview Metrics",
    "Metric,Value,Change",
    `Total Views,${analytics.totalViews},${analytics.viewsChange}%`,
    `Total Likes,${analytics.totalLikes},${analytics.likesChange}%`,
    `Engagement Rate,${analytics.engagementRate}%,${analytics.engagementChange}%`,
    `New Followers,${analytics.newFollowers},${analytics.followersChange}%`,
    "",
    "Top Recipes",
    "Recipe,Views,Likes,Comments,Growth,Rating",
    ...topRecipes.map(
      (recipe) =>
        `${recipe.title},${recipe.views},${recipe.likes},${recipe.comments},${recipe.growth}%,${recipe.rating}`
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `analytics_report_${selectedPeriod.value}_${
      new Date().toISOString().split("T")[0]
    }.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div class="flex-1">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
          >
            Analytics Dashboard
          </h1>
          <p class="text-base sm:text-lg text-gray-600">
            Track your recipe performance and audience engagement
          </p>
        </div>
        <div class="flex gap-2 sm:gap-3">
          <USelect
            v-model="selectedPeriod"
            :items="periodOptions"
            placeholder="Select period"
            class="sm:w-48"
            :ui="{ base: 'rounded-xl ring-gray-200' }"
          />
          <UButton
            icon="i-lucide-download"
            label="Export Report"
            variant="outline"
            size="lg"
            class="hidden sm:flex rounded-xl"
            @click="exportReport"
          />
          <UButton
            icon="i-lucide-download"
            size="lg"
            class="sm:hidden rounded-xl"
            @click="exportReport"
          />
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div
        class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
      >
        <UTabs v-model="activeTab" :items="analyticsTabs" class="w-full">
          <!-- Overview Tab -->
          <template #overview="{ item }">
            <div class="space-y-6">
              <!-- Overview Stats -->
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <UCard variant="outline" class="rounded-[12px]">
                  <div class="text-center">
                    <p class="text-[#666] text-sm">Total Views</p>
                    <p class="text-2xl font-bold">
                      {{ analytics.totalViews.toLocaleString() }}
                    </p>
                    <div class="flex items-center justify-center gap-1 mt-1">
                      <UIcon
                        :name="
                          analytics.viewsChange >= 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        :class="
                          analytics.viewsChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        size="16"
                      />
                      <span
                        :class="
                          analytics.viewsChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        class="text-sm"
                      >
                        {{ Math.abs(analytics.viewsChange) }}%
                      </span>
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <div class="text-center">
                    <p class="text-[#666] text-sm">Total Likes</p>
                    <p class="text-2xl font-bold">
                      {{ analytics.totalLikes.toLocaleString() }}
                    </p>
                    <div class="flex items-center justify-center gap-1 mt-1">
                      <UIcon
                        :name="
                          analytics.likesChange >= 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        :class="
                          analytics.likesChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        size="16"
                      />
                      <span
                        :class="
                          analytics.likesChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        class="text-sm"
                      >
                        {{ Math.abs(analytics.likesChange) }}%
                      </span>
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <div class="text-center">
                    <p class="text-[#666] text-sm">Engagement Rate</p>
                    <p class="text-2xl font-bold">
                      {{ analytics.engagementRate }}%
                    </p>
                    <div class="flex items-center justify-center gap-1 mt-1">
                      <UIcon
                        :name="
                          analytics.engagementChange >= 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        :class="
                          analytics.engagementChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        size="16"
                      />
                      <span
                        :class="
                          analytics.engagementChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        class="text-sm"
                      >
                        {{ Math.abs(analytics.engagementChange) }}%
                      </span>
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <div class="text-center">
                    <p class="text-[#666] text-sm">New Followers</p>
                    <p class="text-2xl font-bold">
                      {{ analytics.newFollowers }}
                    </p>
                    <div class="flex items-center justify-center gap-1 mt-1">
                      <UIcon
                        :name="
                          analytics.followersChange >= 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        :class="
                          analytics.followersChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        size="16"
                      />
                      <span
                        :class="
                          analytics.followersChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        class="text-sm"
                      >
                        {{ Math.abs(analytics.followersChange) }}%
                      </span>
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <div class="text-center">
                    <p class="text-[#666] text-sm">Total Recipes</p>
                    <p class="text-2xl font-bold">
                      {{ analytics.totalRecipes }}
                    </p>
                    <div class="flex items-center justify-center gap-1 mt-1">
                      <UIcon
                        :name="
                          analytics.recipesChange >= 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        :class="
                          analytics.recipesChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        size="16"
                      />
                      <span
                        :class="
                          analytics.recipesChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        class="text-sm"
                      >
                        {{ Math.abs(analytics.recipesChange) }}%
                      </span>
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <div class="text-center">
                    <p class="text-[#666] text-sm">Avg Rating</p>
                    <p class="text-2xl font-bold">
                      {{ analytics.avgRating }}
                    </p>
                    <div class="flex items-center justify-center gap-1 mt-1">
                      <UIcon
                        :name="
                          analytics.ratingChange >= 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        :class="
                          analytics.ratingChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        size="16"
                      />
                      <span
                        :class="
                          analytics.ratingChange >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        "
                        class="text-sm"
                      >
                        {{ Math.abs(analytics.ratingChange) }}
                      </span>
                    </div>
                  </div>
                </UCard>
              </div>

              <!-- Charts Section -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Weekly Views Chart -->
                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Weekly Performance</h2>
                  </template>
                  <div class="h-64">
                    <ChartComponent :data="viewsData" type="line" />
                  </div>
                </UCard>

                <!-- Monthly Trend Chart -->
                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Monthly Trend</h2>
                  </template>
                  <div class="h-64">
                    <ChartComponent :data="monthlyTrend" type="line" />
                  </div>
                </UCard>
              </div>

              <!-- Top Recipes -->
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold">
                      Top Performing Recipes
                    </h2>
                    <UButton
                      label="View All"
                      variant="ghost"
                      size="sm"
                      to="/author/recipes"
                    />
                  </div>
                </template>
                <div class="space-y-4">
                  <div
                    v-for="recipe in topRecipes"
                    :key="recipe.id"
                    class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <NuxtImg
                      :src="recipe.image"
                      :alt="recipe.title"
                      class="w-16 h-16 rounded-lg object-cover"
                    />
                    <div class="flex-1">
                      <h3 class="font-medium">{{ recipe.title }}</h3>
                      <div
                        class="flex items-center gap-4 mt-1 text-sm text-[#666]"
                      >
                        <span>{{ recipe.views.toLocaleString() }} views</span>
                        <span>•</span>
                        <span>{{ recipe.likes }} likes</span>
                        <span>•</span>
                        <span>{{ recipe.comments }} comments</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="flex items-center gap-1 mb-1">
                        <UIcon
                          name="i-lucide-star"
                          size="14"
                          class="text-yellow-500"
                        />
                        <span class="text-sm font-medium">{{
                          recipe.rating
                        }}</span>
                      </div>
                      <UBadge
                        :color="recipe.growth >= 0 ? 'success' : 'error'"
                        variant="soft"
                        size="sm"
                      >
                        {{ recipe.growth >= 0 ? "+" : "" }}{{ recipe.growth }}%
                      </UBadge>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Content Tab -->
          <template #content="{ item }">
            <div class="space-y-6">
              <!-- Content Performance by Category -->
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <h2 class="text-lg font-semibold">Performance by Category</h2>
                </template>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left py-3 px-4">Category</th>
                        <th class="text-left py-3 px-4">Recipes</th>
                        <th class="text-left py-3 px-4">Total Views</th>
                        <th class="text-left py-3 px-4">Avg Rating</th>
                        <th class="text-left py-3 px-4">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="category in contentPerformance"
                        :key="category.category"
                        class="border-b hover:bg-gray-50"
                      >
                        <td class="py-3 px-4 font-medium">
                          {{ category.category }}
                        </td>
                        <td class="py-3 px-4">{{ category.recipes }}</td>
                        <td class="py-3 px-4">
                          {{ category.views.toLocaleString() }}
                        </td>
                        <td class="py-3 px-4">
                          <div class="flex items-center gap-1">
                            <UIcon
                              name="i-lucide-star"
                              size="14"
                              class="text-yellow-500"
                            />
                            {{ category.avgRating }}
                          </div>
                        </td>
                        <td class="py-3 px-4">
                          <UBadge
                            :color="category.growth >= 0 ? 'success' : 'error'"
                            variant="soft"
                            size="sm"
                          >
                            {{ category.growth >= 0 ? "+" : ""
                            }}{{ category.growth }}%
                          </UBadge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </UCard>

              <!-- Content Distribution -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">
                      Content Status Distribution
                    </h2>
                  </template>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Published</span>
                      <div class="flex items-center gap-2">
                        <div class="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-green-500 h-2 rounded-full"
                            style="width: 75%"
                          ></div>
                        </div>
                        <span class="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Draft</span>
                      <div class="flex items-center gap-2">
                        <div class="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-yellow-500 h-2 rounded-full"
                            style="width: 20%"
                          ></div>
                        </div>
                        <span class="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Archived</span>
                      <div class="flex items-center gap-2">
                        <div class="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-gray-500 h-2 rounded-full"
                            style="width: 5%"
                          ></div>
                        </div>
                        <span class="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Publishing Frequency</h2>
                  </template>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm">This Month</span>
                      <span class="font-medium">4 recipes</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Last Month</span>
                      <span class="font-medium">3 recipes</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm">Average</span>
                      <span class="font-medium">2.5 recipes/month</span>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </template>

          <!-- Audience Tab -->
          <template #audience="{ item }">
            <div class="space-y-6">
              <!-- Demographics -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Age Groups -->
                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Age Groups</h2>
                  </template>
                  <div class="space-y-3">
                    <div
                      v-for="ageGroup in demographics.ageGroups"
                      :key="ageGroup.group"
                      class="flex items-center justify-between"
                    >
                      <span class="text-sm">{{ ageGroup.group }}</span>
                      <div class="flex items-center gap-2">
                        <div class="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            :class="ageGroup.color"
                            class="h-2 rounded-full"
                            :style="{ width: ageGroup.percentage + '%' }"
                          ></div>
                        </div>
                        <span class="text-sm font-medium"
                          >{{ ageGroup.percentage }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </UCard>

                <!-- Gender Distribution -->
                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Gender Distribution</h2>
                  </template>
                  <div class="space-y-3">
                    <div
                      v-for="gender in demographics.gender"
                      :key="gender.group"
                      class="flex items-center justify-between"
                    >
                      <span class="text-sm">{{ gender.group }}</span>
                      <div class="flex items-center gap-2">
                        <div class="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            :class="gender.color"
                            class="h-2 rounded-full"
                            :style="{ width: gender.percentage + '%' }"
                          ></div>
                        </div>
                        <span class="text-sm font-medium"
                          >{{ gender.percentage }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </UCard>

                <!-- Top Locations -->
                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Top Locations</h2>
                  </template>
                  <div class="space-y-3">
                    <div
                      v-for="location in demographics.locations"
                      :key="location.country"
                      class="flex items-center justify-between"
                    >
                      <span class="text-sm">{{ location.country }}</span>
                      <span class="text-sm font-medium"
                        >{{ location.percentage }}%</span
                      >
                    </div>
                  </div>
                </UCard>
              </div>

              <!-- Device Breakdown -->
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <h2 class="text-lg font-semibold">Device Breakdown</h2>
                </template>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    v-for="device in devices"
                    :key="device.type"
                    class="text-center"
                  >
                    <div class="p-4 rounded-lg bg-gray-50">
                      <UIcon
                        :name="device.icon"
                        size="32"
                        class="mb-2 text-[#666]"
                      />
                      <h3 class="font-medium">{{ device.type }}</h3>
                      <p class="text-2xl font-bold mt-2">
                        {{ device.percentage }}%
                      </p>
                      <p class="text-sm text-[#666]">
                        {{ device.views.toLocaleString() }} views
                      </p>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Engagement Tab -->
          <template #engagement="{ item }">
            <div class="space-y-6">
              <!-- Engagement Metrics -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Time Metrics</h2>
                  </template>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-[#666]">Avg. Time on Page</span>
                      <span class="font-medium">{{
                        engagement.avgTimeOnPage
                      }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-[#666]">Avg. Scroll Depth</span>
                      <span class="font-medium"
                        >{{ engagement.avgScrollDepth }}%</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-[#666]"
                        >Return Visitor Rate</span
                      >
                      <span class="font-medium"
                        >{{ engagement.returnVisitorRate }}%</span
                      >
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Interaction Metrics</h2>
                  </template>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-[#666]">Bounce Rate</span>
                      <span class="font-medium"
                        >{{ engagement.bounceRate }}%</span
                      >
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-[#666]"
                        >Comments per Recipe</span
                      >
                      <span class="font-medium">{{
                        engagement.commentsPerRecipe
                      }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-[#666]">Share Rate</span>
                      <span class="font-medium"
                        >{{ engagement.shareRate }}%</span
                      >
                    </div>
                  </div>
                </UCard>

                <UCard variant="outline" class="rounded-[12px]">
                  <template #header>
                    <h2 class="text-lg font-semibold">Engagement Score</h2>
                  </template>
                  <div class="text-center">
                    <div class="text-4xl font-bold text-primary-500 mb-2">
                      8.5
                    </div>
                    <p class="text-sm text-[#666]">Out of 10</p>
                    <div class="mt-4">
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="bg-primary-500 h-2 rounded-full"
                          style="width: 85%"
                        ></div>
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>

              <!-- Engagement Trends -->
              <UCard variant="outline" class="rounded-[12px]">
                <template #header>
                  <h2 class="text-lg font-semibold">Engagement Trends</h2>
                </template>
                <div class="h-64">
                  <div
                    class="flex items-center justify-center h-full text-[#666]"
                  >
                    <div class="text-center">
                      <UIcon
                        name="i-lucide-line-chart"
                        size="48"
                        class="mx-auto mb-2"
                      />
                      <p>Engagement trends chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>
