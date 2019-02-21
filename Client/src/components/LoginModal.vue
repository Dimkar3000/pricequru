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
        @click="modalClosed"
        class="right"
        fab
      >
        <v-icon>close</v-icon>
      </v-btn>
      <v-flex justify-center>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            label="Όνομα Χρήστη"
            v-model="username"
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
          <v-btn
            type="submit"
            :loading="busy"
            :disabled="busy">{{ submitButtonLabel }}
          </v-btn>
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
      busy: false,
      username: '',
      password: '',
      oldAccount: true
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
      this.busy = true;
      authenticationService.login(this.password, this.username)
        .then((res) => {
          console.log('logged in.');
          this.handleSuccess(res);
          this.modalClosed();
        })
        .catch(() => {
          console.error('login failed');
        }).finally(() => {
          this.busy = false;
        });
    },
    modalClosed() {
      this.$emit('closed');
    },
    handleSuccess(res) {
      const token = res.headers['x-observatory-auth'];
      this.setToken({
        token
      });
      localStorage.setItem('token', token);
    },
    register() {
      authenticationService.register(this.password, this.username)
        .then((res) => {
          console.log('registered');
          this.handleSuccess(res);
          this.modalClosed();
        })
        .catch(() => {
          console.error('register failed');
        }).finally(() => {
          this.busy = false;
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
