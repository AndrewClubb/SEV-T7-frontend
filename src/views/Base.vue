<template>
  <v-container fluid class="fill-height">
    <MainNav></MainNav>
    <v-row class="fill-height">
      <v-col class="bg-white">
        <!-- Your components go here -->
        <div class="grid-container">
          <!-- Student Section -->
          <StudentHome
            v-if="this.$route.fullPath === '/studentHome'"
          ></StudentHome>
          <StudentSettings
            v-if="this.$route.fullPath === '/studentSettings'"
          ></StudentSettings>
          <FacultyCreateCritique
            v-if="this.$route.fullPath === '/facultyCreateCritiques'"
          ></FacultyCreateCritique>
          <StudentEventList
            v-if="this.$route.fullPath === '/studentEventSignUps'"
          ></StudentEventList>
          <StudentViewCritique
            v-if="this.$route.fullPath === '/studentCritiques'"
          ></StudentViewCritique>
          <!-- Faculty Section -->
          <FacultyHome v-if="this.$route.fullPath === '/facultyHome'">
          </FacultyHome>
          <FacultyCritiqueView
            v-if="this.$route.fullPath === '/facultyViewCritiques'"
          ></FacultyCritiqueView>
          <!-- Admin Section -->
          <AdminHome v-if="this.$route.fullPath === '/adminHome'"> </AdminHome>
          <AdminMaintainEvent
            v-if="this.$route.fullPath === '/adminViewEvents'"
          >
          </AdminMaintainEvent>
          <AdminMaintainUserVue
            v-if="this.$route.fullPath === '/adminViewUsers'"
          ></AdminMaintainUserVue>
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
// Import all components and insert into homepage
import StudentSettings from "../components/student/StudentSettings.vue";
import MainNav from "../components/MainNav.vue";
import StudentHome from "../components/student/StudentHome.vue";
import FacultyHome from "../components/faculty/FacultyHome.vue";
import AdminHome from "../components/admin/AdminHome.vue";
import FacultyCreateCritique from "../components/faculty/FacultyCreateCritique.vue";
import StudentEventList from "../components/student/StudentEventList.vue";
import StudentViewCritique from "../components/student/StudentViewCritique.vue";
import FacultyCritiqueView from "../components/faculty/CritiqueView.vue";
import CreateAvailability from "../components/faculty/CreateAvailability.vue";
import StudentRepertoire from "../components/student/StudentRepertoire.vue";
import AdminMaintainEvent from "../components/admin/AdminMaintainEvent.vue";
import AdminMaintainUserVue from "../components/admin/AdminMaintainUser.vue";
export default {
  name: "Base",
  components: {
    MainNav,
    //Student Component
    StudentSettings,
    StudentHome,
    StudentEventList,
    FacultyCreateCritique,
    StudentViewCritique,
    StudentRepertoire,
    //Faculty Component
    FacultyHome,
    FacultyCritiqueView,
    CreateAvailability,
    //Admin Component
    AdminHome,
    AdminMaintainEvent,
    AdminMaintainUserVue,
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
