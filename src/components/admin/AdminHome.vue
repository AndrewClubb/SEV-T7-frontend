<template>
  <v-card>
    <v-card-title> Welcome Admin! </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col>
        <!-- v-for="events in facEvents" -->
        <v-card>
          <v-card-title> Event Tasks: </v-card-title>
          <v-divider></v-divider>
          <v-card-title>
            <!-- {{ events.date }} -->
            <div class="d-flex justify-space-between">
              April 21 | Jury
              <v-banner-text color="darkB"> TODAY! </v-banner-text>
              <v-btn color="primary" @click="editUpcoming()">
                Edit Upcoming
              </v-btn>
            </div></v-card-title
          >
          <v-divider inset></v-divider>
          <v-card-title>
            <div class="d-flex justify-space-between">
              April 25 | Event Hearing
              <v-btn color="primary" @click="editUpcoming()">
                Edit Upcoming
              </v-btn>
            </div></v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventDataService from "../../services/EventDataService";
export default {
  name: "AdminHome",
  components: {},
  data: () => ({ stuEvents: [] }),
  async created() {},
  methods: {
    editUpcoming() {
      this.$router.push({ path: "adminViewEvents" });
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
  },
};
</script>

<style scoped></style>
