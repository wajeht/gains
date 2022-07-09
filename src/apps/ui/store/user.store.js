import { defineStore } from 'pinia';
import router from '../router.vue.js';

const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      userId: '',
      userName: '',
      isLoggedIn: false,
    };
  },
  getters: {},
  actions: {
    async login(email, password) {
      try {
        return await window.fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
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

export default useUserStore;
