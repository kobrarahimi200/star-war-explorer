<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useSwapiStore } from '@/stores/useSwapiStore'
import type { Person } from '@/types/swapi'

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

const errors = reactive({
  name: '',
})

const resetForm = (): void => {
  form.id = props.personToEdit?.id
  form.name = props.personToEdit?.name ?? ''
  form.height = props.personToEdit?.height ?? ''
  form.mass = props.personToEdit?.mass ?? ''
  form.gender = props.personToEdit?.gender ?? ''
  form.birth_year = props.personToEdit?.birth_year ?? ''
  errors.name = ''
}

watch(
  () => [props.isOpen, props.personToEdit] as const,
  ([isOpen]) => {
    if (isOpen) resetForm()
  },
  { immediate: true },
)

const validate = (): boolean => {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  return !errors.name
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
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="emit('close')">
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
          @input="errors.name = ''"
        />
        <p v-if="errors.name" id="name-error" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </p>
      </label>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label v-for="field in [
          { key: 'height', label: 'Height' },
          { key: 'mass', label: 'Mass' },
          { key: 'gender', label: 'Gender' },
          { key: 'birth_year', label: 'Birth year' },
        ]" :key="field.key" class="block">
          <span class="mb-1 block text-sm font-medium">{{ field.label }}</span>
          <input v-model="form[field.key as keyof typeof form]" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
      </div>

      <div class="flex justify-end gap-3">
        <button type="button" class="rounded-lg border px-4 py-2" @click="emit('close')">Cancel</button>
        <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Save</button>
      </div>
    </form>
  </div>
</template>
