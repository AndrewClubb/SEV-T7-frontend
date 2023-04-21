<template>
  <v-container fluid class="bg-white">
    <v-row align="start">
      <v-col>
        <v-card>
          <v-card-title> Upcoming Events: </v-card-title>
        </v-card>
        <v-container TextAlign:centered>
          You have no current upcoming events, check back later!
        </v-container>
      </v-col>
    </v-row>
    <br />
    <br />
  </v-container>
</template>

<script>
export default {
  name: "StudentUpcomingEvents",
  components: {},
  data: () => ({}),
};
</script>

<style scoped></style>
