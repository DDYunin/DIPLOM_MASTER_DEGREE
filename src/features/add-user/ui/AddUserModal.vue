<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import { buildCreateAdminUserPayload } from '../lib/buildPayload'
import type { AddUserFormValues } from '../lib/schema'
import { useAddAdminUser } from '../model/useAddAdminUser'
import AddUserForm from './AddUserForm.vue'

const { t } = useI18n()

const visible = defineModel<boolean>('visible', { default: false })

const formRef = ref<InstanceType<typeof AddUserForm> | null>(null)
const addUserMutation = useAddAdminUser()

watch(visible, (isOpen) => {
  if (!isOpen) {
    formRef.value?.reset()
  }
})

const closeModal = () => {
  visible.value = false
}

const handleSave = () => {
  formRef.value?.submit()
}

const handleSubmit = async (values: AddUserFormValues) => {
  try {
    await addUserMutation.mutateAsync(buildCreateAdminUserPayload(values))
    closeModal()
  } catch {
    // Ошибка уже обработана в api client
  }
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="t('addUser.modalTitle')"
    :style="{ width: '520px' }"
    class="add-user-dialog"
  >
    <AddUserForm ref="formRef" :active="visible" @submit="handleSubmit" />

    <template #footer>
      <Button
        :label="t('common.cancel')"
        icon="pi pi-times"
        text
        class="cancel-btn"
        :disabled="addUserMutation.isPending.value"
        @click="closeModal"
      />
      <Button
        :label="t('addUser.saveUser')"
        icon="pi pi-check"
        :loading="addUserMutation.isPending.value"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.cancel-btn {
  color: var(--text-color-secondary);
}
</style>
