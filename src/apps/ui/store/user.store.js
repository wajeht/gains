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
        first_name: null,
        last_name: null,
        weight: null,
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
    setUserInfo(id, username, email, first_name, last_name, weight) {
      this.user.id = id;
      this.user.username = username;
      this.user.email = email;
      this.user.first_name = first_name;
      this.user.last_name = last_name;
      this.user.weight = weight;
    },
    clearUserInfo() {
      this.user.id = null;
      this.user.username = null;
      this.user.email = null;
      this.user.first_name = null;
      this.user.last_name = null;
      this.user.weight = null;
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
