<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import InputText from 'primevue/inputtext'

import type { OrgUnitType } from '@/entities/organization'
import { createAddOrgUnitSchema, getAddOrgUnitInitialValues } from '../lib/schema'

const props = defineProps<{
  childType: OrgUnitType
}>()

const emit = defineEmits<{
  submit: [values: ReturnType<typeof getAddOrgUnitInitialValues>]
}>()

const { t } = useI18n()

const validationSchema = computed(() =>
  toTypedSchema(createAddOrgUnitSchema(t, props.childType))
)

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema,
  initialValues: getAddOrgUnitInitialValues()
})

const [name, nameAttrs] = defineField('name')
const [shortName, shortNameAttrs] = defineField('shortName')

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})

const reset = () => {
  resetForm({ values: getAddOrgUnitInitialValues() })
}

defineExpose({ submit: onSubmit, reset })
</script>

<template>
  <form class="form-layout" @submit.prevent="onSubmit">
    <div class="form-field">
      <label for="orgUnitName">{{ t('adminOrg.nameLabel', { type: t(`adminOrgUnitModal.${childType}`) }) }}</label>
      <InputText
        id="orgUnitName"
        v-model="name"
        v-bind="nameAttrs"
        :placeholder="t('adminOrg.namePlaceholder')"
        :invalid="!!errors.name"
        autofocus
      />
      <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
    </div>

    <div v-if="childType === 'faculty'" class="form-field mt-3">
      <label for="orgUnitShortName">{{ t('adminOrg.shortName') }}</label>
      <InputText
        id="orgUnitShortName"
        v-model="shortName"
        v-bind="shortNameAttrs"
        :placeholder="t('adminOrg.codePlaceholder')"
        :invalid="!!errors.shortName"
      />
      <small v-if="errors.shortName" class="field-error">{{ errors.shortName }}</small>
    </div>
  </form>
</template>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-error {
  color: var(--color-danger, #ef4444);
  font-size: 0.75rem;
}

.mt-3 {
  margin-top: 1rem;
}

:deep(.p-inputtext) {
  width: 100%;
}
</style>
