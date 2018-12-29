<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to='/'><span>Price Quru</span></router-link>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        flat
        to='/products'
      >
        Προϊοντα
      </v-btn>
      <v-btn
        flat
        to='/shops'
      >
        Καταστηματα
      </v-btn>
      <v-btn
        flat
        @click.stop="showLoginDialog"
        v-if="!isAuthenticated"
      >
        <span class="mr-2">Συνδεση</span>
      </v-btn>
      <v-btn
        flat
        v-else
        @click="logout"
      >
        <span class="mr-2">Αποσυνδεση</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view />
      <LoginModal
        :open="loginDialogOpen"
        @closed="hideLoginDialog"
      />
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import HomePage from './components/HomePage.vue';
import LoginModal from './components/LoginModal.vue';
import authenticationService from './services/authentication-service';

export default {
  name: 'App',
  components: {
    HomePage,
    LoginModal
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  data() {
    return {
      loginDialogOpen: false
    };
  },
  methods: {
    hideLoginDialog() {
      this.loginDialogOpen = false;
    },
    logout() {
      authenticationService.logout()
        .then(() => {
          console.log('logged out');
          this.logoutAction();
        })
        .catch(() => {
          console.error('logout failed');
        });
    },
    showLoginDialog() {
      this.loginDialogOpen = true;
    },
    ...mapActions({ logoutAction: 'logout' })
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar__title a {
  text-decoration: none;
  color: inherit;
}
</style>

