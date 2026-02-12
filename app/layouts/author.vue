<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const navigationItems = reactive<NavigationMenuItem[]>([
  {
    icon: "i-lucide-layout-dashboard",
    label: "Dashboard",
    to: "/author",
  },
  {
    icon: "i-lucide-plus-circle",
    label: "Create Recipe",
    to: "/author/create",
  },
  {
    icon: "i-lucide-notebook-pen",
    label: "My Recipes",
    to: "/author/recipes",
  },
  {
    icon: "i-lucide-bar-chart-3",
    label: "Analytics",
    to: "/author/analytics",
  },
  {
    icon: "i-lucide-settings",
    label: "Settings",
    to: "/author/settings",
  },
]);

const isMobileMenuOpen = ref(false);
</script>
<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      toggle-side="right"
      :class="{ 'hidden lg:flex': !isMobileMenuOpen }"
    >
      <template #header="{ collapsed }">
        <UIcon name="i-lucide-cooking-pot" size="24" class="text-primary-500" />
        <NuxtLink v-if="!collapsed" to="/" class="font-bold text-primary-500 text-lg">
          Chongkran
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :items="navigationItems"
          :collapsed="collapsed"
          orientation="vertical"
          :ui="{
            item: 'rounded-lg mb-1',
            link: 'h-12 md:h-10',
          }"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          icon="i-lucide-log-out"
          :label="collapsed ? undefined : 'Back to Main Site'"
          variant="ghost"
          color="neutral"
          block
          to="/"
          class="h-12"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar class="border-b">
          <template #leading>
            <!-- Mobile menu toggle -->
            <UButton
              icon="i-lucide-menu"
              variant="ghost"
              size="md"
              class="lg:hidden mr-2"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            />
            <UDashboardSidebarCollapse class="hidden lg:flex" />
          </template>

          <template #trailing>
            <div class="flex items-center gap-2">
              <!-- Mobile user menu -->
              <UButton
                icon="i-lucide-user"
                variant="ghost"
                size="md"
                class="lg:hidden"
                to="/author/settings"
              />
            </div>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="min-h-screen pb-20 lg:pb-0">
          <!-- Mobile overlay menu -->
          <div
            v-if="isMobileMenuOpen"
            class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            @click="isMobileMenuOpen = false"
          ></div>

          <!-- Mobile sidebar -->
          <div
            v-if="isMobileMenuOpen"
            class="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden shadow-xl"
          >
            <div class="p-4 border-b">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-cooking-pot" size="24" class="text-primary-500" />
                  <NuxtLink
                    to="/"
                    class="font-bold text-primary-500 text-lg"
                    @click="isMobileMenuOpen = false"
                  >
                    Chongkran
                  </NuxtLink>
                </div>
                <UButton
                  icon="i-lucide-x"
                  variant="ghost"
                  size="md"
                  @click="isMobileMenuOpen = false"
                />
              </div>
            </div>

            <div class="p-4">
              <UNavigationMenu
                :items="navigationItems"
                orientation="vertical"
                :ui="{
                  item: 'rounded-lg mb-2',
                  link: 'h-12', // Larger touch targets
                }"
                @click="isMobileMenuOpen = false"
              />

              <div class="mt-6 pt-6 border-t">
                <UButton
                  icon="i-lucide-log-out"
                  label="Back to Main Site"
                  variant="ghost"
                  color="neutral"
                  block
                  to="/"
                  class="h-12"
                  @click="isMobileMenuOpen = false"
                />
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="p-4 md:p-6 lg:p-8">
            <slot></slot>
          </div>
        </div>

        <!-- Mobile bottom navigation -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-30">
          <div class="grid grid-cols-4 gap-1 p-2">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.to?.toString()"
              :to="item.to"
              class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              :class="{
                'text-primary-600 bg-primary-50': $route.path === item.to,
              }"
            >
              <UIcon :name="item.icon!" size="20" />
              <span class="text-xs font-medium">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
