<script setup>
import { reactive } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../utils/fetch-with-style';
import useUserStore from '../../../store/user.store';

const userStore = useUserStore();

const states = reactive({
  users: [],
  myFollowers: [],
});

async function getUsers() {
  const res = await api.get('/api/v1/users');
  const json = await res.json();
  states.users = json.data;
}

async function followUser(following_id) {
  await api.post(`/api/v1/users/${following_id}/follow`, {
    follower_id: userStore.user.id,
  });
}

async function getMyFollowers() {
  const res = await api.get(`/api/v1/users/${userStore.user.id}/followers`);
  const json = await res.json();
  states.myFollowers = json.data;
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
            <div class="d-flex flex-column gap-2">
              <button @click="getMyFollowers">Get My Followers</button>
              <div
                v-for="user in states.myFollowers"
                :key="user.id"
                class="d-flex align-items-center gap-2"
              >
                {{ user.username }} {{ user.id }}
              </div>
            </div>

            <div class="d-flex flex-column gap-2">
              <button @click="getUsers">Get Users</button>
              <div
                v-for="user in states.users"
                :key="user.id"
                class="d-flex align-items-center gap-2"
              >
                {{ user.username }} {{ user.id }}
                <button class="btn btn-sm btn-dark" @click="followUser(user.id)">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
