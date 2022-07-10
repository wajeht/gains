<script setup >
  import { onMounted, reactive } from 'vue';
  import useAppStore from '../../store/app.store.js';
  import DashboardHeader from '../../components/dashboard/DashboardHeader.vue';
  import { sleep } from '../../../../utils/helpers.js';

  const appStore = useAppStore();
  const videos = reactive([
    {
      id: 1,
      title: 'squat session',
      date: new Date().toISOString(),
      screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=squat',
      username: 'yanlon',
      comments: 12,
    },
    {
      id: 1,
      title: 'squat session',
      date: new Date().toISOString(),
      screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=squat',
      username: 'yanlon',
      comments: 12,
    },
    {
      id: 1,
      title: 'squat session',
      date: new Date().toISOString(),
      screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=squat',
      username: 'yanlon',
      comments: 12,
    },
    {
      id: 1,
      title: 'squat session',
      date: new Date().toISOString(),
      screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=squat',
      username: 'yanlon',
      comments: 12,
    },
    {
      id: 1,
      title: 'squat session',
      date: new Date().toISOString(),
      screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=squat',
      username: 'yanlon',
      comments: 12,
    },
    {
      id: 1,
      title: 'squat session',
      date: new Date().toISOString(),
      screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=squat',
      username: 'yanlon',
      comments: 12,
    },
    {
      id: 2,
      title: 'bench session',
      date: new Date().toISOString(),
      screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=bench',
      username: 'yanlon',
      comments: 12,
    },
  ]);

  onMounted(async () => {
    appStore.loading = true;
    await sleep(300);
    appStore.loading = false;
  });
</script>


<template>
  <DashboardHeader />

  <div class="container">
    <div v-if="appStore.loading === false" class="row my-3 px-3">
      <div v-for="video in videos" :key="`key-${video.id}`" class="col-3 p-0">
        <div class="d-flex flex-column">
          <router-link :to="{ name: 'VideoDetails', params: { id: video.id } }">
            <div class="card border">
              <img class="card-img-top" :src="video.screenshot_url" :alt="video.title" />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
