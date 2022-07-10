import { defineStore } from 'pinia';

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
        if (!res.ok) {
          this.isLoggedIn = false;
          this.clearUserInfo();
        }
        return await res.json();
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
    setIsLoggedIn(value) {
      this.isLoggedIn = value;
    },
  },
  persist: {
    id: 'user',
    storage: window.localStorage,
    paths: ['isLoggedIn', 'user'],
  },
});

export default useUserStore;
