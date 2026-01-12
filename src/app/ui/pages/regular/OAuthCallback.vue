<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUserStore from '../../store/user.store.js';
import useAppStore from '../../store/app.store.js';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();

onMounted(() => {
  const userData = route.query.user;
  const appVersion = route.query.appVersion;

  if (userData) {
    try {
      const user = JSON.parse(decodeURIComponent(userData));

      appStore.appVersion = appVersion;
      userStore.isLoggedIn = true;
      userStore.setUserInfo(user);

      const socketUserInfo = {
        ...user,
        agent: navigator.userAgent,
        socket_id: window.socket?.id,
      };

      if (window.socket) {
        window.socket.emit('onlineUser', socketUserInfo);
      }

      if (appStore.redirect_url) {
        router.push({ path: appStore.redirect_url });
        appStore.redirect_url = null;
        return;
      }

      if (user?.role === 'admin') {
        router.push({ path: '/admin' });
      } else {
        router.push({ path: `/dashboard/profile/${user.username}` });
      }
    } catch (e) {
      console.error('Failed to parse user data:', e);
      router.push({ path: '/login?error=parse_failed' });
    }
  } else {
    router.push({ path: '/login?error=no_user_data' });
  }
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Logging you in...</p>
    </div>
  </div>
</template>
