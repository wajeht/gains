<script setup>
import useAppStore from '../../store/app.store.js';
import useUserStore from '../../store/user.store.js';

const appStore = useAppStore();
const userStore = useUserStore();

const admin = userStore.user.role === 'admin' && userStore.isLoggedIn;
</script>

<template>
  <header class="py-3 mb-4 border-bottom sticky-top" style="backdrop-filter: blur(10px)">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- branding -->
      <router-link
        to="/"
        class="d-flex link-dark text-decoration-none justify-content-between align-items-center"
      >
        <!-- logo -->
        <svg
          class="bi me-2"
          height="32"
          viewBox="0 0 125 125"
          width="32"
          :style="`${
            appStore.darkMode
              ? 'border: 1px solid #383d3f; overflow: hidden; display: inline-block; -webkit-border-radius: 50%; -moz-border-radius: 50%; border-radius: 50%; -khtml-border-radius: 50%; background-color: #BDBBB5;'
              : ''
          }`"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m125 62.5c-34.5 0-62.5 28-62.5 62.5s28 62.5 62.5 62.5 62.5-28 62.5-62.5-28-62.5-62.5-62.5zm43.6 87.8c-2.3 3.3-5.7 5.9-9.4 7.6-3.6 1.6-7.8 1.8-7.8 1.7-.6-.4-.5 1.1-7.9 7.5-2.7 2.3-5.8 4.2-9.2 5.5-2.4 1-5 1.7-7.6 1.9-6.2.4-16-2.4-19.2-3.3-3.1-.9-6.3-1.9-9.2-3.2-1.2-.5-2.3-1.1-3.4-1.8 0 0-.1 0-.1-.1-.1-.1-.2-.1-.3-.2-.2-.1-.3-.3-.5-.4-.1-.1-.1-.1-.2-.2-.2-.3-.4-.6-.5-.8-2.3-4.3-2.4-9.6-1.9-14.3.6-5.1 2.1-10 3.9-14.7 2-5.3 4.2-10.5 6.6-15.6 2.3-4.9 4.7-9.7 6.8-14.6 1.5-3.6 2.7-7.2 3.6-11 .4-1.8.7-3.6.9-5.5.2-1.7.2-3.5.4-5.2.4-2.8 1.4-5.7 4.1-6.8 6.8-2.6 17.3-.5 18.3.7 1.1 1.4.3 3.6.1 5.2-.1 1.1-.1 2.1.1 3.2.2 1.2 1 2.1 1.4 3.2.7 2.2-2 4.5-3.5 5.7-2.2 1.6-4.8 2.5-7.4 3.4-2 .7-3.7 1.4-4.4 3.7-.2.8-.3 1.7-.4 2.5-.2 1.4-.5 2.8-.8 4.1-.6 2.8-1.1 5.6-1.5 8.4-.4 2.5-.9 5-1.1 7.5-.2 2.1.1 4.2.2 6.2.2 6.1-.5 12.6-4.4 17.6-1.2 1.5-.8 1.4-2.3 2.5-1.4 1 6.2-.9 8.9-11.4.1 0 .1-.1.2-.1 2.9-2.3 4.5-4.4 9.3-6.1 8.2-3 13.7-1.7 12.2-2.6-.9-.6-1.9-.7-2.9-.7 2.5-3.9 5.5-7.5 9.7-9.8 1.8-1 3.9-1.7 5.9-2.2 1.8-.4 3.9-.5 5.6.4 6.7 3.6 9.8 6.4 11.5 10.9 3 7 .7 14.9-3.8 21.2z"
            transform="translate(-62 -62)"
          />
        </svg>

        <!-- title -->
        <span class="fs-4">Gains</span>
      </router-link>

      <!-- nav -->
      <div id="nav">
        <!-- links -->
        <ul id="links" class="nav nav-pills">
          <!-- features -->
          <li class="nav-item">
            <router-link
              to="/features"
              class="nav-link link-dark"
              :class="{ active: $route.name === 'Features' }"
              >Features</router-link
            >
          </li>

          <!-- contact -->
          <li class="nav-item">
            <router-link
              to="/contact"
              class="nav-link link-dark"
              :class="{ active: $route.name === 'Contact' }"
              >Contact</router-link
            >
          </li>

          <!-- admin -->
          <li v-if="admin" class="nav-item">
            <router-link
              to="/admin"
              class="nav-link link-dark"
              :class="{ active: $route.path.includes('/admin') }"
              >Admin</router-link
            >
          </li>

          <!-- app -->
          <li v-if="userStore.isLoggedIn" class="nav-item">
            <router-link
              :to="`/dashboard/profile/${userStore.user.username}`"
              class="nav-link link-dark"
              >App</router-link
            >
          </li>

          <!-- login -->
          <li v-if="!userStore.isLoggedIn" class="nav-item">
            <router-link
              to="/login"
              class="nav-link link-dark"
              :class="{ active: $route.name === 'Login' }"
              >Login</router-link
            >
          </li>

          <!-- theme -->
          <li @click="appStore.changeTheme()" class="nav-item" role="button">
            <div class="nav-link link-dark">
              <span v-if="appStore.darkMode === true"><i class="bi bi-lightbulb-fill"></i></span>
              <span v-if="appStore.darkMode === false"><i class="bi bi-lightbulb"></i></span>
            </div>
          </li>
        </ul>

        <!-- mobile menu -->
        <!-- TODO! refactor this -->
        <div id="mobile-menu" class="dropdown">
          <span role="button" data-bs-toggle="dropdown">
            <h1 class="cursor-pointer"><i class="bi bi-list"></i></h1>
          </span>
          <ul class="dropdown-menu shadow">
            <!-- features -->
            <li class="nav-item">
              <router-link
                to="/features"
                class="nav-link link-dark dropdown-item"
                :class="{ active: $route.name === 'Features' }"
                >Features</router-link
              >
            </li>

            <!-- contact -->
            <li class="nav-item">
              <router-link
                to="/contact"
                class="nav-link link-dark dropdown-item"
                :class="{ active: $route.name === 'Contact' }"
                >Contact</router-link
              >
            </li>

            <!-- admin -->
            <li v-if="admin" class="nav-item">
              <router-link
                to="/admin"
                class="nav-link link-dark dropdown-item"
                :class="{ active: $route.path.includes('/admin') }"
                >Admin</router-link
              >
            </li>

            <!-- app -->
            <li v-if="userStore.isLoggedIn" class="nav-item">
              <router-link to="/login" class="nav-link link-dark dropdown-item">App</router-link>
            </li>

            <!-- login -->
            <li v-if="!userStore.isLoggedIn" class="nav-item">
              <router-link
                to="/login"
                class="nav-link link-dark dropdown-item"
                :class="{ active: $route.name === 'Login' }"
                >Login</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  background: #212529;
  color: white !important;
}

.nav-link:hover {
  background: #6c757d;
  color: white !important;
}

.nav-link.active:hover {
  text-decoration: none;
}

#mobile-menu {
  display: none;
}

@media screen and (max-width: 500px) {
  #mobile-menu {
    display: block;
  }

  #links {
    display: flex;
    flex-direction: column;
    display: none;
  }

  .dropdown-item.active,
  .dropdown-item:active {
    background: #212529;
    color: white;
  }
}
</style>
