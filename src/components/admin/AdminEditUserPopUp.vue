<template>
  <v-card>
    <v-card-title>
      <v-row class="mx-1">
        {{ "Editing: " + user.fName + " " + user.lName }}
        <v-spacer></v-spacer>
        {{ selectedUser.email }}
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row class="mt-1">
        <!-- Generic col-->
        <v-col>
          <v-row> First Name: </v-row>
          <v-row>
            <v-text-field
              v-model="selectedUser.fName"
              density="compact"
              :style="{ width: '175px' }"
            ></v-text-field>
          </v-row>
          <v-row> Last Name: </v-row>
          <v-row>
            <v-text-field
              v-model="selectedUser.lName"
              density="compact"
              :style="{ width: '175px' }"
            ></v-text-field>
          </v-row>
          <v-row> Roles: </v-row>
          <v-row>
            <v-select
              chips
              multiple
              v-model="roleArray"
              :items="systemRoles"
              density="compact"
              :style="{ width: '175px' }"
            ></v-select>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-5">
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="closeDialog"
        >Cancel</v-btn
      >
      <v-btn color="blue-darken-1" variant="text" @click="saveDialog"
        >SAVE</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script>
import UserRoleDataService from "../../services/UserRoleDataService";
export default {
  name: "adminEditUserPopUp",
  data: () => ({
    selectedUser: {},
    systemRoles: [],
    roleArray: [],
  }),
  methods: {
    async getSystemRoles() {
      await UserRoleDataService.getUniqueRoles()
        .then((response) => {
          this.systemRoles = response.data.map((obj) => obj.role);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeDialog() {},
    saveDialog() {},
  },
  async created() {
    this.selectedUser = Object.assign({}, this.user);
    this.getSystemRoles();
    this.roleArray = this.selectedUser.userRoles.map((obj) => obj.role);
  },
  props: {
    user: Object,
  },
  emits: ["closeDialog", "addColumn", "removeColumn"],
};
</script>
