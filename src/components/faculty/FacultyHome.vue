<template>
  <v-card>
    <v-card-title> Welcome Professor John Doe! </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-card-title align="center"> Your Students </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-card-title align="center"> Event Tasks: </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "facultyHome",
  data: () => ({}),
};
</script>
