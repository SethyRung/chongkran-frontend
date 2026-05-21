<script lang="ts">
import type { ChartOptions, ChartData } from "chart.js";

type ChartType = "line" | "bar" | "doughnut";

interface AdminChartCardProps {
  title: string;
  subtitle?: string;
  chartData?: ChartData | null;
  chartOptions?: ChartOptions;
  chartType?: ChartType;
  class?: any;
}
</script>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Filler,
);

const props = withDefaults(defineProps<AdminChartCardProps>(), {
  subtitle: undefined,
  chartData: undefined,
  chartOptions: undefined,
  chartType: "line",
  class: "h-64",
});

const chartComponents: Record<ChartType, any> = { line: Line, bar: Bar, doughnut: Doughnut };

const ChartComponent = computed(() => chartComponents[props.chartType]);
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h3 class="font-semibold">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-muted">{{ subtitle }}</p>
      </div>
    </template>

    <div :class="props.class">
      <ClientOnly>
        <component
          :is="ChartComponent"
          v-if="chartData"
          :data="chartData"
          :options="chartOptions"
          class="h-full w-full"
        />
        <template #fallback>
          <div class="h-full flex items-center justify-center text-sm text-muted">
            Loading chart...
          </div>
        </template>
      </ClientOnly>
    </div>
  </UCard>
</template>
