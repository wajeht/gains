<script setup>
import { reactive, onMounted, computed } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../utils/fetch-with-style';
import useUserStore from '../../../store/user.store';

const userStore = useUserStore();

const states = reactive({
  links: [
    { id: 1, label: 'Followings' },
    { id: 2, label: 'Followers' },
  ],
  user: {},
  currentLink: 'Followings',
});

onMounted(async () => {
  await getMyFollowers();
});

const computedList = computed(() => {
  if (states.currentLink === 'Followers') {
    return states.user.followers;
  } else {
    return states.user.followings;
  }
});

async function getMyFollowers() {
  const res = await api.get(`/api/v1/users/${userStore.user.id}/followers`);
  const json = await res.json();
  states.user = json.data[0].user;
}

const computedCurrentLinkClass = (link) => {
  return states.currentLink === link.label ? 'bg-white' : 'text-muted';
};

function setActive(link) {
  states.currentLink = link.label;
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <div class="d-flex flex-column">
        <!-- tab -->
        <div class="d-flex justify-content-evenly rounded">
          <h5
            v-for="link in states.links"
            role="button"
            @click="setActive(link)"
            :class="['p-2 w-100 m-0 text-center', computedCurrentLinkClass(link)]"
          >
            {{ link.label }}
          </h5>
        </div>

        <!-- card -->
        <div class="list-group">
          <div
            v-for="user in computedList"
            class="list-group-item d-flex gap-3 align-items-center justify-content-between"
          >
            <!-- name and image -->
            <div class="d-flex gap-3">
              <!-- image -->
              <div>
                <img
                  src="https://dummyimage.com/200x200/bdbdbd/000000.jpg"
                  class="rounded-circle image"
                  style="max-width: 50px"
                />
              </div>
              <!-- name -->
              <div>
                <h6 class="m-0 p-0">{{ user.username }}</h6>
                <p class="text-muted m-0 p-0">{{ user.first_name }} {{ user.last_name }}</p>
              </div>
            </div>

            <!-- follow -->
            <div>
              <button class="btn btn-sm btn-primary">Unfollow</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
