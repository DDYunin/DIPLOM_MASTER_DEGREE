# Form Validation Rules

Use **vee-validate** together with **Zod** for all user-facing form validation in this project.

## Required stack

- `vee-validate` — form state, field binding, submit handling
- `@vee-validate/zod` — bridge between Zod schemas and vee-validate
- `zod` — schema definition and validation rules

Do **not** implement manual validation with `if/else`, toast-only checks, or ad-hoc regex unless there is a documented exception.

## File structure (FSD)

Place validation code inside the feature slice that owns the form:

```
features/<feature-name>/
  lib/
    schema.ts          # Zod schemas, initial values, exported form value types
    schema.spec.ts     # unit tests for schemas
  model/
    use<Feature>Form.ts  # optional composable wrapping useForm + defineField
  ui/
    <Feature>Form.vue    # binds fields via defineField + shows errors
```

Widgets and pages may consume schemas/composables from `features`, but should not define validation logic inline.

## Schema conventions

- Export typed form values: `export type XFormValues = { ... }`
- Export factory functions with i18n: `createXSchema(t: (key: string) => string)`
- Export initial values helper: `getXInitialValues()`
- Keep error messages in i18n keys; pass `t` into schema factories
- Use `superRefine` for cross-field rules (confirm password, role-dependent fields, optional sections)

Example:

```ts
export const createExampleSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().min(1, t('errors.required')).email(t('errors.invalidEmail'))
  })
```

## Component conventions

- Use `useForm({ validationSchema: computed(() => toTypedSchema(createXSchema(t))), initialValues })`
- Bind fields with `defineField` and spread `*Attrs` onto inputs
- Show inline errors with `:invalid="!!errors.fieldName"` and `<small class="field-error">`
- Submit through `handleSubmit((values) => { ... })`, not raw `@click` handlers with manual checks
- Reset with `resetForm({ values: getXInitialValues() })`

## Testing

- Add `schema.spec.ts` next to `schema.ts`
- Cover happy path, required fields, cross-field validation, and role/conditional rules
- Component tests should focus on rendering and submit wiring; keep rule coverage in schema tests

## Existing references

- `src/features/add-user/lib/schema.ts` + `AddUserForm.vue`
- `src/features/add-org-unit/lib/schema.ts` + `AddOrgUnitForm.vue`
- `src/features/own-profile/lib/schema.ts` — profile email/password settings
