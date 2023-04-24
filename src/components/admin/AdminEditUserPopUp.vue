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
            ></v-text-field>
          </v-row>
          <v-row> Last Name: </v-row>
          <v-row>
            <v-text-field
              v-model="selectedUser.lName"
              density="compact"
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
            ></v-select>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-5">
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="$emit('closeDialog')"
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
    errorMessage: "",
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
    saveDialog() {
      if (!this.isValid()) {
        return;
      }

      var data = {};
      const fName = this.selectedUser.fName.trim();
      const lName = this.selectedUser.lName.trim();

      if (fName !== this.user.fName) {
        data.fName = fName;
      }
      if (lName !== this.user.lName) {
        data.lName = lName;
      }

      if (data !== {}) {
        //update user
      }
    },
    isValid() {
      var result = true;

      if (this.selectedUser.fName.trim() == "") {
        this.errorMessage = "Must have a first name";
        result = false;
      } else if (this.selectedUser.lName.trim() == "") {
        this.errorMessage = "Must have a last name";
        result = false;
      }

      return result;
    },
  },
  async created() {
    this.selectedUser = Object.assign({}, this.user);
    console.log(this.selectedUser.userRoles);
    this.getSystemRoles();
    this.roleArray = this.selectedUser.userRoles
      .filter((obj) => obj.isActive)
      .map((obj) => obj.role);
    this.errorMessage = "";
  },
  props: {
    user: Object,
  },
  emits: ["closeDialog", "addColumn", "removeColumn"],
};
</script>
