<template>
  <v-card>
    <v-card-title>
      {{ "Welcome " + " " + user.fName + " " + user.lName + "!" }}
    </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Event Tasks: </v-card-title>
          <v-divider></v-divider>
          <div v-for="(event, index) in events" :key="index">
            <v-card-title>
              <div class="d-flex justify-space-between">
                {{ this.formatDate(event.date) }} | {{ event.type }}
                <v-banner-text
                  color="darkB"
                  v-if="this.compareDates(event.date) == 0"
                >
                  TODAY!
                </v-banner-text>
                <v-btn
                  color="primary"
                  @click="viewCrit()"
                  v-if="compareDates(event.date) < 0"
                >
                  View Critiques
                </v-btn>
                <v-btn
                  color="primary"
                  @click="
                    eventId = event.id;
                    showDialog = true;
                  "
                  v-else-if="compareDates(event.date) > 0"
                >
                  Sign Up
                </v-btn>
              </div>
            </v-card-title>
            <v-divider inset></v-divider>
          </div>
          <!-- <v-card-title> Event Tasks: </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            <div class="d-flex justify-space-between">
              April 18 | Recital Hearing
              <v-btn color="primary" @click="viewCrit()">
                View Critiques
              </v-btn>
            </div></v-card-title
          >
          <v-divider inset></v-divider>
          <v-card-title>
            <div class="d-flex justify-space-between">
              April 21 | Jury
              <v-banner-text color="darkB"> TODAY! </v-banner-text>
              <v-btn color="primary" @click="goSignUp()"> Sign Up </v-btn>
            </div></v-card-title
          > -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="showDialog" :style="{ width: '875px' }" class="mx-auto">
    <StudentSignUpPopUp
      :event-id="eventId"
      @closeDialog="showDialog = false"
    ></StudentSignUpPopUp>
  </v-dialog>
</template>

<script>
import EventDataService from "../../services/EventDataService";
import SemesterDataService from "../../services/SemesterDataService";
import UserRoleDataService from "../../services/UserRoleDataService";
import StudentSignUpPopUp from "./StudentSignUpPopUp.vue";
import Utils from "../../config/utils";
export default {
  name: "StudentHome",
  components: {},
  data: () => ({
    events: [],
    eventId: null,
    id: {},
    semester: {},
    showDialog: false,
    user: {},
    userRole: {},
  }),
  async created() {},
  methods: {
    compareDates(input) {
      const today = new Date();
      const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

      if (input > todayString) {
        return 1;
      } else if (input == todayString) {
        return 0;
      } else {
        return -1;
      }
    },
    formatDate(date) {
      if (date === null || date === undefined) {
        return date;
      }
      return new Date(date).toLocaleDateString("us-US", {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    },
    viewCrit() {
      // Utils.setStore("eventId", id);
      this.$router.push({ path: "studentCritiques" });
    },
    // goSignUp(id) {
    //   Utils.setStore("eventId", id);
    //   this.$router.push({ path: "studentEventSignUps" });
    // },
    async getEvents() {
      await EventDataService.getBySemester(this.semester.id)
        .then((response) => {
          this.events = response.data;
          this.events.sort(function (a, b) {
            if (a.date > b.date) {
              return -1;
            } else {
              return 1;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async retrieveAllEvents() {
      await EventDataService.getAll()
        .then((response) => {
          this.events = response.data;
          this.events.forEach((obj) => (obj.title = obj.date));
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getCurrentSemester() {
      this.currentDate = new Date();
      let dateString = this.currentDate.toISOString().substring(0, 10);
      await SemesterDataService.getCurrent(dateString)
        .then((response) => {
          this.semester = response.data[0];
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getUserRole() {
      this.user = Utils.getStore("user");
      await UserRoleDataService.getRolesForUser(this.user.userId)
        .then((response) => {
          this.userRole = response.data.find((obj) => {
            return obj.role === Utils.getStore("userRole").role;
          });
          console.log("user", this.user);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  async mounted() {
    await this.getCurrentSemester();
    await this.getEvents();
    await this.getUserRole();
  },
  components: { StudentSignUpPopUp },
};
</script>

<style scoped></style>
