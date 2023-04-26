<template>
  <v-card>
    <v-card-title>
      {{
        "Welcome " + userRole.title + " " + user.fName + " " + user.lName + "!"
      }}
    </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col cols="3" v-if="userRole.isInstructor">
        <v-card>
          <v-card-title align="center"> Your Students </v-card-title>
          <v-divider></v-divider>
          <v-card-title
            align="center"
            v-for="(student, index) in students"
            :key="index"
          >
            <v-menu open-on-hover>
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="text"
                  @click="viewStuRep(student.id)"
                  v-bind="props"
                >
                  {{ student.fName + " " + student.lName }}
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <v-avatar v-if="student.picture">
                    <v-img :src="student.picture"></v-img
                  ></v-avatar>
                  {{ student.fName + " " + student.lName }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <div v-if="student.userRoles[0].stuMajor">
                    {{ "Major: " + student.userRoles[0].stuMajor }}
                  </div>
                  {{ "Contact: " + student.email }}
                  <v-divider></v-divider>
                  <div v-for="stuInstrument in student.userRoles[0].student">
                    {{ stuInstrument.instrument.name }}
                    <div v-if="stuInstrument.level">
                      {{ "Vocal level: " + stuInstrument.level }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
            <v-divider v-if="index < students.length - 1"></v-divider>
          </v-card-title>
        </v-card>
      </v-col>
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
                  @click="createCrit(event.id)"
                  v-else-if="compareDates(event.date) == 0"
                >
                  Create Critiques
                </v-btn>
                <v-btn
                  color="primary"
                  @click="
                    eventId = event.id;
                    showDialog = true;
                  "
                  v-else
                >
                  Create Availability
                </v-btn>
              </div>
            </v-card-title>
            <v-divider inset></v-divider>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="showDialog" :style="{ width: '875px' }" class="mx-auto">
    <AvailabilityPopUp
      :event-id="eventId"
      :user-id="user.userId"
      @closeDialog="showDialog = false"
    ></AvailabilityPopUp>
  </v-dialog>
</template>
<script>
import EventDataService from "../../services/EventDataService";
import SemesterDataService from "../../services/SemesterDataService";
import UserRoleDataService from "../../services/UserRoleDataService";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
import AvailabilityPopUp from "./AvailabilityPopUp.vue";
import Utils from "../../config/utils";
export default {
  name: "facultyHome",
  data: () => ({
    events: [],
    eventId: null,
    id: {},
    semester: {},
    showDialog: false,
    students: {},
    user: {},
    userRole: {},
  }),
  async created() {},
  methods: {
    viewCrit() {
      this.$router.push({ path: "facultyViewCritiques" });
    },
    viewStuRep() {
      this.$router.push({ path: "facultyViewRepertoire" });
    },
    createCrit(id) {
      Utils.setStore("eventId", id);
      this.$router.push({ path: "facultyCreateCritiques" });
    },
    async getStudents() {
      StudentInstrumentDataService.getStudentsForInstructorId(this.userRole.id)
        .then((response) => {
          this.students = response.data;
        })
        .catch((err) => {
          console.log(err);
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
  },
  async mounted() {
    await this.getCurrentSemester();
    await this.getEvents();
    await this.getUserRole();
    if (this.userRole.isInstructor) {
      await this.getStudents();
    }
  },
  components: { AvailabilityPopUp },
};
</script>
