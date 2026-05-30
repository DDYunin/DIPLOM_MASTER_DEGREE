import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref, watch, type MaybeRef, unref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { User, UserRole } from '@/entities/user'

import { buildUpdateUserByAdminPayload, hasUpdateUserByAdminChanges } from '../lib/build-update-payload'
import { createAdminUserProfileSchema, mapUserToAdminProfileFormValues } from '../lib/schema'
import { useAdminUserProfile } from './useAdminUserProfile'

export const useAdminManagedUserProfilePage = (
  userId: MaybeRef<string>,
  expectedRole: MaybeRef<UserRole>
) => {
  const { t } = useI18n()
  const { profileQuery, updateMutation, departmentOptions, groupOptions, isRoleMismatch } =
    useAdminUserProfile(userId, expectedRole)

  const profileDraft = ref<User | null>(null)
  const originalProfile = ref<User | null>(null)

  const validationSchema = computed(() =>
    toTypedSchema(createAdminUserProfileSchema(t, unref(expectedRole)))
  )

  const { errors, validate, resetForm, setValues } = useForm({
    validationSchema,
    initialValues: mapUserToAdminProfileFormValues({
      email: '',
      firstName: '',
      lastName: ''
    })
  })

  const syncDraftFromQuery = (profile: User) => {
    profileDraft.value = { ...profile }
    originalProfile.value = { ...profile }
    resetForm({ values: mapUserToAdminProfileFormValues(profile) })
  }

  watch(
    () => profileQuery.data.value,
    (profile) => {
      if (profile) {
        syncDraftFromQuery(profile)
      }
    },
    { immediate: true }
  )

  const hasChanges = computed(() => {
    if (!profileDraft.value || !originalProfile.value) {
      return false
    }

    return hasUpdateUserByAdminChanges(
      buildUpdateUserByAdminPayload(profileDraft.value, originalProfile.value)
    )
  })

  const resetDraft = () => {
    if (originalProfile.value) {
      syncDraftFromQuery(originalProfile.value)
    }
  }

  const submitProfile = async (): Promise<boolean> => {
    if (!profileDraft.value || !originalProfile.value) {
      return false
    }

    setValues(mapUserToAdminProfileFormValues(profileDraft.value))
    const { valid } = await validate()

    if (!valid) {
      return false
    }

    const payload = buildUpdateUserByAdminPayload(profileDraft.value, originalProfile.value)

    if (!hasUpdateUserByAdminChanges(payload)) {
      return false
    }

    await updateMutation.mutateAsync(payload)
    return true
  }

  return {
    profileQuery,
    updateMutation,
    departmentOptions,
    groupOptions,
    isRoleMismatch,
    profileDraft,
    isLoading: computed(() => profileQuery.isPending.value),
    isSaving: computed(() => updateMutation.isPending.value),
    hasChanges,
    errors,
    resetDraft,
    submitProfile
  }
}
