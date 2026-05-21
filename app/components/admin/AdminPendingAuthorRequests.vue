<script lang="ts">
import type { AdminRecentAuthorRequest } from "#shared/types";

interface AdminPendingAuthorRequestsProps {
  requests?: AdminRecentAuthorRequest[];
}

interface AdminPendingAuthorRequestsEmits {
  (e: "handle-request", id: string, action: "approve" | "reject"): void;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<AdminPendingAuthorRequestsProps>(), {
  requests: undefined,
});

const emit = defineEmits<AdminPendingAuthorRequestsEmits>();
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Author Requests</h3>
          <p class="text-sm text-muted">Users requesting author status</p>
        </div>

        <UButton
          label="View All"
          variant="subtle"
          trailing-icon="i-lucide:arrow-right"
          to="/admin/author-requests"
        />
      </div>
    </template>

    <div v-if="requests?.length" class="space-y-3">
      <div
        v-for="req in requests"
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
          <p class="truncate text-sm font-medium">{{ req.firstName }} {{ req.lastName }}</p>
          <p class="text-xs text-muted">{{ req.email }}</p>
        </div>

        <div class="flex gap-1 shrink-0">
          <UButton
            label="Approve"
            size="xs"
            color="success"
            variant="subtle"
            @click="emit('handle-request', req.id, 'approve')"
          />

          <UButton
            label="Reject"
            size="xs"
            color="error"
            variant="subtle"
            @click="emit('handle-request', req.id, 'reject')"
          />
        </div>
      </div>
    </div>

    <UAlert
      v-else
      icon="i-lucide-check-circle"
      title="All caught up!"
      description="No pending author requests."
      color="success"
      variant="subtle"
    />
  </UCard>
</template>
