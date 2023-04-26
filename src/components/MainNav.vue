<template>
  <v-app-bar color="primary" prominent class="elevation-0">
    <template v-slot:prepend>
      <!-- OC logo image -->
      <v-btn icon plain @click="goToHome">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
          transition="scale-transition"
        ></v-img>
      </v-btn>
    </template>
    <!-- OC Music Dept title in top bar -->
    <v-toolbar-title class="title">
      {{ this.title }}
    </v-toolbar-title>
    <!-- <v-spacer></v-spacer> -->
    <div v-if="userRoles.length > 1" class="align-right justify-right d-flex">
      <v-toolbar-items
        v-for="menu in activeMenus"
        :key="menu.link"
        class="hidden-md-and-down"
      >
        <v-btn
          class="hidden-md-and-down white--text mx-1"
          exact
          text
          @click="changeComp(menu.link)"
        >
          {{ menu.text }}
        </v-btn>
      </v-toolbar-items>
      <v-btn
        v-if="this.currentRole.role === ''"
        variant="text"
        @click="logout()"
      >
        Log back in
      </v-btn>
      <v-select
        :items="userRoles"
        item-title="role"
        v-model="currentRole"
        variant="underlined"
        class="ma-2"
        return-object
      >
      </v-select>
    </div>
    <div v-else class="align-right justify-right d-flex">
      <v-toolbar-items
        v-for="menu in activeMenus"
        :key="menu.link"
        class="hidden-md-and-down"
      >
        <v-btn
          class="hidden-md-and-down white--text mx-1"
          style="height: 45px"
          exact
          text
          @click="changeComp(menu.link)"
        >
          {{ menu.text }}
        </v-btn>
      </v-toolbar-items>
      <v-btn
        v-if="this.currentRole.role === ''"
        variant="text"
        @click="logout()"
      >
        Log back in
      </v-btn>
    </div>

    <v-menu bottom min-width="250px" rounded offset-y v-if="user != null">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon x-large>
          <v-avatar v-if="user != null" color="secondary">
            <v-img v-if="user.picture" :src="user.picture"></v-img>
            <span v-else class="accent--text font-weight-bold">{{
              initials
            }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="secondary" class="mt-2 mb-2">
              <v-img v-if="user.picture" :src="user.picture"></v-img>
              <span v-else class="accent--text font-weight-bold">{{
                initials
              }}</span>
            </v-avatar>
            <h3>{{ name }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" @click="changeComp('studentSettings')">
              Student Settings
            </v-btn>
            <br />
            <v-btn variant="text" @click="logout()"> Logout </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-app-bar-nav-icon
      dark
      class="hidden-lg-and-up"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    class="hidden-lg-and-up"
    app
    location="right"
    color="primary"
  >
    <v-list>
      <v-list-item
        v-for="menu in activeMenus"
        :key="menu.text"
        exact
        @click="changeComp(menu.link)"
      >
        <v-list-item-title class="white--text"
          >{{ menu.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import ocLogo from "../../public/oc_logo_social.png";
import Utils from "../config/utils.js";
import UserRoleDataService from "../services/UserRoleDataService";
import UserDataService from "../services/UserDataService";
import AuthServices from "../services/authServices.js";
export default {
  name: "MainNav",
  components: {
    ocLogo,
  },
  data: () => ({
    user: {},
    drawer: false,
    title: "OC Music Department",
    initials: "",
    name: "",
    logoURL: null,
    activeMenus: [],
    menus: [
      {
        link: "studentRepertoire",
        text: "Repertoire",
        roles: "Student",
      },
      // {
      //   link: "studentUpcomingEvents",
      //   text: "Upcoming Events",
      //   roles: "Student",
      // },
      {
        link: "studentEventSignUps",
        text: "Event Sign-Ups",
        roles: "Student",
      },
      {
        link: "studentCritiques",
        text: "Critiques",
        roles: "Student",
      },
      {
        link: "facultyViewCritiques",
        text: "View Student Critiques",
        roles: "Faculty",
      },
      // {
      //   link: "facultyCreateCritiques",
      //   text: "Create Event Critique",
      //   roles: "Faculty",
      // },
      {
        link: "createAvailability",
        text: "Event Availability",
        roles: "Faculty, Accompanist",
      },
      {
        link: "adminViewUsers",
        text: "Users",
        roles: "Admin",
      },
      {
        link: "adminViewEvents",
        text: "Events",
        roles: "Admin",
      },
    ],
    userRoles: [],
    currentRole: {
      role: "",
    },
  }),
  async created() {
    this.logoURL = ocLogo;
    this.resetMenu();
  },
  async mounted() {
    await this.getUserRoles();
    this.resetMenu();
  },
  methods: {
    async getUserRoles() {
      this.user = Utils.getStore("user");
      var previousRole = Utils.getStore("userRole").role;
      if (this.user != null) {
        await UserRoleDataService.getRolesForUser(this.user.userId)
          .then((response) => {
            this.userRoles = response.data;

            if (previousRole !== null && previousRole !== undefined) {
              const roleIndex = this.userRoles.findIndex(
                (role) => role.role === previousRole
              );
              if (roleIndex === -1) {
                if (this.userRoles.length > 0) {
                  this.currentRole = this.userRoles[0];
                  this.updateLastRole(this.currentRole.role);
                }
              } else {
                this.currentRole = this.userRoles[roleIndex];
              }
            } else {
              if (this.userRoles.length > 0) {
                this.currentRole = this.userRoles[0];
                this.updateLastRole(this.currentRole.role);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    updateLastRole(newRole) {
      Utils.setStore("userRole", { role: newRole });
      const data = {
        id: this.user.userId,
        lastRole: newRole,
      };
      UserDataService.update(data).catch((err) => {
        console.log(err);
      });
    },
    goToHome() {
      if (Utils.getStore("userRole").role == "Faculty") {
        this.$router.push({ path: "facultyHome" });
      } else if (Utils.getStore("userRole").role == "Student") {
        this.$router.push({ path: "studentHome" });
      } else if (Utils.getStore("userRole").role == "Admin") {
        this.$router.push({ path: "adminHome" });
      } else if (Utils.getStore("userRole").role == "Accompanist") {
        this.$router.push({ path: "createAvailability" });
      } else {
        this.$router.push({ path: "base" });
      }
    },
    resetMenu() {
      this.user = null;
      // ensures that their name gets set properly from store
      this.user = Utils.getStore("user");
      if (this.user != null) {
        this.initials = this.user.fName[0] + this.user.lName[0];
        this.name = this.user.fName + " " + this.user.lName;

        if (this.currentRole.role !== "") {
          this.activeMenus = this.menus.filter((menu) =>
            menu.roles.includes(this.currentRole.role)
          );
        }
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
    changeComp(route) {
      this.$router.push({ path: route });
    },
  },
  watch: {
    currentRole() {
      this.resetMenu();
      if (Utils.getStore("userRole").role !== this.currentRole.role) {
        this.updateLastRole(this.currentRole.role);
        this.goToHome();
      }
    },
  },
};
</script>
<style>
.text-center {
  text-align: center;
}
</style>
