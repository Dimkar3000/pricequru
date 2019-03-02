<template>
  <v-dialog
    v-model="open"
    persistent
    @keydown.esc="modalClosed"
    class="login-modal"
  >
    <v-card>

      <span class="title">{{ title }}</span>
      <v-btn
        @click="modalClosed"
        class="right"
        fab
      >
        <v-icon>close</v-icon>
      </v-btn>
      <v-flex justify-center>
        <v-form
          @submit.prevent="submitForm"
          ref="form"
        >
          <v-text-field
            label="Όνομα Χρήστη"
            v-model="username"
            :rules="rules.required"
          />
          <v-text-field
            label="Κωδικός"
            v-model="password"
            type="password"
            :rules="rules.required"
          />
          <a @click.prevent="toggleAction">{{ linkText }}</a>

          <v-layout justify-center>
            <v-btn
              type="submit"
              :loading="busy"
              :disabled="busy"
              class="d-block m-auto"
            >{{ mainButtonLabel }}
            </v-btn>
          </v-layout>
        </v-form>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import authenticationService from '../services/authentication-service';

const required = (text) => {
  return (text != null && text.trim() !== '') || 'Αυτό το πεδίο είναι υποχρεωτικό';
};
export default {
  data() {
    return {
      busy: false,
      alreadyHasAccount: true,
      password: '',
      rules: {
        required: [required]
      },
      username: ''
    };
  },
  computed: {
    linkText() {
      return this.alreadyHasAccount ? 'Πατήστε εδώ εάν θέλετε να δημιουργήστε νέο λογαριασμό.'
        : 'Πατήστε εδώ αν θέλετε να συνδεθείτε σε υπάρχον λογαριασμό.';
    },
    mainButtonLabel() {
      return this.alreadyHasAccount ? 'συνδεση' : 'εγγραφη';
    },
    title() {
      return this.alreadyHasAccount ? 'Συνδεθείτε' : 'Εγγραφείτε';
    }
  },
  watch: {
    open() {
      this.$refs.form.reset();
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
        .catch((err) => {
          console.error(err);
          console.error('login failed');
          const message = 'Η προσπάθεια σύνδεσης απέτυχε.';
          this.$swal({
            type: 'error',
            text: message
          });
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
      authenticationService.getData(token).then((getDataResponse) => {
        localStorage.setItem('isAdmin', getDataResponse.data.isAdmin);
        this.setUserData({ isAdmin: getDataResponse.data.isAdmin });
      });
    },
    register() {
      authenticationService.register(this.password, this.username)
        .then((res) => {
          console.log('registered');
          this.handleSuccess(res);
          this.modalClosed();
        })
        .catch((err) => {
          console.error(err);
          const message = 'Η δημιουργία λογαριασμού απέτυχε.';
          this.$swal({
            type: 'error',
            text: message
          });
        }).finally(() => {
          this.busy = false;
        });
    },
    submitForm() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.alreadyHasAccount) {
        this.login();
      } else {
        this.register();
      }
    },
    toggleAction() {
      this.alreadyHasAccount = !this.alreadyHasAccount;
    },
    ...mapActions(['setToken', 'setUserData'])
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

.v-btn {
}
</style>
