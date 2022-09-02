<script setup></script>

<template>
  <ul class="nav nav-tabs border-0">
    <li class="nav-item">
      <router-link
        class="nav-link"
        :class="{ active: $route.name === 'Exercises' }"
        to="/dashboard/sessions/exercises"
      >
        <h5 class="mb-0"><font-awesome-icon icon="fa-dumbbell" class="p-0 m-0" /> Exercises</h5>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :class="{ active: $route.name === 'Categories' }"
        to="/dashboard/sessions/categories"
      >
        <h5 class="mb-0"><i class="bi bi-tags-fill"></i> Categories</h5>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :class="{ active: $route.name === 'Blocks' }"
        to="/dashboard/sessions/blocks"
      >
        <h5 class="mb-0"><i class="bi bi-bricks"></i> Blocks</h5>
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.nav-link {
  color: #212529;
}

.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  background: #212529;
  color: white;
}

.nav-link:hover {
  background: #6c757d;
  color: white;
}

.nav-link.active:hover {
  text-decoration: none;
}
</style>
