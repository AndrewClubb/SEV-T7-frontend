<template>
  <v-card>
    <v-card-title> Faculty Create Critique: </v-card-title>
  </v-card>
  <v-container>
    <div v-if="timeslots.length === 0">
      <v-row>
        <v-spacer></v-spacer>
        <strong>There are no timeslots today</strong>
        <v-spacer></v-spacer>
      </v-row>
    </div>
    <div v-else>
      <v-data-table
        :headers="headers"
        :items="timeslots.eventTimeslots"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{
              "Today's " + this.timeslots.type + ": " + this.timeslots.name
            }}</v-toolbar-title>
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
                  @click="displayEventAvailability(item.raw)"
                  >Create Availability</v-btn
                >
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>
<script>
import EventDataService from "../../services/EventDataService";
export default {
  name: "FacultyCreateCritique",
  data: () => ({
    timeslots: [],
    headers: [
      { title: "Student(s)", key: "studentNames" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", key: "actions", sortable: false },
    ],
  }),
  methods: {
    async fillTimeslots() {
      await EventDataService.getStudentTimeslotsForEvent(this.eventId)
        .then((response) => {
          this.timeslots = response.data[0];
          this.timeslots.eventTimeslots.forEach((obj) => {
            var names = [];
            obj.studentTimeslots.forEach((stuObj) => {
              names.push(
                stuObj.studentInstrument.student.user.fName +
                  " " +
                  stuObj.studentInstrument.student.user.lName
              );
            });

            obj.studentNames = names.join(", ");
          });
          console.log(this.timeslots);
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
    await this.fillTimeslots();
  },
  props: {
    eventId: Number,
  },
};
</script>
