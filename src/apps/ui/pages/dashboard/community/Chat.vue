<script setup>
import { reactive, onMounted } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../utils/fetch-with-style';

import useUserStore from '../../../store/user.store';
import useAppStore from '../../../store/app.store';

const userStore = useUserStore();
const appStore = useAppStore();

const states = reactive({
  alert: {
    type: '',
    msg: '',
  },
  chats: [],
  followers: [],
  followings: [],
});

onMounted(async () => {
  appStore.loading = true;
  await getMyFollowers();
  appStore.loading = false;
})

async function getMyFollowers() {
  try {
    appStore.loading = true;

    const res = await api.get(`/api/v1/users/${userStore.user.id}/followers`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }
    states.followers = json.data[0].user.followers;
    states.followings = json.data[0].user.followings;
  } catch (e) {
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">

      <!-- alert -->
      <div v-if="states.alert.type" :class="`alert-${states.alert.type}`" class="mb-0 alert">
        <span>{{ states.alert.msg }}</span>
      </div>

      <!-- card -->
      <div class="list-group">
        <span v-if="states.chats?.length">
          <div v-for="chat in chats" class="list-group-item d-flex gap-3 align-items-center justify-content-between py-3">
            <!-- name and image -->
            <router-link :to="`/dashboard/profile/${chat.username}`">
              <div class="d-flex gap-3 align-items-center">
                <!-- image -->
                <div>
                  <img src="https://dummyimage.com/200x200/bdbdbd/000000.jpg" class="rounded-circle image"
                    style="max-width: 50px" />
                </div>
                <!-- name -->
                <div>
                  <h6 class="m-0 p-0">{{ chat.username }}</h6>
                  <p class="text-muted m-0 p-0">{{ chat.first_name }} {{ chat.last_name }}</p>
                </div>
              </div>
            </router-link>

            <!-- follow -->
            <div>
              <button class="btn btn-sm btn-danger">
                Delete
              </button>
            </div>
          </div>
        </span>

        <!-- empty -->
        <div v-else class="list-group-item">
          <small class="text-muted fw-light d-flex justify-content-center py-3">
            No relevant data available yet!
          </small>
        </div>
      </div>
    </div>
  </div>
</template>
