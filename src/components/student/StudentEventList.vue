<!-- Basically tutorialsList -->
<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <!-- Make it so only the events in the future are shown -->
          <h3>Events</h3>
          <br />
          <v-card height="500" width="300" class="scrollable">
            <v-btn
              v-for="event in events"
              :key="event.id"
              v-on:click="changeCurrentEvent(event)"
              variant="tonal"
              v-bind:color="event.id === currentEvent.id ? 'blue' : 'black'"
            >
              {{ event.type + " - " + event.date }}
            </v-btn>
          </v-card>

          <br />
        </v-col>
        <v-col>
          <!-- Make it so the event times can be scrolled through without scrolling through the entire page. 
          Next button would be under the time scrolling -->
          <h3>Avaliable Times</h3>
          <br />
          <v-card height="500" class="scrollable">
            <v-checkbox
              v-for="(time, index) in currentEventTimes"
              :key="index"
              v-model="selectedEventTimes"
              :label="time.startTime"
              :value="time"
            >
              <!-- Use v-bind (: for short) to dynamically change attributes -->
            </v-checkbox>
          </v-card>

          <!-- <p>{{ selectedEventTimes }}</p> -->
          <br />
          <v-btn>Next</v-btn>
          <!-- Need some logic to get the type of instrument the student is using -->
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- make a button to pass to event signup page https://stackoverflow.com/questions/45484684/vue-js-pass-data-to-component-on-another-route -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import EventDataService from "../../services/EventDataService";
import EventTimeDataService from "../../services/EventTimeDataService";
// change the name of EventTimeDataService to EventTimeslotDataService
export default {
  name: "student-event-list",
  data: () => ({
    dialog: false,
    search: "",
    events: [],
    currentEvent: {},
    currentEventTimes: [],
    selectedEventTimes: [],
    currentDate: new Date(),
  }),
  methods: {
    changeCurrentEvent(event) {
      this.currentEvent = event;
      this.determineEventTimes();
      // console.log(this.currentEvent.id);
    },

    async retrieveEventsDateAndAfter(date) {
      await EventDataService.getGTEDate(date)
        .then((response) => {
          this.events = response.data;
          // console.log(this.events);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async retrieveEvents() {
      await EventDataService.getAll()
        .then((response) => {
          this.events = response.data;
          // console.log(this.events);
        })
        .catch((e) => {
          console.log(e);
        });

      // Narrow down to events in the future
    },
    async retrieveEventTimes(eventId) {
      await EventTimeDataService.getByEvent(eventId)
        .then((response) => {
          this.currentEventTimes = response.data;
          // console.log(this.currentEventTimes);
        })
        .catch((e) => {
          console.log(e);
        });

      // Narrow down to events in the future
    },

    async determineEventTimes() {
      this.selectedEventTimes = [];
      await this.retrieveEventTimes(this.currentEvent.id);
    },

    async retrieveCourses() {
      await CourseDataService.getAll()
        .then((response) => {
          this.courses = response.data;
          this.filteredCourses = this.courses;
          // console.log(this.courses);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  async mounted() {
    this.currentDate = new Date();
    let dateString = this.currentDate.toISOString().substring(0, 10);
    await this.retrieveEventsDateAndAfter(dateString);
  },
};
</script>
<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.scrollable {
  overflow-y: scroll;
}
</style>
