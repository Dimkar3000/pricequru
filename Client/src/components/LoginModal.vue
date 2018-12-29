<template>
  <v-dialog
    v-model="open"
    persistent
    @keydown.esc="modalClosed"
    class="login-modal"
  >
    <v-card>

      <span>Συνδεθείτε</span>
      <v-btn
        fab
        @click="modalClosed"
        class="right"
      >X</v-btn>
      <v-flex justify-center>
        <v-form @submit="submitForm">
          <v-text-field
            label="Email"
            v-model="email"
            required
          />
          <v-text-field
            label="Κωδικός"
            v-model="password"
            type="password"
            required
          />
          <v-switch
            :label="switchLabel"
            v-model="oldAccount"
          />
          <v-btn type="submit">{{ submitButtonLabel }}</v-btn>
        </v-form>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import authenticationService from '../services/authentication-service';

export default {
  data() {
    return {
      email: '',
      password: '',
      oldAccount: true,
    };
  },
  computed: {
    submitButtonLabel() {
      return this.oldAccount ? 'Συνδεση' : 'Εγγραφη';
    },
    switchLabel() {
      return this.oldAccount ? 'Έχω ήδη λογαριασμό' : 'Θέλω να αποκτήσω νέο λογαριασμό';
    }
  },
  methods: {
    login() {
      authenticationService.login(this.email, this.password)
        .then(() => {
          console.log('logged in');
          this.setToken({
            token: 'testToken'
          });
          this.modalClosed();
        })
        .catch(() => {
          console.error('login failed');
        });
    },

    modalClosed() {
      this.$emit('closed');
    },
    register() {
      authenticationService.register(this.email, this.password)
        .then(() => {
          console.log('registered');
        })
        .catch(() => {
          console.error('register failed');
        });
    },
    submitForm() {
      console.log('submit');
      if (this.oldAccount) {
        this.login();
      } else {
        this.register();
      }
    },
    ...mapActions(['setToken'])
  },
  props: {
    open: {
      default: false,
      type: Boolean,
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  padding: 20px;
}
.right {
  float: right;
}
</style>
