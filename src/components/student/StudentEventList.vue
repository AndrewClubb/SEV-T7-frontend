<template>
  <v-card>
    <v-card-title> Sign-Up For Events: </v-card-title>
  </v-card>
  <v-alert
    v-model="alert"
    color="darkB"
    text="You are now signed up for the event!"
    closable
  >
  </v-alert>
  <v-alert
    v-model="adminAlert"
    color="darkB"
    text="You have successfully requested for a timeslot swap - you will be notified when this gets approved!"
    closable
  >
  </v-alert>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="events" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>UPCOMING EVENTS TO SIGN-UP FOR</v-toolbar-title>
            </v-toolbar>
          </template>
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in headers" :key="index">
                <div
                  v-if="
                    header.title == 'Start Time' || header.title == 'End Time'
                  "
                >
                  {{ this.formatTime(item.columns[header.key]) }}
                </div>
                <div v-else-if="header.title != 'Actions'">
                  {{ item.columns[header.key] }}
                </div>
                <div v-else>
                  <v-btn
                    small
                    color="primary"
                    @click="
                      selectedEvent = item.raw;
                      showDialog = true;
                    "
                    >Sign Up Here</v-btn
                  >
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <!-- Signing up for an event through this dialog -->
  <v-dialog v-model="showDialog" :style="{ width: '950px' }" class="mx-auto">
    <StudentSignUpPopUp
      :event-id="selectedEvent.id"
      @close-dialog="showDialog = false"
      @success-alert="alert = true"
      @request-alert="adminAlert = true"
    ></StudentSignUpPopUp>
  </v-dialog>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
import StudentSignUpPopUp from "./StudentSignUpPopUp.vue";
export default {
  name: "studentEventList",
  data: () => ({
    alert: false,
    adminAlert: false,
    events: [],
    headers: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    selectedEvent: null,
    showDialog: false,
  }),
  methods: {
    async getCurrentSemester(dateString) {
      await SemesterDataService.getCurrent(dateString)
        .then((response) => {
          this.currentSemester = response.data[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async retrieveEventsDateAndAfter(date) {
      await EventDataService.getGTEDate(date)
        .then((response) => {
          this.events = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
  },
  async mounted() {
    let currentDate = new Date();
    let dateString = currentDate.toISOString().substring(0, 10);
    await this.getCurrentSemester(dateString);
    await this.retrieveEventsDateAndAfter(dateString);
  },
  components: {
    StudentSignUpPopUp,
  },
};
</script>
