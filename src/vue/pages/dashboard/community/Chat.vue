<script setup>
import { reactive, onMounted } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '@utils/fetch-with-style';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import useUserStore from '../../../store/user.store';
import useAppStore from '../../../store/app.store';

dayjs.extend(relativeTime);

const userStore = useUserStore();
const appStore = useAppStore();

const states = reactive({
  alert: { type: '', msg: '' },
  conversations: [],
});

onMounted(async () => {
  appStore.loading = true;
  await getConversations();
  appStore.loading = false;
});

async function getConversations() {
  try {
    const res = await api.get(`/api/v1/messages?user_id=${userStore.user.id}`);
    const json = await res.json();

    if (res.status >= 500) {
      throw new Error('Server error. Please try again later!');
    }
    if (!res.ok) {
      throw json.errors || json.message;
    }

    states.conversations = json.data;
  } catch (e) {
    states.alert.type = 'danger';
    states.alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  }
}
</script>

<template>
  <Backheader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="states.alert.type" :class="`alert-${states.alert.type}`" class="mb-0 alert">
        <span>{{ states.alert.msg }}</span>
      </div>

      <!-- conversations list -->
      <div class="list-group">
        <router-link
          v-for="conv in states.conversations"
          :key="conv.user.id"
          :to="`/dashboard/chat/${conv.user.id}`"
          class="list-group-item list-group-item-action d-flex gap-3 align-items-center py-3"
        >
          <!-- avatar -->
          <img
            :src="
              conv.user.profile_picture_url || 'https://dummyimage.com/200x200/bdbdbd/000000.jpg'
            "
            class="rounded-circle"
            style="width: 50px; height: 50px; object-fit: cover"
          />

          <!-- content -->
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="m-0">{{ conv.user.username }}</h6>
              <small class="text-muted">{{ dayjs(conv.lastMessage?.created_at).fromNow() }}</small>
            </div>
            <p class="text-muted m-0 text-truncate" style="max-width: 250px">
              <small>
                <span v-if="conv.lastMessage?.sender_id === userStore.user.id">You: </span>
                {{ conv.lastMessage?.content }}
              </small>
            </p>
          </div>

          <!-- unread badge -->
          <span v-if="conv.unreadCount > 0" class="badge bg-primary rounded-pill">
            {{ conv.unreadCount }}
          </span>
        </router-link>

        <!-- empty state -->
        <div v-if="!states.conversations.length" class="list-group-item text-center py-4">
          <small class="text-muted">No conversations yet</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #191919;
  text-decoration: none;
}
a:hover {
  background-color: #f8f9fa;
}
</style>
