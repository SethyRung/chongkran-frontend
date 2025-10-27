<script lang="ts" setup>
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  middleware: ["author"],
  layout: "author",
});

const { getUserName } = useAuth();

// Enhanced mock data with modern structure
const kpiData = reactive([
  {
    id: 1,
    title: "Total Views",
    value: 15234,
    change: 12.5,
    trend: "up",
    icon: "i-lucide-eye",
    color: "blue",
    sparkline: [1200, 1900, 3000, 2500, 2200, 3000, 2800],
  },
  {
    id: 2,
    title: "Engagement Rate",
    value: 4.2,
    change: 8.3,
    trend: "up",
    icon: "i-lucide-heart",
    color: "red",
    sparkline: [65, 85, 120, 100, 90, 125, 115],
  },
  {
    id: 3,
    title: "New Followers",
    value: 45,
    change: 15.2,
    trend: "up",
    icon: "i-lucide-users",
    color: "green",
    sparkline: [8, 12, 15, 18, 22, 28, 35],
  },
  {
    id: 4,
    title: "Recipe Rating",
    value: 4.6,
    change: 0.3,
    trend: "up",
    icon: "i-lucide-star",
    color: "yellow",
    sparkline: [4.2, 4.3, 4.4, 4.5, 4.5, 4.6, 4.6],
  },
]);

const recentContent = reactive([
  {
    id: 1,
    title: "Classic Beef Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "Lunch",
    views: 1243,
    likes: 89,
    trend: 23,
    status: "published",
  },
  {
    id: 2,
    title: "Vegetarian Pasta",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    category: "Dinner",
    views: 892,
    likes: 67,
    trend: 15,
    status: "published",
  },
  {
    id: 3,
    title: "Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-6992861c2a0a?w=400",
    category: "Dessert",
    views: 567,
    likes: 45,
    trend: -2,
    status: "draft",
  },
]);

const performanceMetrics = reactive({
  monthlyGoal: 5000,
  currentViews: 2847,
  completionRate: 57,
  newRecipes: 3,
  avgRating: 4.6,
});

const activityFeed = reactive([
  {
    id: 1,
    type: "user",
    action: "liked your",
    target: "Classic Beef Burger",
    user: "Sarah Johnson",
    time: "2 minutes ago",
    avatar: "https://github.com/benjamincanac.png",
  },
  {
    id: 2,
    type: "system",
    action: "Your recipe reached",
    target: "1K views",
    time: "1 hour ago",
    icon: "i-lucide-trending-up",
    color: "green",
  },
  {
    id: 3,
    type: "user",
    action: "commented on",
    target: "Vegetarian Pasta",
    user: "Mike Chen",
    time: "3 hours ago",
    avatar: "https://github.com/atinux.png",
  },
]);

