import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, unref, watch, type MaybeRef } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  createOwnProfileSettingsSchema,
  getOwnProfileSettingsInitialValues,
  hasOwnProfileSettingsChanges
} from '../lib/schema'

export const useOwnProfileSettingsForm = (currentEmail: MaybeRef<string | undefined>) => {
  const { t } = useI18n()

  const validationSchema = computed(() =>
    toTypedSchema(createOwnProfileSettingsSchema(t, unref(currentEmail)))
  )

  const { defineField, errors, handleSubmit, resetForm, values } = useForm({
    validationSchema,
    initialValues: getOwnProfileSettingsInitialValues()
  })

  const [newEmail, newEmailAttrs] = defineField('newEmail')
  const [confirmNewEmail, confirmNewEmailAttrs] = defineField('confirmNewEmail')
  const [currentPassword, currentPasswordAttrs] = defineField('currentPassword')
  const [newPassword, newPasswordAttrs] = defineField('newPassword')
  const [confirmNewPassword, confirmNewPasswordAttrs] = defineField('confirmNewPassword')

  const hasEmailChanges = computed(() => values.newEmail.trim().length > 0)
  const hasPasswordChanges = computed(
    () =>
      values.currentPassword.length > 0 ||
      values.newPassword.length > 0 ||
      values.confirmNewPassword.length > 0
  )
  const hasChanges = computed(() => hasOwnProfileSettingsChanges(values))

  const resetSettingsForm = () => {
    resetForm({ values: getOwnProfileSettingsInitialValues() })
  }

  watch(
    () => unref(currentEmail),
    () => {
      resetSettingsForm()
    }
  )

  return {
    errors,
    handleSubmit,
    hasChanges,
    hasEmailChanges,
    hasPasswordChanges,
    resetSettingsForm,
    newEmail,
    newEmailAttrs,
    confirmNewEmail,
    confirmNewEmailAttrs,
    currentPassword,
    currentPasswordAttrs,
    newPassword,
    newPasswordAttrs,
    confirmNewPassword,
    confirmNewPasswordAttrs
  }
}
