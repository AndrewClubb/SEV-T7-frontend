<template>
  <v-container fluid class="fill-height">
    <!-- App bar is the top 'navigation' that has the image name and login on top right -->
    <v-app-bar color="primary" prominent class="elevation-0">
      <!-- <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <template v-slot:prepend>
        <!-- OC logo image -->
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
          transition="scale-transition"
        ></v-img>
      </template>
      <!-- OC Music Dept title in top bar -->
      <v-toolbar-title class="title">
        {{ this.title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom min-width="250px" rounded offset-y v-if="user != null">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user != null" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card width="200" height="200">
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" @click="studentSettings(myItems.route)">
                Student Settings
              </v-btn>
              <br />
              <v-btn variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
    <!-- <v-container fluid class="fill-height"> -->
    <v-row class="fill-height">
      <v-col cols="2" class="bg-blue">
        <MainNav></MainNav>
      </v-col>
      <v-col cols="10" class="bg-white">
        <!-- Your components go here -->
        <div class="grid-container">
          <!-- Student Section -->
          <StudentHome
            v-if="this.$route.fullPath === '/studentBase'"
          ></StudentHome>
          <StudentSettings
            v-if="this.$route.fullPath === '/studentSettings'"
          ></StudentSettings>
          <CreateCritique
            v-if="this.$route.fullPath === '/facultyCreateCritiques'"
          ></CreateCritique>
          <StudentEventList
            v-if="this.$route.fullPath === '/studentEventSignUps'"
          ></StudentEventList>
          <StudentViewCritique
            v-if="this.$route.fullPath === '/studentCritiques'"
          ></StudentViewCritique>
          <!-- Faculty Section -->
          <FacultyCritiqueView
            v-if="this.$route.fullPath === '/facultyViewCritiques'"
          ></FacultyCritiqueView>
          <!-- Admin Section -->
          <AdminMaintainEvent
            v-if="this.$route.fullPath === '/adminViewEvents'"
          >
          </AdminMaintainEvent>
          <!-- Availability -->
          <CreateAvailability
            v-if="this.$route.fullPath === '/createAvailability'"
          >
          </CreateAvailability>
          <StudentRepertoire
            v-if="this.$route.fullPath === '/studentRepertoire'"
          ></StudentRepertoire>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//Logo for navbar
import ocLogo from "../../public/oc_logo_social.png";
//Login Stuff
import Utils from "../config/utils.js";
import AuthServices from "../services/authServices.js";
import StudentSettings from "../components/student/StudentSettings.vue";
// Import all components and insert into homepage
import MainNav from "../components/MainNav.vue";
import StudentHome from "../components/student/StudentHome.vue";
import CreateCritique from "../components/faculty/CreateCritique.vue";
import StudentEventList from "../components/student/StudentEventList.vue";
import StudentViewCritique from "../components/student/StudentViewCritique.vue";
import FacultyCritiqueView from "../components/faculty/CritiqueView.vue";
import CreateAvailability from "../components/faculty/CreateAvailability.vue";
import StudentRepertoire from "../components/student/StudentRepertoire.vue";
import AdminMaintainEvent from "../components/admin/AdminMaintainEvent.vue";
export default {
  name: "Base",
  components: {
    ocLogo,
    MainNav, //Left navigation panel
    //Student Component
    StudentSettings,
    StudentHome, //Landing Page for the Students
    StudentEventList,
    CreateCritique,
    StudentViewCritique,
    //Faculty Component
    FacultyCritiqueView,
    //Accompanist Component
    //Admin Component
    CreateAvailability,
    StudentRepertoire,
    AdminMaintainEvent,
  },
  data: () => ({
    user: {},
    title: "OC Music Department",
    initials: "",
    name: "",
    drawer: true,
    group: null,
    role: "",
    route: "",
    myItems: [
      {
        prependIcon: "mdi-account",
        title: "Switch Account",
        value: "switchAcc",
      },

      {
        prependIcon: "mdi-account-settings-variant",
        value: "studentSettings",
        route: "studentSettings",
      },
      {
        prependIcon: "mdi-logout",
        title: "Logout",
        value: "logout",
      },
    ],
  }),
  async created() {
    this.logoURL = ocLogo;
    this.resetMenu();
  },
  async mounted() {
    this.resetMenu();
  },
  methods: {
    //Changing between the components 'pages'
    // changeComponent(link) {
    //   this.route = link;
    // },
    //Logging in
    resetMenu() {
      this.user = null;
      // ensures that their name gets set properly from store
      this.user = Utils.getStore("user");
      if (this.user != null) {
        this.initials = this.user.fName[0] + this.user.lName[0];
        this.name = this.user.fName + " " + this.user.lName;
      }
    },
    logout() {
      AuthServices.logoutUser(this.user)
        .then((response) => {
          console.log(response);
          Utils.removeItem("user");
          this.$router.push({ name: "loginPage" });
          location.reload();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    studentSettings(route) {
      this.$router.push({ path: route });
      location.reload();
    },
  },
  watch: {
    group() {
      this.drawer = true;
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
