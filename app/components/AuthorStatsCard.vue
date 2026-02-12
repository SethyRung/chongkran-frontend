<script lang="ts" setup>
interface Props {
  icon: string;
  label: string;
  value: number;
  color?: "primary" | "blue" | "red" | "green" | "yellow" | "purple";
  trend?: number;
  showMiniChart?: boolean;
  miniChartData?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  trend: 0,
  showMiniChart: false,
  miniChartData: () => [20, 35, 45, 30, 60, 40, 55],
});

defineEmits<{
  click: [];
}>();

const isMobile = ref(false);

// Check if we're on mobile
onMounted(() => {
  isMobile.value = window.innerWidth < 640;

  // Listen for window resize
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 640;
  });
});

const iconWrapperClass = computed(() => {
  const colorClasses = {
    primary: "bg-primary-100",
    blue: "bg-blue-100",
    red: "bg-red-100",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
    purple: "bg-purple-100",
  };
  return `p-3 rounded-lg ${colorClasses[props.color]}`;
});

const iconClass = computed(() => {
  const colorClasses = {
    primary: "text-primary-500",
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
  };
  return colorClasses[props.color];
});

const formattedValue = computed(() => {
  if (props.value >= 1000000) {
    return `${(props.value / 1000000).toFixed(1)}M`;
  } else if (props.value >= 1000) {
    return `${(props.value / 1000).toFixed(1)}K`;
  }
  return props.value.toString();
});
</script>

<template>
  <UCard
    variant="outline"
    class="rounded-[12px] hover:shadow-sm transition-shadow cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <div :class="iconWrapperClass">
          <UIcon :name="icon" :size="isMobile ? 20 : 24" :class="iconClass" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[#666] text-sm">{{ label }}</p>
          <p class="text-xl sm:text-2xl font-bold truncate">{{ formattedValue }}</p>
        </div>
      </div>
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto"
      >
        <div v-if="trend !== 0" class="flex items-center gap-1">
          <UIcon
            :name="trend > 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
            :class="trend > 0 ? 'text-green-500' : 'text-red-500'"
            :size="isMobile ? 14 : 16"
          />
          <span :class="trend > 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-medium">
            {{ Math.abs(trend) }}%
          </span>
        </div>
        <div v-if="showMiniChart" class="w-20 h-8 sm:w-16">
          <div class="relative w-full h-full">
            <div
              v-for="(point, index) in miniChartData"
              :key="index"
              class="absolute bottom-0 w-1 bg-current opacity-60 rounded-sm"
              :class="iconClass"
              :style="{
                height: `${point}%`,
                left: `${(index / (miniChartData.length - 1)) * 100}%`,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
