<script setup>
import dayjs from 'dayjs';
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../../utils/fetch-with-style.js';
import { reactive, onMounted, ref } from 'vue';
import useUserStore from '../../../../store/user.store.js';
import useAppStore from '../../../../store/app.store.js';
import { pickBy } from 'lodash-es';

const userStore = useUserStore();
const appStore = useAppStore();

const edit_personal_info = ref(true);
const edit_account_info = ref(true);

const first_name = ref('');
const last_name = ref('');
const birth_date = ref('');
const weight = ref('');

const email = ref('');
const username = ref('');
const password = ref('');
const profile_picture_url = ref(null);
const profilePicture = ref(null);

const alert = reactive({
  type: '',
  msg: '',
});

onMounted(async () => {
  // appStore.loading = true;
  const res = await api.get(`/api/v1/users/${userStore.user.id}`);
  const json = await res.json();
  const [data] = json.data;
  first_name.value = data.first_name;
  last_name.value = data.last_name;
  profile_picture_url.value = data.profile_picture_url;
  birth_date.value =
    dayjs(data.birth_date).format('YYYY-MM-DD') === 'Invalid Date'
      ? null
      : dayjs(data.birth_date).format('YYYY-MM-DD');
  weight.value = data.weight;
  email.value = data.email;
  username.value = data.username;
  // appStore.loading = false;
});

