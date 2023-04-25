<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
  </div>
</template>

<script>
import AuthServices from "../services/authServices.js";
import Utils from "../config/utils.js";

export default {
  name: "login_signup_social",
  data() {
    return {
      roleCounter: 0,
      user: {},
    };
  },
  async created() {},
  mounted() {
    this.loginWithGoogle();
  },
  methods: {
    async loginWithGoogle() {
      window.handleCredentialResponse = this.handleCredentialResponse;
      const client = import.meta.env.VITE_APP_CLIENT_ID;
      console.log(client);
      window.google.accounts.id.initialize({
        client_id: client,
        cancel_on_tap_outside: false,
        auto_select: true,
        callback: window.handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("parent_id"),
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signup_with",
          width: 250,
        }
      );
    },
    async handleCredentialResponse(response) {
      let token = {
        credential: response.credential,
      };
      await AuthServices.loginUser(token)
        .then((response) => {
          this.user = response.data;
          Utils.setStore("user", this.user);
          Utils.setStore("userRole", { role: this.user.lastRole });
          if (this.user.lastRole == "Faculty") {
            this.$router.push({ path: "facultyHome" });
          } else if (this.user.lastRole == "Student") {
            this.$router.push({ path: "studentHome" });
          } else if (this.user.lastRole == "Admin") {
            this.$router.push({ path: "adminHome" });
          } else if (this.user.lastRole == "Accompanist") {
            this.$router.push({ path: "createAvailability" });
          } else {
            this.$router.push({ path: "base" });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
};
</script>
