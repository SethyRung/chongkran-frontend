<script lang="ts" setup>
definePageMeta({
  middleware: ["author"],
  layout: "author",
});

// State
const socialStats = reactive([
  {
    id: 1,
    label: "Total Followers",
    value: 2847,
    change: 15.2,
    trend: "up",
    icon: "i-lucide-users",
    color: "blue",
    progress: 71,
  },
  {
    id: 2,
    label: "Engagement Rate",
    value: 4.2,
    change: 8.3,
    trend: "up",
    icon: "i-lucide-heart",
    color: "red",
    progress: 84,
  },
  {
    id: 3,
    label: "Social Shares",
    value: 1234,
    change: 23.5,
    trend: "up",
    icon: "i-lucide-share-2",
    color: "green",
    progress: 62,
  },
  {
    id: 4,
    label: "Comments",
    value: 567,
    change: -2.1,
    trend: "down",
    icon: "i-lucide-message-circle",
    color: "purple",
    progress: 45,
  },
]);

const recentFollowers = reactive([
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://github.com/benjamincanac.png",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "https://github.com/atinux.png",
    time: "5 hours ago",
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "https://github.com/nuxt.png",
    time: "1 day ago",
  },
]);

const topRecipes = reactive([
  {
    id: 1,
    title: "Classic Beef Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    engagement: 8.5,
  },
  {
    id: 2,
    title: "Vegetarian Pasta",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    engagement: 7.2,
  },
  {
    id: 3,
    title: "Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-6992861c2a0a?w=400",
    engagement: 6.8,
  },
]);

const engagementMetrics = reactive([
  {
    type: "likes",
    label: "Likes",
    value: "1,234",
    percentage: 75,
    color: "red",
  },
  {
    type: "comments",
    label: "Comments",
    value: "567",
    percentage: 35,
    color: "blue",
  },
  {
    type: "shares",
    label: "Shares",
    value: "234",
    percentage: 15,
    color: "green",
  },
  {
    type: "saves",
    label: "Saves",
    value: "89",
    percentage: 8,
    color: "purple",
  },
]);

const activityFeed = reactive([
  {
    id: 1,
    type: "user",
    action: "started following you",
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
    target: "Classic Beef Burger",
    user: "Mike Chen",
    time: "3 hours ago",
    avatar: "https://github.com/atinux.png",
  },
  {
    id: 4,
    type: "user",
    action: "shared your recipe",
    target: "Vegetarian Pasta",
    user: "Emma Davis",
    time: "5 hours ago",
    avatar: "https://github.com/nuxt.png",
  },
]);

const growthTips = reactive([
  {
    id: 1,
    icon: "i-lucide-camera",
    text: "Add high-quality photos to increase engagement by 40%",
  },
  {
    id: 2,
    icon: "i-lucide-clock",
    text: "Post recipes consistently to grow your follower base",
  },
  {
    id: 3,
    icon: "i-lucide-message-square",
    text: "Respond to comments to build community trust",
  },
]);

