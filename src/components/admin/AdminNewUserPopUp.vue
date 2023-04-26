<template>
  <v-card>
    <v-card-title>
      <v-row class="mx-1"> New User </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row class="ml-1">
        <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
      </v-row>
      <v-row> First Name: </v-row>
      <v-row>
        <v-text-field v-model="user.fName" density="compact"></v-text-field>
      </v-row>
      <v-row> Last Name: </v-row>
      <v-row>
        <v-text-field v-model="user.lName" density="compact"></v-text-field>
      </v-row>
      <v-row> Email: </v-row>
      <v-row>
        <v-text-field v-model="user.email" density="compact"></v-text-field>
      </v-row>
      <v-row> Confirm Email: </v-row>
      <v-row>
        <v-text-field v-model="secondEmail" density="compact"></v-text-field>
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
import UserDataService from "../../services/UserDataService";
import UserRoleDataService from "../../services/UserRoleDataService";
export default {
  name: "AdminNewUserPopUp",
  data: () => ({
    user: {},
    systemRoles: [],
    roleArray: [],
    errorMessage: "",
    secondEmail: "",
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
    async saveDialog() {
      if (!this.isValid()) {
        return;
      }

      await UserDataService.create(this.user)
        .then((response) => {
          this.user.id = response.data.id;
        })
        .catch((err) => {
          console.log(err);
        });
      this.user.userRoles = [];

      for (let i = 0; i < this.roleArray.length; i++) {
        var newRole = this.roleArray[i];

        var data = {
          role: newRole,
          isActive: 1,
          userId: this.user.id,
        };
        if (newRole === "Faculty") {
          data.isInstructor = 0;
          data.title = "Professor";
        }
        await UserRoleDataService.create(data)
          .then((response) => {
            this.user.userRoles.push(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      this.user.roles = await Promise.resolve(
        this.user.userRoles
          .filter((obj) => obj.isActive)
          .map((obj) => obj.role)
          .join(", ")
      );

      this.$emit("newUser", this.user);
      this.$emit("closeDialog");
    },
    isValid() {
      var result = true;

      if (this.user.fName.trim() == "") {
        this.errorMessage = "Must have a first name";
        result = false;
      } else if (this.user.lName.trim() == "") {
        this.errorMessage = "Must have a last name";
        result = false;
      } else if (this.user.email.trim() == "") {
        this.errorMessage = "Must have an email";
        result = false;
      } else if (this.user.email.trim() !== this.secondEmail.trim()) {
        this.errorMessage = "Emails do not match";
        result = false;
      } else if (
        this.users.findIndex((obj) => {
          return obj.email === this.user.email.trim();
        }) != -1
      ) {
        this.errorMessage = "That email already exists";
        result = false;
      }

      return result;
    },
  },
  async created() {
    this.user = {
      fName: "",
      lName: "",
      email: "",
    };
    this.getSystemRoles();
    this.roleArray = [];
    this.errorMessage = "";
    this.secondEmail = "";
  },
  props: {
    users: Array,
  },
  emits: ["closeDialog", "newUser"],
};
</script>
