<template>
  <div class="container">
    <div class="row my-2">
      <div v-for="video in videos" :key="`${video.id}` - key" class="col-3 p-0">
        <div class="d-flex flex-column">
          <router-link :to="{ name: 'VideoDetails', params: { video: video.id } }">
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
  export default {
    data() {
      return {
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
  };
</script>
