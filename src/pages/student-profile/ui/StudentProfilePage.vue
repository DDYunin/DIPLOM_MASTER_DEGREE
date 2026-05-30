<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import { useAdminManagedUserProfilePage } from '@/features/admin-user-profile'
import { useNotifications } from '@/shared/model'

import { SecuritySettingsCard } from '@/widgets/security-settings-card'
import { ProfileInfoCard } from '@/widgets/profile-info-card'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const notifications = useNotifications()

const userId = computed(() => route.params.id as string)

const {
  profileQuery,
  profileDraft,
  departmentOptions,
  groupOptions,
  isRoleMismatch,
  isLoading,
  isSaving,
  hasChanges,
  errors,
  resetDraft,
  submitProfile
} = useAdminManagedUserProfilePage(userId, 'Student')

const handleSaveChanges = async () => {
  try {
    const saved = await submitProfile()
    if (saved) {
      notifications.showToast('success', t('common.save'), t('adminUserProfile.studentSaved'))
    }
  } catch {
    // Ошибка уже обработана глобальным API-клиентом
  }
}

const handleNotFound = () => {
  notifications.showToast('error', t('adminUserProfile.notFoundTitle'), t('adminUserProfile.studentNotFound'))
  router.push({ name: 'admin-users' })
}
</script>

<template>
  <div class="profile-page">
    <div class="breadcrumbs">
      <span class="crumb">{{ t('adminUserProfile.users') }}</span> <span class="separator">/</span>
      <span class="crumb">{{ t('adminUserProfile.students') }}</span> <span class="separator">/</span>
      <span class="crumb active">{{ profileDraft?.fullName || t('common.loading') }}</span>
    </div>

    <div class="profile-container">
      <Message v-if="profileQuery.isError.value" severity="error" :closable="false">
        {{ t('adminUserProfile.loadError') }}
        <Button
          class="ml-3"
          size="small"
          :label="t('adminUserProfile.backToUsers')"
          @click="handleNotFound"
        />
      </Message>

      <Message v-else-if="isRoleMismatch" severity="warn" :closable="false">
        {{ t('adminUserProfile.roleMismatch') }}
        <Button
          class="ml-3"
          size="small"
          :label="t('adminUserProfile.backToUsers')"
          @click="router.push({ name: 'admin-users' })"
        />
      </Message>

      <div v-else-if="isLoading || !profileDraft" class="flex flex-col gap-4">
        <Skeleton width="100%" height="150px" borderRadius="12px" class="mb-4" />
        <Skeleton width="100%" height="300px" borderRadius="12px" />
      </div>

      <form v-else class="content-column" @submit.prevent="handleSaveChanges">
        <ProfileInfoCard
          v-model="profileDraft"
          :field-errors="errors"
          :group-options="groupOptions"
        />

        <SecuritySettingsCard v-model="profileDraft" mode="manage" :show-mfa="false" />

        <div class="form-actions">
          <Button
            type="button"
            :label="t('common.cancel')"
            outlined
            :disabled="isSaving || !hasChanges"
            @click="resetDraft"
          />
          <Button
            type="submit"
            :label="t('common.saveChanges')"
            icon="pi pi-check"
            :loading="isSaving"
            :disabled="!hasChanges"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding-bottom: 2rem;
}
.breadcrumbs {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
}
.separator {
  margin: 0 0.5rem;
  color: var(--surface-border);
}
.crumb.active {
  color: var(--text-color);
  font-weight: 500;
}
.profile-container {
  max-width: 900px;
}
.content-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.ml-3 {
  margin-left: 0.75rem;
}
</style>
