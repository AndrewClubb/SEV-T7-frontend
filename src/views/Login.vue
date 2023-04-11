<template>
  <v-container fluid class="loginGrid">
    <v-card
      align-self="center"
      justify="center"
      height="300"
      width="550"
      class="text-center login"
    >
      <br />
      <br />
      <v-img
        class="mx-auto"
        align-self="center"
        height="50"
        width="50"
        :src="logoURL"
      ></v-img>
      <v-card-title> Welcome to the OC Music Department!</v-card-title>
      <v-card-subtitle>Log in to your account:</v-card-subtitle>
      <br />
      <br />
      <SocialLogin />
      <br />
    </v-card>
  </v-container>
</template>

<script>
import OClogo from "/oc_logo_social.png";
import SocialLogin from "../components/SocialLogin.vue";
import { ref, onMounted } from "vue";
const logoURL = ref("");
export default {
  name: "LoginPage",
  components: {
    SocialLogin,
  },
};
onMounted(() => {
  logoURL.value = OClogo;
});
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.loginGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    ". . ."
    ". login ."
    ". . .";

  background: url(../../public/music_dept.jpg) no-repeat center center fixed;
  background-size: cover;
}

.login {
  grid-area: login;
}
</style>
