import { defineStore } from 'pinia';
import { isMobile } from '../../../utils/helpers.js';

import useAppStore from './app.store.js';

function removeAllModal() {
  // close all modals but the one you want to open
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    let currentModal = bootstrap.Modal.getInstance(modal);
    if (currentModal) currentModal.hide();
  });
}

const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      isLoggedIn: false,
      user: {
        role: null,
        id: null,
        username: null,
        email: null,
        first_name: null,
        last_name: null,
        weight: null,
        profile_picture_url: null,
      },
    };
  },
  actions: {
    async checkAuthentication() {
      try {
        const appStore = useAppStore();
        const res = await window.fetch(`/api/v1/users/check-authentication`);
        if (res.status === 401 || res.status === 403) {
          this.isLoggedIn = false;
          this.clearUserInfo();
          removeAllModal();
          let logoutLink = '/login';
          appStore.loading = false;
          if (isMobile()) logoutLink = '/dashboard/login';
          this.router.push({ params: logoutLink });
        }
        return res;
      } catch (e) {
        this.isLoggedIn = false;
        this.clearUserInfo();
      }
    },
    setUserInfo({ id, username, email, first_name, last_name, weight, profile_picture_url, role }) {
      this.user.id = id;
      this.user.username = username;
      this.user.email = email;
      this.user.first_name = first_name;
      this.user.last_name = last_name;
      this.user.profile_picture_url = profile_picture_url;
      this.user.weight = weight;
      this.user.role = role;
    },
    clearUserInfo() {
      this.user.id = null;
      this.user.username = null;
      this.user.role = null;
      this.user.email = null;
      this.user.first_name = null;
      this.user.last_name = null;
      this.user.weight = null;
      this.user.profile_picture_url = null;
    },
    logout() {
      const appStore = useAppStore();
      this.isLoggedIn = false;
      this.clearUserInfo();
      removeAllModal();
      appStore.loading = false;
      let logoutLink = '/login';
      if (isMobile()) {
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
