<script setup>
import { reactive, onMounted, computed } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../utils/fetch-with-style';
import useUserStore from '../../../store/user.store';
import { useRoute } from 'vue-router';

const props = defineProps({
    username: String,
})

const userStore = useUserStore();
const route = useRoute();

const states = reactive({
    links: [
        { id: 1, label: 'Followings' },
        { id: 2, label: 'Followers' },
    ],
    user: {},
    currentLink: 'Followings',
});

onMounted(async () => {
    const tab = route.query.tab;

    if (tab === 'Followers') {
        states.currentLink = 'Followers'
    }

    if (tab === 'Followings') {
        states.currentLink = 'Followings'
    }

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
                    <h6 v-for="link in states.links" role="button" @click="setActive(link)"
                        :class="['w-100 m-0 text-center rounded', computedCurrentLinkClass(link)]"
                        style="padding-top: 12px; padding-bottom: 12px;">
                        {{ link.label }}
                    </h6>
                </div>

                <!-- card -->
                <div class="list-group">
                    <span v-if="computedList?.length">
                        <div v-for="user in computedList"
                            class="list-group-item d-flex gap-3 align-items-center justify-content-between py-3">
                            <!-- name and image -->
                            <router-link :to="`/dashboard/profile/${user.username}`">
                                <div class="d-flex gap-3 align-items-center">
                                    <!-- image -->
                                    <div>
                                        <img src="https://dummyimage.com/200x200/bdbdbd/000000.jpg"
                                            class="rounded-circle image" style="max-width: 50px" />
                                    </div>
                                    <!-- name -->
                                    <div>
                                        <h6 class="m-0 p-0">{{ user.username }}</h6>
                                        <p class="text-muted m-0 p-0">{{ user.first_name }} {{ user.last_name }}</p>
                                    </div>
                                </div>
                            </router-link>

                            <!-- follow -->
                            <div>
                                <button v-if="states.currentLink === 'Followings'"
                                    class="btn btn-sm btn-primary">Following</button>
                                <button v-if="states.currentLink === 'Followers'"
                                    class="btn btn-sm btn-primary">Remove</button>
                            </div>
                        </div>
                    </span>

                    <!-- empty -->
                    <div v-else class="list-group-item">
                        <small class="text-muted fw-light d-flex justify-content-center py-2"> No relevant data available yet!
                        </small>
                    </div>
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
    color: #191919;
}
</style>
