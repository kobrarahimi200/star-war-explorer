<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="app-shell">
    <AppHeader/>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <RouterView/>
    </main>
  </div>
</template>
