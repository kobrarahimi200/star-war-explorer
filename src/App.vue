<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: #f5f5f7;
  color: #1f2937;
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  background: #f8fafc;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: #111827;
  color: white;
}

.header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
}

.nav {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-button {
  border: 0;
  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  transition: background 0.2s ease;
}

.nav-button.active,
.nav-button:hover {
  background: #facc15;
  color: #111827;
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 3rem;
}
</style>
