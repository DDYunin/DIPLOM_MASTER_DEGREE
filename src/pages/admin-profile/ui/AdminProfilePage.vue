<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'

import { type User } from '@/entities/user'
import { createOwnProfileEmailSchema, useOwnProfile } from '@/features/own-profile'
import { useNotifications } from '@/shared/model/useNotifications'

import { ProfileInfoCard } from '@/widgets/profile-info-card'
import { SecuritySettingsCard } from '@/widgets/security-settings-card'

const { t } = useI18n()
const notifications = useNotifications()

const { userId, profileQuery, updateEmailMutation, changePasswordMutation } = useOwnProfile()

const profileDraft = ref<User | null>(null)
const securityCardRef = ref<InstanceType<typeof SecuritySettingsCard> | null>(null)

const validationSchema = computed(() => toTypedSchema(createOwnProfileEmailSchema(t)))

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema,
  initialValues: { email: '' }
})

const [email, emailAttrs] = defineField('email')

watch(
  () => profileQuery.data.value,
  (profile) => {
    if (profile) {
      profileDraft.value = { ...profile }
      resetForm({ values: { email: profile.email } })
    }
  },
  { immediate: true }
)

watch(email, (nextEmail) => {
  if (profileDraft.value) {
    profileDraft.value.email = nextEmail
  }
})

const isLoading = computed(() => profileQuery.isPending.value)
const isSaving = computed(() => updateEmailMutation.isPending.value)
const isPasswordUpdating = computed(() => changePasswordMutation.isPending.value)

const hasEmailChanges = computed(() => {
  if (!profileQuery.data.value) {
    return false
  }

  return email.value.trim() !== profileQuery.data.value.email
})

const resetDraft = () => {
  if (profileQuery.data.value) {
    profileDraft.value = { ...profileQuery.data.value }
    resetForm({ values: { email: profileQuery.data.value.email } })
  }
}

const handleSaveChanges = handleSubmit(async (formValues) => {
  if (!hasEmailChanges.value) {
    return
  }

  try {
    await updateEmailMutation.mutateAsync(formValues.email.trim())
    notifications.showToast('success', t('common.save'), t('adminProfile.saved'))
  } catch {
    // Ошибка уже обработана глобальным API-клиентом
  }
})

const handleUpdatePassword = async (payload: { oldPassword: string; newPassword: string }) => {
  try {
    await changePasswordMutation.mutateAsync(payload)
    securityCardRef.value?.clearPasswordFields()
    notifications.showToast('success', t('common.success'), t('adminProfile.passwordUpdated'))
  } catch {
    // Ошибка уже обработана глобальным API-клиентом
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('adminProfile.title') }}</h1>
    </div>

    <div class="profile-container">
      <div class="sub-header">
        <h2 class="sub-title">{{ t('adminProfile.generalConfig') }}</h2>
        <p class="sub-desc">{{ t('adminProfile.generalDesc') }}</p>
      </div>

      <Message v-if="!userId" severity="error" :closable="false">
        {{ t('adminProfile.noUserId') }}
      </Message>

      <Message v-else-if="profileQuery.isError.value" severity="error" :closable="false">
        {{ t('adminProfile.loadError') }}
      </Message>

      <div v-else-if="isLoading || !profileDraft" class="content-column">
        <Skeleton width="100%" height="300px" borderRadius="12px" />
        <Skeleton width="100%" height="200px" borderRadius="12px" />
      </div>

      <form v-else class="content-column" @submit.prevent="handleSaveChanges">
        <ProfileInfoCard
          v-model="profileDraft"
          variant="own-profile"
          :email-error="errors.email"
          :email-input-attrs="emailAttrs"
        />

        <SecuritySettingsCard
          ref="securityCardRef"
          v-model="profileDraft"
          mode="self"
          :password-loading="isPasswordUpdating"
          @update-password="handleUpdatePassword"
        />

        <div class="form-actions">
          <Button
            type="button"
            :label="t('common.cancel')"
            outlined
            class="btn-cancel"
            :disabled="isSaving || !hasEmailChanges"
            @click="resetDraft"
          />
          <Button
            type="submit"
            :label="t('common.saveChanges')"
            class="btn-save"
            icon="pi pi-check"
            :loading="isSaving"
            :disabled="!hasEmailChanges"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding-bottom: 2rem;
}
.page-header {
  margin-bottom: 2rem;
}
.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}
.profile-container {
  max-width: 900px;
}
.sub-header {
  margin-bottom: 1.5rem;
}
.sub-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}
.sub-desc {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
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
</style>