async function updateProfilePicture() {
  try {
    const file = profilePicture.value.files[0];
    let formData = new FormData();
    formData.append('picture', file);
    formData.append('user_id', userStore.user.id);

    const data = {
      method: 'POST',
      body: formData,
    };

    const res = await window.fetch(`/api/v1/users/update-profile-picture/${userStore.user.id}`, data); // prettier-ignore
    const json = await res.json();

    if (res.status === 403 || res.status === 401) {
      userStore.logOut();
      return;
    }

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    profile_picture_url.value = json.data[0].profile_picture_url;
    userStore.user.profile_picture_url = profile_picture_url.value;

    alert.type = 'success';
    alert.msg = 'Your profile picture has been updated!';
  } catch (e) {
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function updatePersonalInformation() {
  try {
    const user = {
      first_name: first_name.value,
      last_name: last_name.value,
      birth_date: birth_date.value != null ? dayjs(birth_date.value).format('YYYY-MM-DD') : null,
      weight: weight.value,
    };

    // only grab values which are not empty
    const validUser = pickBy(user, (value, key) => value !== null);

    // prettier-ignore
    const res = await api.patch(`/api/v1/users/${userStore.user.id}/update-personal-information`, validUser);
    const json = await res.json();

    // update user info in user store
    for (const u in validUser) {
      userStore.user[u] = validUser[u];
    }

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    alert.type = 'success';
    alert.msg = `Updated personal information!`; // prettier-ignore

    edit_personal_info.value = true;
  } catch (e) {
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function updateAccountInfo() {
  try {
    const account = {
      email: email.value,
      username: username.value,
      password: password.value,
    };

    if (password.value.length === 0) {
      delete account.password;
    }

    // prettier-ignore
    const res = await api.patch(`/api/v1/users/${userStore.user.id}/update-account-information`, account);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    alert.type = 'success';
    alert.msg = `Updated account information!`; // prettier-ignore

    edit_account_info.value = true;
  } catch (e) {
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

  <div v-if="!appStore.loading" class="container px-3" v-auto-animate>
    <div class="my-3 d-flex flex-column gap-3" v-auto-animate>
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- profile picture -->
      <div>
        <h5><i class="bi bi-person-fill"></i> Profile picture</h5>
        <div class="card">
          <div class="card-body">
            <!-- img -->
            <div class="mb-3 text-center">
              <img
                :src="profile_picture_url ?? `https://dummyimage.com/200x200/bdbdbd/000000.jpg1`"
                class="img-fluid rounded-circle"
                style="width: 200px; height: 200px; object-fit: cover"
              />
            </div>
            <!-- input -->
            <div>
              <label for="profilePicture" class="form-label">Update profile picture</label>
              <input
                @change="updateProfilePicture()"
                ref="profilePicture"
                class="form-control"
                id="profilePicture"
                type="file"
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- personal info -->
      <div>
        <h5><i class="bi bi-person-fill"></i> Personal info</h5>
        <form @submit.prevent="updatePersonalInformation()" class="card">
          <div class="card-body">
            <!-- first name -->
            <div class="row mb-2">
              <label class="col-4 col-form-label" for="personal-information-first-name"
                >First name</label
              >
              <div class="col-8">
                <input
                  :disabled="edit_personal_info"
                  v-model="first_name"
                  type="text"
                  class="form-control form-control-sm"
                  id="personal-information-first-name"
                />
              </div>
            </div>

            <!-- last name -->
            <div class="row mb-2">
              <label for="personal-information-last-name" class="col-4 col-form-label"
                >Last name</label
              >
              <div class="col-8">
                <input
                  :disabled="edit_personal_info"
                  v-model="last_name"
                  type="text"
                  class="form-control form-control-sm"
                  id="personal-information-last-name"
                />
              </div>
            </div>

            <!-- birth date -->
            <div class="row mb-2">
              <label for="personal-information-birth-date" class="col-4 col-form-label"
                >Birth date</label
              >
              <div class="col-8">
                <input
                  :disabled="edit_personal_info"
                  v-model="birth_date"
                  type="date"
                  class="form-control form-control-sm"
                  id="personal-information-birth-date"
                />
              </div>
            </div>

            <!-- weight -->
            <div class="row mb-2">
              <label for="personal-information-weight" class="col-4 col-form-label">Weight</label>
              <div class="col-8">
                <input
                  v-model="weight"
                  :disabled="edit_personal_info"
                  type="number"
                  class="form-control form-control-sm"
                  id="personal-information-weight"
                />
              </div>
            </div>

            <!-- edit or cancel -->
            <div class="d-flex gap-2">
              <button
                @click="edit_personal_info = !edit_personal_info"
                class="btn btn-secondary w-50"
                type="button"
              >
                <span v-if="edit_personal_info">Edit</span>
                <span v-if="!edit_personal_info">Cancel</span>
              </button>
              <button class="btn btn-secondary w-50" type="submit" :disabled="edit_personal_info">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- account info -->
      <div>
        <h5><i class="bi bi-lock-fill"></i> Account info</h5>
        <form @submit.prevent="updateAccountInfo()" class="card">
          <div class="card-body">
            <!-- email -->
            <div class="row mb-2">
              <label class="col-4 col-form-label" for="account-information-email">Email</label>
              <div class="col-8">
                <input
                  v-model="email"
                  type="email"
                  class="form-control form-control-sm"
                  id="account-information-email"
                  :disabled="edit_account_info"
                />
              </div>
            </div>

            <!-- username -->
            <div class="row mb-2">
              <label for="account-information-username" class="col-4 col-form-label"
                >Username</label
              >
              <div class="col-8">
                <input
                  v-model="username"
                  type="text"
                  class="form-control form-control-sm"
                  id="account-information-username"
                  :disabled="edit_account_info"
                />
              </div>
            </div>

            <!-- password -->
            <div class="row mb-2">
              <label for="account-information-password" class="col-4 col-form-label"
                >Password</label
              >
              <div class="col-8">
                <input
                  v-model="password"
                  type="password"
                  class="form-control form-control-sm"
                  id="account-information-password"
                  :disabled="edit_account_info"
                  autocomplete="false"
                />
              </div>
            </div>

            <!-- edit or cancel -->
            <div class="d-flex gap-2">
              <button
                @click="edit_account_info = !edit_account_info"
                class="btn btn-secondary w-50"
                type="button"
              >
                <span v-if="edit_account_info">Edit</span>
                <span v-if="!edit_account_info">Cancel</span>
              </button>
              <button class="btn btn-secondary w-50" type="submit" :disabled="edit_account_info">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
