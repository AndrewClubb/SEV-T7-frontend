<template>
  <v-card>
    <v-card-title>
      {{ "Welcome Admin " + user.fName + " " + user.lName + "!" }}
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
                <v-btn color="primary" @click="editEvent()"> Edit Event </v-btn>
              </div>
            </v-card-title>
            <v-divider inset></v-divider>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventDataService from "../../services/EventDataService";
import SemesterDataService from "../../services/SemesterDataService";
import UserRoleDataService from "../../services/UserRoleDataService";
import Utils from "../../config/utils";
export default {
  name: "AdminHome",
  components: {},
  data: () => ({
    events: [],
    eventId: null,
    id: {},
    semester: {},
    user: {},
    userRole: {},
  }),
  async created() {},
  methods: {
    editEvent() {
      this.$router.push({ path: "adminViewEvents" });
    },
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
    async getUserRole() {
      this.user = Utils.getStore("user");
      await UserRoleDataService.getRolesForUser(this.user.userId)
        .then((response) => {
          this.userRole = response.data.find((obj) => {
            return obj.role === Utils.getStore("userRole").role;
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
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
  },
  async mounted() {
    await this.getUserRole();
    await this.getCurrentSemester();
    await this.getEvents();
    await this.getCurrentSemester();
  },
};
</script>

<style scoped></style>
