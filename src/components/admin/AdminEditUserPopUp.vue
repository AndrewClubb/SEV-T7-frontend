<template>
  <v-card>
    <v-card-title> Edit User </v-card-title>
    <v-card-text> </v-card-text>
    <v-card-actions class="mt-5">
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="closeDialog"
        >Cancel</v-btn
      >
      <v-btn color="blue-darken-1" variant="text" @click="editEventConfirm"
        >SAVE</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "adminEditUserPopUp",
  data: () => ({
    selectedUser: {},
  }),
  methods: {},
  async created() {
    this.selectedUser = new Object({}, this.user);
  },
  props: {
    user: Object,
  },
};
</script>
