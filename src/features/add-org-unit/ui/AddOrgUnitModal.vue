<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import type { OrgTreeNode, TreeHierarchyType } from '@/entities/organization'
import { useNotifications } from '@/shared/model'

import { canAddOrgUnit, resolveChildType } from '../lib/resolveChildType'
import type { AddOrgUnitFormValues } from '../lib/schema'
import { useCreateOrgUnit } from '../model/useCreateOrgUnit'
import AddOrgUnitForm from './AddOrgUnitForm.vue'

const props = defineProps<{
  parentNode: OrgTreeNode | null
  hierarchyType: TreeHierarchyType
}>()

const emit = defineEmits<{
  created: [node: OrgTreeNode]
}>()

const { t } = useI18n()
const notifications = useNotifications()
const createOrgUnitMutation = useCreateOrgUnit()

const isVisible = ref(false)
const formRef = ref<InstanceType<typeof AddOrgUnitForm> | null>(null)

const childType = computed(() => resolveChildType(props.parentNode, props.hierarchyType))

const canCreate = computed(() => canAddOrgUnit(props.parentNode, props.hierarchyType))

const typeKey = (type: string) => `adminOrgUnitModal.${type}` as const

const labels = computed(() => {
  const unitType = t(typeKey(childType.value))
  const parentType = props.parentNode
    ? t(typeKey(props.parentNode.type))
    : t('adminOrg.rootOrganization')

  return {
    modalTitle: t('adminOrg.addTitle', { type: unitType }),
    parentLabel: t('adminOrg.parentLabel', { type: parentType }),
    btnLabel: t('adminOrg.createLabel', { type: unitType })
  }
})

const parentIcon = computed(() => {
  if (!props.parentNode) {
    return 'pi-building text-blue-500'
  }

  const icons: Record<string, string> = {
    faculty: 'pi-building text-blue-500',
    department: 'pi-folder text-blue-400',
    fieldOfStudy: 'pi-compass text-purple-500',
    group: 'pi-users text-gray-500'
  }

  return icons[props.parentNode.type] || 'pi-folder'
})

const openModal = () => {
  if (!canCreate.value) {
    return
  }

  formRef.value?.reset()
  isVisible.value = true
}

defineExpose({ openModal, canCreate })

watch(isVisible, (visible) => {
  if (!visible) {
    formRef.value?.reset()
  }
})

const closeModal = () => {
  isVisible.value = false
}

const handleSave = () => {
  formRef.value?.submit()
}

const handleSubmit = async (form: AddOrgUnitFormValues) => {
  try {
    const createdNode = await createOrgUnitMutation.mutateAsync({
      childType: childType.value,
      form,
      parentNode: props.parentNode
    })

    emit('created', createdNode)
    notifications.showToast(
      'success',
      t('adminOrg.toastCreated'),
      t('adminOrg.toastCreatedDetail', { name: createdNode.label })
    )
    closeModal()
  } catch {
    // api client already shows error toast
  }
}
</script>

<template>
  <Dialog v-model:visible="isVisible" modal :style="{ width: '450px' }" class="add-unit-dialog">
    <template #header>
      <h2 class="dialog-title">{{ labels.modalTitle }}</h2>
    </template>

    <div class="form-layout">
      <div class="form-field">
        <label>{{ labels.parentLabel }}</label>
        <div class="disabled-input">
          <i class="pi" :class="parentIcon"></i>
          <span>{{ parentNode ? parentNode.label : t('adminOrg.rootOrganization') }}</span>
        </div>
      </div>

      <AddOrgUnitForm ref="formRef" :child-type="childType" @submit="handleSubmit" />
    </div>

    <template #footer>
      <div class="footer-actions">
        <Button
          :label="t('common.cancel')"
          text
          class="cancel-btn"
          :disabled="createOrgUnitMutation.isPending.value"
          @click="closeModal"
        />
        <Button
          :label="labels.btnLabel"
          class="submit-btn"
          :loading="createOrgUnitMutation.isPending.value"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.form-layout {
  display: flex;
  flex-direction: column;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.disabled-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-color-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border-subtle);
  width: 100%;
}

.cancel-btn {
  color: var(--text-color-muted);
}

.submit-btn {
  background: var(--color-primary);
  border: none;
  color: var(--color-on-primary);
}
</style>
