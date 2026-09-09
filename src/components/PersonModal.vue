<script setup lang="ts">
import {reactive, watch} from 'vue'
import {useSwapiStore} from '@/stores/useSwapiStore'
import type {FormField, Person} from '@/types/swapi'

const props = defineProps<{
  isOpen: boolean
  personToEdit: Person | null
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useSwapiStore()

const form = reactive({
  id: '' as string | undefined,
  name: '',
  height: '',
  mass: '',
  gender: '',
  birth_year: '',
})

const errors = reactive<Record<FormField, string>>({
  name: '',
  height: '',
  mass: '',
  gender: '',
  birth_year: '',
})

const resetForm = (): void => {
  form.id = props.personToEdit?.id
  form.name = props.personToEdit?.name ?? ''
  form.height = props.personToEdit?.height ?? ''
  form.mass = props.personToEdit?.mass ?? ''
  form.gender = props.personToEdit?.gender ?? ''
  form.birth_year = props.personToEdit?.birth_year ?? ''
  Object.keys(errors).forEach((field) => {
    errors[field as FormField] = ''
  })
}

watch(
    () => [props.isOpen, props.personToEdit] as const,
    ([isOpen]) => {
      if (isOpen) resetForm()
    },
    {immediate: true},
)

const clearError = (field: FormField): void => {
  errors[field] = ''
}

const validate = (): boolean => {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  errors.gender = form.gender ? '' : 'Gender is required.'

  const numericValue = (value: string): boolean =>
      value === '' ||
      value.toLowerCase() === 'unknown' ||
      (/^\d+(\.\d+)?$/.test(value) && Number(value) > 0)
  errors.height = numericValue(form.height)
      ? ''
      : 'Height must be a positive number or "unknown".'
  errors.mass = numericValue(form.mass)
      ? ''
      : 'Mass must be a positive number or "unknown".'

  const birthYearValue = form.birth_year.trim()
  errors.birth_year =
      birthYearValue === '' ||
      birthYearValue.toLowerCase() === 'unknown' ||
      /^\d+(BBY|ABY)$/i.test(birthYearValue)
          ? ''
          : 'Use a value such as 19BBY or 4ABY.'

  return Object.values(errors).every((error) => !error)
}

const submit = (): void => {
  if (!validate()) return

  store.savePerson({
    id: form.id,
    name: form.name,
    height: form.height,
    mass: form.mass,
    gender: form.gender,
    birth_year: form.birth_year,
    homeworld: props.personToEdit?.homeworld,
    starships: props.personToEdit?.starships,
    films: props.personToEdit?.films,
  })
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
       @click.self="emit('close')">
    <form class="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl" @submit.prevent="submit">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">{{ personToEdit ? 'Edit Character' : 'Add Character' }}</h2>
        <button type="button" class="text-2xl text-gray-500" aria-label="Close" @click="emit('close')">×</button>
      </div>

      <label class="block">
        <span class="mb-1 block text-sm font-medium">Name</span>
        <input
            v-model="form.name"
            required
            aria-required="true"
            :aria-invalid="Boolean(errors.name)"
            :aria-describedby="errors.name ? 'name-error' : undefined"
            class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            :class="errors.name ? 'border-red-500' : 'border-gray-300'"
            @blur="validate"
            @input="clearError('name')"
        />
        <p v-if="errors.name" id="name-error" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </p>
      </label>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-sm font-medium">Height</span>
          <input
              v-model="form.height"
              inputmode="decimal"
              placeholder="172 or unknown"
              class="w-full rounded-lg border px-3 py-2"
              :class="errors.height ? 'border-red-500' : 'border-gray-300'"
              @blur="validate"
              @input="clearError('height')"
          />
          <p v-if="errors.height" class="mt-1 text-sm text-red-600">{{ errors.height }}</p>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium">Mass</span>
          <input
              v-model="form.mass"
              inputmode="decimal"
              placeholder="77 or unknown"
              class="w-full rounded-lg border px-3 py-2"
              :class="errors.mass ? 'border-red-500' : 'border-gray-300'"
              @blur="validate"
              @input="clearError('mass')"
          />
          <p v-if="errors.mass" class="mt-1 text-sm text-red-600">{{ errors.mass }}</p>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium">Gender</span>
          <select
              v-model="form.gender"
              required
              class="w-full rounded-lg border px-3 py-2"
              :class="errors.gender ? 'border-red-500' : 'border-gray-300'"
              @change="clearError('gender')"
          >
            <option disabled value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="hermaphrodite">Hermaphrodite</option>
            <option value="n/a">N/A</option>
          </select>
          <p v-if="errors.gender" class="mt-1 text-sm text-red-600">{{ errors.gender }}</p>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium">Birth year</span>
          <input
              v-model="form.birth_year"
              placeholder="19BBY or unknown"
              class="w-full rounded-lg border px-3 py-2"
              :class="errors.birth_year ? 'border-red-500' : 'border-gray-300'"
              @blur="validate"
              @input="clearError('birth_year')"
          />
          <p v-if="errors.birth_year" class="mt-1 text-sm text-red-600">{{ errors.birth_year }}</p>
        </label>
      </div>

      <div class="flex justify-end gap-3">
        <button type="button" class="rounded-lg border px-4 py-2" @click="emit('close')">Cancel</button>
        <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Save
        </button>
      </div>
    </form>
  </div>
</template>
