<script setup>
import useUserStore from '../../../store/user.store';
const userStore = useUserStore();
</script>

<template>
  <div
    id="dashboard-home-header"
    style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- profile view -->
    <router-link
      :to="`/dashboard/profile/${userStore.user.username}`"
      class="link-secondary"
      role="button"
    >
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="user" />
        <span>My profile</span>
      </h5>
    </router-link>

    <!-- chat -->
    <router-link to="/dashboard/community/chat">
      <i class="bi bi-chat" style="font-size: 20px"></i>
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