// Methods
const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        v-motion-slide-visible-once-bottom
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Social Dashboard
          </h1>
          <p class="text-gray-600 text-sm sm:text-base">
            Connect with your followers and track your social engagement
          </p>
        </div>

        <div class="flex gap-3">
          <UButton
            to="/author/settings"
            variant="outline"
            icon="i-lucide-settings"
            label="Settings"
          />
          <UButton
            to="/author/create"
            icon="i-lucide-plus"
            label="New Recipe"
          />
        </div>
      </div>

      <!-- Social Stats Overview -->
      <section
        v-motion-slide-visible-once-bottom
        :delay="100"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        <div
          v-for="stat in socialStats"
          :key="stat.id"
          class="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div :class="`p-3 rounded-lg bg-${stat.color}-100`">
              <UIcon :name="stat.icon" :class="`w-6 h-6 text-${stat.color}-600`" />
            </div>
            <div
              :class="[
                'flex items-center gap-1 text-sm font-medium',
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              ]"
            >
              <UIcon :name="stat.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" />
              {{ stat.change }}%
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-2xl font-bold text-gray-900">
              {{ formatNumber(stat.value) }}
            </div>
            <div class="text-sm text-gray-600">{{ stat.label }}</div>
          </div>

          <!-- Progress Bar -->
          <div v-if="stat.progress" class="mt-4">
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>Goal Progress</span>
              <span>{{ stat.progress }}%</span>
            </div>
            <UProgress
              :value="stat.progress"
              :color="stat.color"
              size="sm"
              class="h-2"
            />
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Recent Followers -->
          <section
            v-motion-slide-visible-once-bottom
            :delay="200"
            class="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
          >
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Recent Followers</h2>
                <UButton
                  to="/author/followers"
                  variant="ghost"
                  size="sm"
                  trailing-icon="i-lucide-arrow-right"
                >
                  View All
                </UButton>
              </div>
            </div>

            <div class="p-6">
              <div v-if="recentFollowers.length" class="space-y-4">
                <div
                  v-for="follower in recentFollowers"
                  :key="follower.id"
                  class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <NuxtImg
                      :src="follower.avatar"
                      :alt="follower.name"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div class="font-medium text-gray-900">{{ follower.name }}</div>
                      <div class="text-sm text-gray-600">{{ follower.time }}</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <UButton
                      :to="`/authors/${follower.id}`"
                      variant="ghost"
                      size="sm"
                      icon="i-lucide-eye"
                    />
                    <UButton
                      variant="outline"
                      size="sm"
                      icon="i-lucide-user-plus"
                      label="Follow Back"
                    />
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p class="text-gray-600">No new followers yet</p>
              </div>
            </div>
          </section>

          <!-- Engagement Analytics -->
          <section
            v-motion-slide-visible-once-bottom
            :delay="300"
            class="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
          >
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900">Engagement Analytics</h2>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <h3 class="font-medium text-gray-900">Top Performing Recipes</h3>
                  <div class="space-y-3">
                    <div
                      v-for="recipe in topRecipes"
                      :key="recipe.id"
                      class="flex items-center gap-3"
                    >
                      <NuxtImg
                        :src="recipe.image"
                        :alt="recipe.title"
                        class="w-12 h-12 rounded-lg object-cover"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-900 truncate">{{ recipe.title }}</div>
                        <div class="text-sm text-gray-600">{{ recipe.engagement }}% engagement</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <h3 class="font-medium text-gray-900">Engagement Breakdown</h3>
                  <div class="space-y-3">
                    <div
                      v-for="metric in engagementMetrics"
                      :key="metric.type"
                      class="space-y-2"
                    >
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">{{ metric.label }}</span>
                        <span class="font-medium">{{ metric.value }}</span>
                      </div>
                      <UProgress
                        :value="metric.percentage"
                        :color="metric.color"
                        size="sm"
                        class="h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Social Activity Feed -->
          <section
            v-motion-slide-visible-once-bottom
            :delay="400"
            class="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
          >
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900">Activity Feed</h2>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="activity in activityFeed"
                  :key="activity.id"
                  class="flex gap-3"
                >
                  <div class="flex-shrink-0">
                    <div
                      v-if="activity.type === 'user'"
                      class="w-8 h-8 rounded-full overflow-hidden"
                    >
                      <NuxtImg
                        :src="activity.avatar"
                        :alt="activity.user"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      :class="`w-8 h-8 rounded-full bg-${activity.color}-100 flex items-center justify-center`"
                    >
                      <UIcon :name="activity.icon" :class="`w-4 h-4 text-${activity.color}-600`" />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="text-sm text-gray-900">
                      <span v-if="activity.user" class="font-medium">{{ activity.user }}</span>
                      {{ ' ' }}
                      <span>{{ activity.action }}</span>
                      {{ ' ' }}
                      <span v-if="activity.target" class="font-medium">{{ activity.target }}</span>
                    </div>
                    <div class="text-xs text-gray-500">{{ activity.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Growth Tips -->
          <section
            v-motion-slide-visible-once-bottom
            :delay="500"
            class="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-lightbulb" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">Growth Tips</h3>
              </div>

              <div class="space-y-3">
                <div
                  v-for="tip in growthTips"
                  :key="tip.id"
                  class="flex gap-3"
                >
                  <UIcon :name="tip.icon" class="w-5 h-5 text-primary-200 flex-shrink-0 mt-0.5" />
                  <p class="text-sm text-primary-100">{{ tip.text }}</p>
                </div>
              </div>

              <UButton
                to="/author/analytics"
                variant="solid"
                color="white"
                size="sm"
                label="View Analytics"
                icon="i-lucide-arrow-right"
                trailing
                class="mt-4"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>