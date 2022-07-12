import { defineStore } from 'pinia';
import { isMobile } from '../../../utils/helpers.js';

const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      isLoggedIn: false,
      user: {
        id: null,
        username: null,
        email: null,
      },
    };
  },
  getters: {},
  actions: {
    async checkAuthentication() {
      try {
        const res = await window.fetch(`/api/v1/users/check-authentication`);
        if (res.status === 401 || res.status === 403) {
          this.isLoggedIn = false;
          this.clearUserInfo();
          let logoutLink = '/login';
          if (isMobile) logoutLink = '/dashboard/login';
          this.router.push({ params: logoutLink });
        }
        return res;
      } catch (e) {
        this.isLoggedIn = false;
        this.clearUserInfo();
      }
    },
    setUserInfo(id, username, email) {
      this.user.id = id;
      this.user.username = username;
      this.user.email = email;
    },
    clearUserInfo() {
      this.user.id = null;
      this.user.username = null;
      this.user.email = null;
    },
    logout() {
      this.isLoggedIn = false;
      this.clearUserInfo();
      let logoutLink = '/login';
      if (isMobile) {
        logoutLink = '/dashboard/login';
      }
      this.router.push({ params: logoutLink });
    },
  },
  persist: {
    id: 'user',
    storage: window.localStorage,
    paths: ['isLoggedIn', 'user'],
  },
});

export default useUserStore;
