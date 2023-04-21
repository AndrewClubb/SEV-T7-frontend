<template>
  <v-card>
    <v-card-title> Welcome Professor Alexandria Adams! </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-card-title align="center"> Your Students </v-card-title>
          <v-divider></v-divider>
          <v-card-title align="center">
            <v-btn variant="text" @click="viewStuRep()"> Andrew Clubb </v-btn>
            <v-divider></v-divider>
            <v-btn variant="text" @click="viewStuRep()">
              Alexandria Adams
            </v-btn>
            <v-divider></v-divider>
            <v-btn variant="text" @click="viewStuRep()">
              Jasmine Haulsey
            </v-btn>
            <v-divider></v-divider>
            <v-btn variant="text" @click="viewStuRep()"> Chloe Sheasby </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-card-title> Event Tasks: </v-card-title>
          <v-divider></v-divider>
          <div v-for="event in events">
            <v-card-title v-if="this.compareDates(event.date) < 0">
              <div class="d-flex justify-space-between">
                {{ this.formatDate(event.date) }} | {{ event.type }}
                <!-- v-if(dateCompareResult) -->
                <v-btn color="primary" @click="viewCrit()">
                  View Critiques
                </v-btn>
              </div></v-card-title
            >
            <v-divider inset></v-divider>
            <v-card-title v-if="this.compareDates(event.date) == 0">
              <div class="d-flex justify-space-between">
                {{ this.formatDate(event.date) }} | {{ event.type }}
                <v-banner-text color="darkB"> TODAY! </v-banner-text>
                <v-btn color="primary" @click="createCrit(event.id)">
                  Create Critiques
                </v-btn>
              </div></v-card-title
            >
            <v-divider inset></v-divider>
            <v-card-title v-if="this.compareDates(event.date) > 0">
              <!-- {{ events.date }} -->
              <div class="d-flex justify-space-between">
                {{ this.formatDate(event.date) }} | {{ event.type }}
                <v-btn color="primary" @click="createAvail()">
                  Create Availability
                </v-btn>
              </div></v-card-title
            >
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
import Utils from "../../config/utils";
export default {
  name: "facultyHome",
  data: () => ({
    events: [],
    semester: {},
    id: {},
  }),
  async created() {},
  methods: {
    viewCrit() {
      this.$router.push({ path: "facultyViewCritiques" });
    },
    createCrit(id) {
      Utils.setStore("eventId", id);
      this.$router.push({ path: "facultyCreateCritiques" });
    },
    createAvail() {
      this.$router.push({ path: "createAvailability" });
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
          console.log(this.semester.id);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async semesterUpdated() {
      await EventDataService.getBySemester(this.semester.id)
        .then((response) => {
          this.events = response.data;
          console.log(this.events);
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
    await this.semesterUpdated();
  },
};
</script>
