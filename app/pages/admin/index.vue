<script setup lang="ts">
definePageMeta({ layout: "admin" });

const toast = useToast();

const {
  data: dashboard,
  pending,
  refresh,
} = await useAsyncData(
  "admin-dashboard",
  () =>
    Promise.all([
      useApi("/api/users", { query: { limit: 1 } }),
      useApi("/api/recipes", { query: { limit: 1 } }),
      useApi("/api/recipes/pending", { query: { limit: 1 } }),
      useApi("/api/users/authors/requests", {
        query: { limit: 1, status: "pending" },
      }),
      useApi("/api/recipes/pending", { query: { limit: 5 } }),
      useApi("/api/users/authors/requests", {
        query: { limit: 5, status: "pending" },
      }),
    ]),
  {
    transform: ([
      users,
      recipes,
      pendingRecipes,
      authorRequests,
      recentPending,
      recentRequests,
    ]) => ({
      totalUsers: users.meta?.total ?? 0,
      totalRecipes: recipes.meta?.total ?? 0,
      totalPendingRecipes: pendingRecipes.meta?.total ?? 0,
      totalAuthorRequests: authorRequests.meta?.total ?? 0,
      recentPending: recentPending.data ?? [],
      recentRequests: recentRequests.data ?? [],
    }),
  },
);

async function updateRecipeStatus(id: string, status: "approved" | "rejected") {
  try {
    const res = await useApi(
      `/api/recipes/update-status?id=${id}&status=${status}`,
      {
        method: "PUT",
      },
    );

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: `Recipe ${status}`,
        description: `The recipe has been ${status}.`,
        color: status === "approved" ? "success" : "warning",
        icon:
          status === "approved" ? "i-lucide-check-circle" : "i-lucide-x-circle",
      });
      await refresh();
    } else {
      toast.add({
        title: "Action failed",
        description: res.status.message || "Please try again.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Action failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  }
}

async function handleAuthorRequest(id: string, action: "approve" | "reject") {
  try {
    const res = await useApi(`/api/users/authors/requests/${id}/${action}`, {
      method: "PATCH",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: `Request ${action}d`,
        description: `The author request has been ${action}d.`,
        color: action === "approve" ? "success" : "warning",
        icon:
          action === "approve" ? "i-lucide-check-circle" : "i-lucide:x-circle",
      });
      await refresh();
    } else {
      toast.add({
        title: "Action failed",
        description: res.status.message || "Please try again.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Action failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Users"
            :value="dashboard?.totalUsers ?? 0"
            icon="i-lucide:users"
            color="primary"
            :loading="pending"
          />
          <AdminStatCard
            title="Total Recipes"
            :value="dashboard?.totalRecipes ?? 0"
            icon="i-lucide:chef-hat"
            color="primary"
            :loading="pending"
          />
          <AdminStatCard
            title="Pending Recipes"
            :value="dashboard?.totalPendingRecipes ?? 0"
            icon="i-lucide:clock"
            color="warning"
            :loading="pending"
          />
          <AdminStatCard
            title="Pending Author Requests"
            :value="dashboard?.totalAuthorRequests ?? 0"
            icon="i-lucide:user-check"
            color="warning"
            :loading="pending"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">Pending Recipes</h3>
                  <p class="text-sm text-muted">Recipes awaiting review</p>
                </div>
                <UButton
                  to="/admin/recipes"
                  label="View All"
                  variant="subtle"
                  trailing-icon="i-lucide:arrow-right"
                  size="sm"
                />
              </div>
            </template>

            <div v-if="dashboard?.recentPending.length" class="space-y-3">
              <div
                v-for="recipe in dashboard.recentPending"
                :key="recipe.id"
                class="flex items-center gap-3 p-3 rounded-lg bg-elevated/50"
              >
                <UAvatar
                  :src="recipe.image"
                  :alt="recipe.title"
                  size="sm"
                  icon="i-lucide:image"
                />

                <div class="flex-1 min-w-0">
                  <p class="truncate text-sm font-medium">{{ recipe.title }}</p>
                  <p class="text-xs text-muted">
                    {{ recipe.authorName }} &middot;
                    {{ formatDate(recipe.createdAt) }}
                  </p>
                </div>

                <div class="flex gap-1 shrink-0">
                  <UButton
                    label="Approve"
                    size="xs"
                    color="success"
                    variant="subtle"
                    @click="updateRecipeStatus(recipe.id, 'approved')"
                  />
                  <UButton
                    label="Reject"
                    size="xs"
                    color="error"
                    variant="subtle"
                    @click="updateRecipeStatus(recipe.id, 'rejected')"
                  />
                </div>
              </div>
            </div>

            <UAlert
              v-else
              icon="i-lucide:check-circle"
              title="All caught up!"
              description="No pending recipes to review."
              color="success"
              variant="subtle"
            />
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">Author Requests</h3>
                  <p class="text-sm text-muted">
                    Users requesting author status
                  </p>
                </div>
                <UButton
                  to="/admin/author-requests"
                  label="View All"
                  variant="subtle"
                  trailing-icon="i-lucide:arrow-right"
                  size="sm"
                />
              </div>
            </template>

            <div v-if="dashboard?.recentRequests.length" class="space-y-3">
              <div
                v-for="req in dashboard.recentRequests"
                :key="req.id"
                class="flex items-center gap-3 p-3 rounded-lg bg-elevated/50"
              >
                <UAvatar
                  :src="req.avatar"
                  :alt="`${req.firstName} ${req.lastName}`"
                  size="sm"
                  icon="i-lucide:user"
                />

                <div class="flex-1 min-w-0">
                  <p class="truncate text-sm font-medium">
                    {{ req.firstName }} {{ req.lastName }}
                  </p>
                  <p class="text-xs text-muted">{{ req.email }}</p>
                </div>

                <div class="flex gap-1 shrink-0">
                  <UButton
                    label="Approve"
                    size="xs"
                    color="success"
                    variant="subtle"
                    @click="handleAuthorRequest(req.id, 'approve')"
                  />
                  <UButton
                    label="Reject"
                    size="xs"
                    color="error"
                    variant="subtle"
                    @click="handleAuthorRequest(req.id, 'reject')"
                  />
                </div>
              </div>
            </div>

            <UAlert
              v-else
              icon="i-lucide:check-circle"
              title="All caught up!"
              description="No pending author requests."
              color="success"
              variant="subtle"
            />
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
