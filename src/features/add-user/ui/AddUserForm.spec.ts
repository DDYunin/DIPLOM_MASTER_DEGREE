import { flushPromises } from '@vue/test-utils'
import Select from 'primevue/select'
import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'

import { ROLES } from '@/shared/config/roles'
import { renderWithApp } from '@/test/renderWithApp'

import AddUserForm from './AddUserForm.vue'
import type { AddUserFormValues } from '../lib/schema'

vi.mock('@/entities/organization', () => ({
  organizationApi: {
    fetchDepartmentsList: vi.fn().mockResolvedValue({
      items: [{ id: 1, name: 'Applied Math', facultyId: 1 }],
      page: 0,
      size: 500,
      totalElements: 1,
      totalPages: 1,
      hasNext: false
    }),
    fetchStudentGroupsList: vi.fn().mockResolvedValue({
      items: [{ id: 10, name: 'SE-23-01', facultyId: 1, fieldOfStudyId: 1 }],
      page: 0,
      size: 500,
      totalElements: 1,
      totalPages: 1,
      hasNext: false
    })
  }
}))

type AddUserFormExpose = {
  submit: () => Promise<void>
  reset: () => void
}

const mountForm = (active = true) =>
  renderWithApp(AddUserForm, {
    props: { active }
  })

const setSelectValue = async (wrapper: VueWrapper, selector: string, value: unknown) => {
  const select = wrapper.find(selector).findComponent(Select)
  await select.vm.$emit('update:modelValue', value)
}

const fillBaseFields = async (wrapper: VueWrapper) => {
  await wrapper.find('#username').setValue('s102344')
  await wrapper.find('#email').setValue('student.petrov@university.edu')
  await wrapper.find('#lastName').setValue('Petrov')
  await wrapper.find('#firstName').setValue('Ivan')
}

const submitForm = async (wrapper: VueWrapper) => {
  await (wrapper.vm as AddUserFormExpose).submit()
  await flushPromises()
}

describe('AddUserForm', () => {
  it('renders group and optional department fields for student by default', async () => {
    const wrapper = mountForm()
    await flushPromises()

    expect(wrapper.find('#group').exists()).toBe(true)
    expect(wrapper.find('#department').exists()).toBe(true)
    expect(wrapper.find('.optional-label').exists()).toBe(true)
  })

  it('hides department and group fields for admin role', async () => {
    const wrapper = mountForm()
    await flushPromises()

    await setSelectValue(wrapper, '#role', ROLES.ADMIN)
    await flushPromises()

    expect(wrapper.find('#group').exists()).toBe(false)
    expect(wrapper.find('#department').exists()).toBe(false)
  })

  it('shows required department and hides group for teacher role', async () => {
    const wrapper = mountForm()
    await flushPromises()

    await setSelectValue(wrapper, '#role', ROLES.TEACHER)
    await flushPromises()

    expect(wrapper.find('#department').exists()).toBe(true)
    expect(wrapper.find('.optional-label').exists()).toBe(false)
    expect(wrapper.find('#group').exists()).toBe(false)
  })

  it('shows validation errors when submitting an empty form', async () => {
    const wrapper = mountForm()

    await submitForm(wrapper)

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.findAll('.field-error').length).toBeGreaterThan(0)
  })

  it('emits submit with valid student payload', async () => {
    const wrapper = mountForm()
    await flushPromises()

    await fillBaseFields(wrapper)
    await setSelectValue(wrapper, '#group', 10)
    await submitForm(wrapper)

    const emitted = wrapper.emitted('submit')?.[0]?.[0] as AddUserFormValues | undefined

    expect(emitted).toEqual({
      username: 's102344',
      email: 'student.petrov@university.edu',
      firstName: 'Ivan',
      lastName: 'Petrov',
      middleName: '',
      role: ROLES.STUDENT,
      departmentId: null,
      groupId: 10
    })
  })

  it('resets form to initial values', async () => {
    const wrapper = mountForm()

    await fillBaseFields(wrapper)
    ;(wrapper.vm as AddUserFormExpose).reset()
    await flushPromises()

    expect((wrapper.find('#username').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('')
  })
})
