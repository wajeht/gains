<script setup>
import { computed } from 'vue';
import useUserStore from '../../store/user.store';
const userStore = useUserStore();

const computedProfileImage = computed(() => {
  return userStore.user.profile_picture_url ?? `https://dummyimage.com/200x200/bdbdbd/000000.jpg`;
});
</script>
<template>
  <div
    id="dashboard-header"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- profile image -->
    <router-link
      :class="{ active: $route.name === 'Profile' }"
      :to="`/dashboard/profile/${userStore.user.username}`"
    >
      <img
        class="rounded-circle"
        width="30"
        height="30"
        :src="computedProfileImage"
        alt="profile-image"
      />
    </router-link>

    <!-- search -->
    <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." />

    <!-- settings -->
    <router-link :class="{ active: $route.name === 'Settings' }" to="/dashboard/settings">
      <font-awesome-icon class="fs-4" icon="gear" />
    </router-link>
  </div>
</template>

<style scoped>
.text-muted {
  color: #8c8c8c;
}

a {
  text-decoration: none;
  color: grey;
}

a:hover {
  color: #191919;
}

.active {
  text-decoration: none;
  color: #191919;
}
</style>
