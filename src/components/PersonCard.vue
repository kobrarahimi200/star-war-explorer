<script setup lang="ts">
import type { Person } from '@/components/types/swapiTypes'

defineProps<{
  person: Person
}>()
</script>

<template>
  <article class="person-card">
    <div class="person-info">
      <h3>{{ person.name }}</h3>

      <p>{{ person.gender }} · {{ person.height }}</p>

      <p>
        Homeworld: {{ person.homeworld }}
      </p>
    </div>

    <button
        type="button"
        class="favorite-button"
        aria-label="Add to favorites"
    >
      ☆
    </button>
  </article>
</template>