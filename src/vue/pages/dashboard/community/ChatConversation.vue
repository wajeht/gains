<script setup>
import { reactive, onMounted, ref, nextTick } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '@utils/fetch-with-style';
import dayjs from 'dayjs';

import useUserStore from '../../../store/user.store';
import useAppStore from '../../../store/app.store';

const props = defineProps({
  other_user_id: [String, Number],
});

const userStore = useUserStore();
const appStore = useAppStore();
const messagesContainer = ref(null);
const newMessage = ref('');
const sending = ref(false);

const states = reactive({
  alert: { type: '', msg: '' },
  messages: [],
  otherUser: null,
});

onMounted(async () => {
  appStore.loading = true;
  await getMessages();
  appStore.loading = false;
  scrollToBottom();
});

async function getMessages() {
  try {
    const res = await api.get(
      `/api/v1/messages/${props.other_user_id}?user_id=${userStore.user.id}`,
    );
    const json = await res.json();

    if (res.status >= 500) {
      throw new Error('Server error. Please try again later!');
    }
    if (!res.ok) {
      throw json.errors || json.message;
    }

    states.messages = json.data;

    // Get other user info
    const userRes = await api.get(`/api/v1/users/${props.other_user_id}`);
    const userJson = await userRes.json();
    states.otherUser = userJson.data[0];
  } catch (e) {
    states.alert.type = 'danger';
    states.alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || sending.value) return;

  try {
    sending.value = true;
    const res = await api.post('/api/v1/messages', {
      sender_id: userStore.user.id,
      recipient_id: props.other_user_id,
      content: newMessage.value.trim(),
    });
    const json = await res.json();

    if (!res.ok) {
      throw json.errors || json.message;
    }

    states.messages.push(json.data);
    newMessage.value = '';
    await nextTick();
    scrollToBottom();
  } catch (e) {
    states.alert.type = 'danger';
    states.alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  } finally {
    sending.value = false;
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function isMyMessage(msg) {
  // If sender is not the other user, it's my message
  return msg.sender_id != props.other_user_id;
}
</script>

<template>
  <Backheader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster d-flex flex-column"
    style="height: calc(100vh - 130px)"
  >
    <!-- alert -->
    <div v-if="states.alert.type" :class="`alert-${states.alert.type}`" class="alert mt-3">
      <span>{{ states.alert.msg }}</span>
    </div>

    <!-- header with user info -->
    <div v-if="states.otherUser" class="d-flex align-items-center gap-2 py-3 border-bottom">
      <img
        :src="
          states.otherUser.profile_picture_url || 'https://dummyimage.com/200x200/bdbdbd/000000.jpg'
        "
        class="rounded-circle"
        style="width: 40px; height: 40px; object-fit: cover"
      />
      <div>
        <h6 class="m-0">{{ states.otherUser.username }}</h6>
        <small class="text-muted"
          >{{ states.otherUser.first_name }} {{ states.otherUser.last_name }}</small
        >
      </div>
    </div>

    <!-- messages -->
    <div ref="messagesContainer" class="flex-grow-1 overflow-auto py-3">
      <div v-if="!states.messages.length" class="text-center text-muted py-5">
        <small>No messages yet. Start the conversation!</small>
      </div>

      <div
        v-for="msg in states.messages"
        :key="msg.id"
        class="d-flex mb-2"
        :class="isMyMessage(msg) ? 'justify-content-end' : 'justify-content-start'"
      >
        <div
          class="card px-3 py-2"
          :class="isMyMessage(msg) ? 'bg-dark' : ''"
          style="max-width: 75%"
        >
          <p class="m-0" :style="isMyMessage(msg) ? 'color: #fff' : 'color: #212529'">{{ msg.content }}</p>
          <small :style="isMyMessage(msg) ? 'color: #ccc' : 'color: #6c757d'" style="font-size: 0.7rem">
            {{ dayjs(msg.created_at).format('h:mm A') }}
          </small>
        </div>
      </div>
    </div>

    <!-- input -->
    <form @submit.prevent="sendMessage" class="py-3 border-top">
      <div class="input-group">
        <input
          v-model="newMessage"
          type="text"
          class="form-control"
          placeholder="Type a message..."
          :disabled="sending"
          maxlength="1000"
        />
        <button class="btn btn-dark" type="submit" :disabled="sending || !newMessage.trim()">
          <span v-if="sending" class="spinner-border spinner-border-sm"></span>
          <span v-else>Send</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.card {
  word-wrap: break-word;
}
</style>
