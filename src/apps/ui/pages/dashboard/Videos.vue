<template>
  <Loading v-if="loading" />
  <DashboardHeader />

  <div class="container">
    <div v-if="loading === false" class="row my-3 px-3">
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

<script>
  import DashboardHeader from '../../components/dashboard/DashboardHeader.vue';
  import Loading from '../../components/dashboard/Loading.vue';
  import { sleep } from '../../../../utils/helpers.js';

  export default {
    components: {
      DashboardHeader,
      Loading,
    },
    data() {
      return {
        loading: true,
        videos: [
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
        ],
      };
    },
    async mounted() {
      await sleep(300);
      this.loading = false;
    },
  };
</script>
