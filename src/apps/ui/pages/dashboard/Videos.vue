<template>
  <div class="container">
    <div class="row my-2">
      <div v-for="video in videos" :key="video.id" class="col-3 p-0">
        <div class="d-flex flex-column">
          <div class="card border">
            <img class="card-img-top" :src="video.screenshot_url" :alt="video.title" />
          </div>
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
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=bench',
            username: 'yanlon',
            comments: 12,
          },
          {
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=dead',
            username: 'yanlon',
            comments: 12,
          },
          {
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=press',
            username: 'yanlon',
            comments: 12,
          },
          {
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=pull',
            username: 'yanlon',
            comments: 12,
          },
          {
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=push',
            username: 'yanlon',
            comments: 12,
          },
          {
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=curl',
            username: 'yanlon',
            comments: 12,
          },
          {
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=row',
            username: 'yanlon',
            comments: 12,
          },
          {
            id: 1,
            title: 'squat session',
            date: new Date().toISOString(),
            screenshot_url: 'https://dummyimage.com/400x400/bdbdbd/000000.jpg&text=hinge',
            username: 'yanlon',
            comments: 12,
          },
        ],
      };
    },
  };
</script>
