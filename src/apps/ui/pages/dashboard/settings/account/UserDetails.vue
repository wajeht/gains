<script setup>
import dayjs from 'dayjs';
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../../libs/fetch-with-style.js';
import { reactive, onMounted, ref } from 'vue';
import useUserStore from '../../../../store/user.store.js';
import useAppStore from '../../../../store/app.store.js';

const userStore = useUserStore();
const appStore = useAppStore();

const edit_personal_info = ref(true);
const edit_account_info = ref(true);
const first_name = ref('');
const last_name = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const birth_date = ref(null);
const weight = ref(null);
const alert = reactive({
  type: '',
  msg: '',
});

onMounted(async () => {
  appStore.loading = true;
  const res = await api.get(`/api/v1/users/${userStore.user.id}`);
  const [data] = await res.json();
  first_name.value = data.first_name;
  last_name.value = data.last_name;
  birth_date.value = dayjs(data.birth_date).format('YYYY-MM-DD');
  weight.value = data.weight;
  email.value = data.email;
  username.value = data.username;
  appStore.loading = false;
});

async function updatePersonalInformation() {
  try {
    const user = {
      first_name: first_name.value,
      last_name: last_name.value,
      birth_date: dayjs(birth_date.value).format('YYYY-MM-DD'),
      weight: weight.value,
    };

    // prettier-ignore
    const res = await api.patch(`/api/v1/users/${userStore.user.id}/update-personal-information`, user);
    const json = await res.json();

    if (!res.ok) {
      throw json.errors;
    }

    alert.type = 'success';
    alert.msg = `Updated personal information!`; // prettier-ignore

    edit_personal_info.value = true;
  } catch (e) {
    alert.type = 'danger';
    alert.msg = e.map((cur) => cur.msg).join(' ');
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
      throw json.errors;
    }

    alert.type = 'success';
    alert.msg = `Updated account information!`; // prettier-ignore

    edit_account_info.value = true;
  } catch (e) {
    alert.type = 'danger';
    alert.msg = e.map((cur) => cur.msg).join(' ');
  }
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div
        v-if="alert.type"
        :class="`alert-${alert.type}`"
        class="mb-3 alert animate__animated animate__zoomIn animate__faster"
      >
        <span>{{ alert.msg }}</span>
      </div>

      <!-- personal info -->
      <div>
        <h5><i class="bi bi-person-fill"></i> Personal info</h5>
        <form @submit.prevent="updatePersonalInformation()" class="card">
          <div class="card-body">
            <!-- first name -->
            <div class="row mb-2">
              <label class="col-4 col-form-label" for="first-name">First name</label>
              <div class="col-8">
                <input
                  :disabled="edit_personal_info"
                  v-model="first_name"
                  type="text"
                  class="form-control form-control-sm"
                  id="first-name"
                />
              </div>
            </div>

            <!-- last name -->
            <div class="row mb-2">
              <label for="last-name" class="col-4 col-form-label">Last name</label>
              <div class="col-8">
                <input
                  :disabled="edit_personal_info"
                  v-model="last_name"
                  type="text"
                  class="form-control form-control-sm"
                  id="last-name"
                />
              </div>
            </div>

            <!-- birth date -->
            <div class="row mb-2">
              <label for="birth-date" class="col-4 col-form-label">Birth date</label>
              <div class="col-8">
                <input
                  :disabled="edit_personal_info"
                  v-model="birth_date"
                  type="date"
                  class="form-control form-control-sm"
                  id="birth-date"
                />
              </div>
            </div>

            <!-- weight -->
            <div class="row mb-2">
              <label for="weight" class="col-4 col-form-label">Weight</label>
              <div class="col-8">
                <input
                  v-model="weight"
                  :disabled="edit_personal_info"
                  type="number"
                  class="form-control form-control-sm"
                  id="weight"
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
              <label class="col-4 col-form-label" for="first-name">Email</label>
              <div class="col-8">
                <input
                  v-model="email"
                  type="email"
                  class="form-control form-control-sm"
                  id="email"
                  :disabled="edit_account_info"
                />
              </div>
            </div>

            <!-- username -->
            <div class="row mb-2">
              <label for="username" class="col-4 col-form-label">Username</label>
              <div class="col-8">
                <input
                  v-model="username"
                  type="text"
                  class="form-control form-control-sm"
                  id="username"
                  :disabled="edit_account_info"
                />
              </div>
            </div>

            <!-- password -->
            <div class="row mb-2">
              <label for="birth-date" class="col-4 col-form-label">Password</label>
              <div class="col-8">
                <input
                  v-model="password"
                  type="password"
                  class="form-control form-control-sm"
                  id="password"
                  :disabled="edit_account_info"
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
