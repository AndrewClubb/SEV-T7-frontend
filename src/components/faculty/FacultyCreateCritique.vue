<template>
  <v-card>
    <v-card-title> Faculty Create Critique: </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <strong>{{
        "Today's " + this.timeslots.type + ": " + this.timeslots.name
      }}</strong>
      <v-spacer></v-spacer>
    </v-row>
    <v-data-table :headers="headers" :items="timeslots" class="elevation-1">
      <!-- <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>UPCOMING EVENTS</v-toolbar-title>
        </v-toolbar>
      </template>
      <template #item="{ item }">
        <tr>
          <td v-for="(header, index) in headers" :key="index">
            <div
              v-if="header.title == 'Start Time' || header.title == 'End Time'"
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
      </template> -->
    </v-data-table>
  </v-container>
</template>
<script>
import EventDataService from "../../services/EventDataService";
export default {
  name: "FacultyCreateCritique",
  data: () => ({
    timeslots: [],
    // headers: [
    //   { title: "Event Type", key: "type" },
    //   { title: "Event Date", key: "date" },
    //   { title: "Start Time", key: "startTime" },
    //   { title: "End Time", key: "endTime" },
    //   { title: "Actions", key: "actions", sortable: false },
    // ],
  }),
  methods: {
    async fillTimeslots() {
      await EventDataService.getStudentTimeslotsForEvent(this.eventId)
        .then((response) => {
          this.timeslots = response.data[0];
          console.log(this.timeslots);
        })
        .catch((err) => {
          console.log(err);
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
