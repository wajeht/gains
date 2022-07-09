import { defineStore } from 'pinia';
import router from '../router.vue.js';
import axios from 'axios';

const authStore = defineStore({
  id: 'auth',
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem('user')),
    };
  },
  actions: {
    async login(email, password) {
      try {
        const res = await axios.post('/api/auth/login', { email, password });
        router.push('/dashboard/profile');
        return res;
      } catch (e) {
        return e;
      }
    },
    async logout() {
      try {
        this.user = null;
        const res = await axios.post('/api/auth/logout');
        localStorage.removeItem('user');
        router.push('/dashboard/login');
        return res;
      } catch (e) {
        return e;
      }
    },
  },
});

export default authStore;