// Format helpers
const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatTrend = (value: number, trend: string) => {
  const sign = trend === "up" ? "+" : "";
  return `${sign}${value}%`;
};
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div class="flex-1">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
          >
            Welcome back, {{ getUserName }}! 👋
          </h1>
          <p class="text-base sm:text-lg text-gray-600">
            Here's what's happening with your culinary journey today
          </p>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <UButton
            icon="i-lucide-plus"
            label="Create Recipe"
            size="lg"
            class="rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            to="/author/create"
          />
        </div>
      </div>

      <!-- KPI Grid - Responsive Layout -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div
          v-for="kpi in kpiData"
          :key="kpi.id"
          class="group relative bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
          @click="$router.push('/author/analytics')"
        >
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div
                :class="`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-${kpi.color}-100`"
              >
                <UIcon
                  :name="kpi.icon"
                  :class="`text-${kpi.color}-600`"
                  :size="24"
                />
              </div>
              <UBadge
                :color="kpi.trend === 'up' ? 'success' : 'error'"
                variant="soft"
                size="sm"
                class="flex items-center gap-1"
              >
                <UIcon
                  :name="
                    kpi.trend === 'up'
                      ? 'i-lucide-trending-up'
                      : 'i-lucide-trending-down'
                  "
                  size="12"
                />
                {{ formatTrend(kpi.change, kpi.trend) }}
              </UBadge>
            </div>

            <div class="space-y-1 sm:space-y-2">
              <p class="text-xs sm:text-sm font-medium text-gray-600">
                {{ kpi.title }}
              </p>
              <p
                class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900"
              >
                {{
                  typeof kpi.value === "number" && kpi.value % 1 !== 0
                    ? kpi.value.toFixed(1)
                    : kpi.value
                }}
                <span
                  v-if="kpi.title === 'Engagement Rate'"
                  class="text-sm sm:text-lg"
                  >%</span
                >
              </p>
            </div>

            <!-- Mini Sparkline -->
            <div class="mt-3 sm:mt-4 h-6 sm:h-8 flex items-end gap-1">
              <div
                v-for="(point, index) in kpi.sparkline"
                :key="index"
                :class="`bg-${kpi.color}-500/20 hover:bg-${kpi.color}-500/40`"
                class="flex-1 rounded-sm transition-colors duration-200"
                :style="{
                  height: `${(point / Math.max(...kpi.sparkline)) * 100}%`,
                  minHeight: '3px',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Content Overview (2 span) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Recent Content Card -->
          <div
            class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Recent Content
                  </h2>
                  <p class="text-sm text-gray-600 mt-1">
                    Your latest recipe performance
                  </p>
                </div>
                <UButton
                  label="View All"
                  variant="ghost"
                  size="sm"
                  to="/author/recipes"
                  class="text-gray-600 hover:text-gray-900"
                />
              </div>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="item in recentContent"
                  :key="item.id"
                  class="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  @click="$router.push(`/author/edit/${item.id}`)"
                >
                  <div class="relative">
                    <NuxtImg
                      :src="item.image"
                      :alt="item.title"
                      class="w-16 h-16 rounded-xl object-cover"
                    />
                    <div
                      :class="`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                        item.status === 'published'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`"
                    ></div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate">
                      {{ item.title }}
                    </h3>
                    <p class="text-sm text-gray-600">{{ item.category }}</p>
                    <div class="flex items-center gap-4 mt-2">
                      <div
                        class="flex items-center gap-1 text-sm text-gray-500"
                      >
                        <UIcon name="i-lucide-eye" size="14" />
                        {{ formatNumber(item.views) }}
                      </div>
                      <div
                        class="flex items-center gap-1 text-sm text-gray-500"
                      >
                        <UIcon name="i-lucide-heart" size="14" />
                        {{ item.likes }}
                      </div>
                    </div>
                  </div>

                  <div class="text-right">
                    <UBadge
                      :color="item.trend >= 0 ? 'success' : 'error'"
                      variant="soft"
                      size="sm"
                      class="mb-2"
                    >
                      <UIcon
                        :name="
                          item.trend >= 0
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        size="12"
                        class="mr-1"
                      />
                      {{ item.trend >= 0 ? "+" : "" }}{{ item.trend }}%
                    </UBadge>
                    <p class="text-xs text-gray-500">{{ item.status }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Monthly Goal -->
            <div
              class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"
              ></div>
              <div class="relative z-10">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <p class="text-blue-100 text-sm font-medium">
                      Monthly Goal
                    </p>
                    <p class="text-2xl font-bold">
                      {{ performanceMetrics.completionRate }}%
                    </p>
                  </div>
                  <UIcon
                    name="i-lucide-target"
                    size="32"
                    class="text-blue-200"
                  />
                </div>

                <div class="mb-4">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-blue-100"
                      >{{
                        formatNumber(performanceMetrics.currentViews)
                      }}
                      views</span
                    >
                    <span class="text-blue-100"
                      >{{
                        formatNumber(performanceMetrics.monthlyGoal)
                      }}
                      goal</span
                    >
                  </div>
                  <div class="w-full bg-white/20 rounded-full h-2">
                    <div
                      class="bg-white rounded-full h-2 transition-all duration-500"
                      :style="{
                        width: `${performanceMetrics.completionRate}%`,
                      }"
                    ></div>
                  </div>
                </div>

                <UButton
                  label="View Analytics"
                  variant="ghost"
                  size="sm"
                  to="/author/analytics"
                  class="text-white hover:bg-white/10"
                />
              </div>
            </div>

            <!-- Quick Stats -->
            <div
              class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"
                    >
                      <UIcon
                        name="i-lucide-book-open"
                        size="20"
                        class="text-green-600"
                      />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">New Recipes</p>
                      <p class="font-semibold text-gray-900">
                        {{ performanceMetrics.newRecipes }}
                      </p>
                    </div>
                  </div>
                  <UIcon
                    name="i-lucide-chevron-right"
                    size="16"
                    class="text-gray-400"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center"
                    >
                      <UIcon
                        name="i-lucide-star"
                        size="20"
                        class="text-yellow-600"
                      />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Avg Rating</p>
                      <p class="font-semibold text-gray-900">
                        {{ performanceMetrics.avgRating }}/5
                      </p>
                    </div>
                  </div>
                  <UIcon
                    name="i-lucide-chevron-right"
                    size="16"
                    class="text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Activity Feed -->
        <div class="space-y-6">
          <!-- Activity Timeline -->
          <div
            class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                What's happening with your content
              </p>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="activity in activityFeed"
                  :key="activity.id"
                  class="flex gap-3"
                >
                  <div
                    v-if="activity.type === 'user'"
                    class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                  >
                    <NuxtImg
                      :src="activity.avatar"
                      :alt="activity.user"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    :class="`w-10 h-10 rounded-xl flex items-center justify-center bg-${activity.color}-100`"
                  >
                    <UIcon
                      :name="activity.icon"
                      :class="`text-${activity.color}-600`"
                      size="20"
                    />
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900">
                      <span v-if="activity.user" class="font-medium">{{
                        activity.user
                      }}</span>
                      <span class="text-gray-600">{{ activity.action }}</span>
                      <span class="font-medium">{{ activity.target }}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ activity.time }}
                    </p>
                  </div>
                </div>
              </div>

              <UButton
                label="View All Activity"
                variant="ghost"
                size="sm"
                class="w-full mt-4 text-gray-600 hover:text-gray-900"
              />
            </div>
          </div>

          <!-- Quick Actions -->
          <div
            class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div class="space-y-2">
              <UButton
                icon="i-lucide-bar-chart-3"
                label="View Analytics"
                variant="ghost"
                size="lg"
                class="w-full justify-start h-12 rounded-xl hover:bg-gray-50"
                to="/author/analytics"
              />
              <UButton
                icon="i-lucide-image"
                label="Manage Media"
                variant="ghost"
                size="lg"
                class="w-full justify-start h-12 rounded-xl hover:bg-gray-50"
              />
              <UButton
                icon="i-lucide-cog"
                label="Settings"
                variant="ghost"
                size="lg"
                class="w-full justify-start h-12 rounded-xl hover:bg-gray-50"
                to="/author/settings"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism effect enhancement */
.bg-white\/80 {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Hover effects */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsive touch targets */
@media (max-width: 640px) {
  button,
  .clickable {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>
