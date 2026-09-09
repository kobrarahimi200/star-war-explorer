<script setup lang="ts">
import type { Person } from '@/components/types/swapiTypes'

defineProps<{
  person: Person
}>()

defineEmits<{
  edit: [person: Person]
  delete: [id: string]
}>()
</script>

<template>
  <article class="person-card">
    <div class="person-info">
      <h3>{{ person.name }}</h3>
      <p>{{ person.gender }} · {{ person.height }}</p>
      <p>Birth year: {{ person.birth_year }}</p>
      <p>Homeworld: {{ person.homeworld }}</p>
    </div>

    <div class="card-actions">
      <button type="button" @click="$emit('edit', person)">Edit</button>
      <button type="button" class="delete-button" @click="$emit('delete', person.id)">Delete</button>
    </div>
  </article>
</template>

<style scoped>
.person-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.25rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.9rem;
}

.person-card h3 {
  margin: 0 0 0.35rem;
}

.person-card p {
  margin: 0.2rem 0;
  color: #4b5563;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-actions button {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
}

.delete-button {
  color: #b91c1c;
}
</style>
