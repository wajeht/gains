<script setup>
import { reactive } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../utils/fetch-with-style';
import useUserStore from '../../../store/user.store';

const userStore = useUserStore();

const states = reactive({
  users: [],
});

async function getUsers() {
  const res = await api.get('/api/v1/users');
  const json = await res.json();
  states.users = json.data;
}

async function followUser(followed_id) {
  await api.post('/api/v1/users/follow', {
    follower_id: userStore.user.id,
    followed_id,
  });
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Chat</h4>
          <p class="card-text">Comming soon!</p>

          <div class="d-flex flex-column gap-2">
            <button @click="getUsers">Get Users</button>
            <div
              v-for="user in states.users"
              :key="user.id"
              class="d-flex align-items-center gap-2"
            >
              {{ user.username }}
              <button class="btn btn-sm btn-dark" @click="followUser(user.id)">Follow</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
