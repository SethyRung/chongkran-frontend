<script lang="ts" setup>
interface ActivityItem {
  id: string | number;
  type: "user-interaction" | "system" | "milestone";
  userName?: string;
  userAvatar?: string;
  action: string;
  target: string;
  timestamp: Date | string;
  icon?: string;
  iconSize?: number;
  iconClass?: string;
  iconWrapper?: string;
}

interface Props {
  title?: string;
  activities: ActivityItem[];
  showViewAll?: boolean;
  maxItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Recent Activity",
  showViewAll: true,
  maxItems: undefined,
});

defineEmits<{
  "view-all": [];
}>();

const displayedActivities = computed(() => {
  return props.maxItems ? props.activities.slice(0, props.maxItems) : props.activities;
});

// Default activity data
const defaultActivities: ActivityItem[] = [
  {
    id: 1,
    type: "user-interaction",
    userName: "Sarah Johnson",
    userAvatar: "https://github.com/benjamincanac.png",
    action: "liked your",
    target: "Classic Beef Burger",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: 2,
    type: "system",
    action: "Your recipe",
    target: "Vegetarian Pasta",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    icon: "i-lucide-check",
    iconSize: 16,
    iconClass: "text-green-600",
    iconWrapper: "p-2 bg-green-100 rounded-full",
  },
  {
    id: 3,
    type: "user-interaction",
    userName: "Mike Chen",
    userAvatar: "https://github.com/atinux.png",
    action: "commented on your",
    target: "Chocolate Cake",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: 4,
    type: "milestone",
    action: "Your recipes reached",
    target: "15K total views",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    icon: "i-lucide-trending-up",
    iconSize: 16,
    iconClass: "text-blue-600",
    iconWrapper: "p-2 bg-blue-100 rounded-full",
  },
  {
    id: 5,
    type: "user-interaction",
    userName: "Emma Wilson",
    userAvatar: "https://github.com/richardtallent.png",
    action: "started following you",
    target: "",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

// Use default activities if none provided
const activities = computed(() => {
  return props.activities.length > 0 ? displayedActivities.value : defaultActivities;
});

function formatTimeAgo(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}
</script>

<template>
  <UCard variant="outline" class="rounded-[12px]">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <UButton
          v-if="showViewAll"
          variant="ghost"
          size="sm"
          label="View All"
          @click="$emit('view-all')"
        />
      </div>
    </template>
    <div class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex flex-col sm:flex-row items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <!-- Activity Icon/Avatar -->
        <template v-if="activity.type === 'user-interaction'">
          <UAvatar :src="activity.userAvatar" :alt="activity.userName" size="sm" />
        </template>
        <template v-else>
          <div :class="activity.iconWrapper">
            <UIcon :name="activity.icon" :size="activity.iconSize" :class="activity.iconClass" />
          </div>
        </template>

        <!-- Activity Content -->
        <div class="flex-1 w-full">
          <p class="text-sm leading-relaxed">
            <template v-if="activity.type === 'user-interaction'">
              <span class="font-medium">{{ activity.userName }}</span>
              {{ activity.action }}
              <span class="text-primary font-medium">{{ activity.target }}</span>
            </template>
            <template v-else>
              <span class="font-medium">{{ activity.target }}</span>
              {{ activity.action }}
            </template>
          </p>
          <p class="text-xs text-[#666] mt-1">{{ formatTimeAgo(activity.timestamp) }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="activities.length === 0" class="text-center py-8">
        <UIcon name="i-lucide-clock" size="48" class="mx-auto mb-2 text-[#666]" />
        <p class="text-[#666]">No recent activity</p>
      </div>
    </div>
  </UCard>
</template>
