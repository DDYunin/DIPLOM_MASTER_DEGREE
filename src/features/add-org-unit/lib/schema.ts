import { z } from 'zod'

import type { OrgUnitType } from '@/entities/organization'

export type AddOrgUnitFormValues = {
  name: string
  shortName: string
}

export const getAddOrgUnitInitialValues = (): AddOrgUnitFormValues => ({
  name: '',
  shortName: ''
})

export const createAddOrgUnitSchema = (t: (key: string) => string, childType: OrgUnitType) => {
  const baseSchema = z.object({
    name: z.string().trim().min(1, t('addOrgUnit.errors.required')),
    shortName: z.string().trim()
  })

  if (childType === 'faculty') {
    return baseSchema.extend({
      shortName: z.string().trim().min(1, t('addOrgUnit.errors.required'))
    })
  }

  return baseSchema
}
