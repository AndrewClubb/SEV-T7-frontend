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
      <v-row class="ml-1">
        <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
      </v-row>
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
import UserDataService from "../../services/UserDataService";
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
    async saveDialog() {
      if (!this.isValid()) {
        return;
      }

      this.updateUser();
      this.updateRoles();

      this.$emit("updateUser", this.selectedUser);
      this.$emit("closeDialog");
    },
    updateUser() {
      var data = {};
      var userUpdated = false;
      const fName = this.selectedUser.fName.trim();
      const lName = this.selectedUser.lName.trim();

      if (fName !== this.user.fName) {
        data.fName = fName;
        userUpdated = true;
      }
      if (lName !== this.user.lName) {
        data.lName = lName;
        userUpdated = true;
      }

      if (userUpdated) {
        data.id = this.user.id;
        console.log(data);

        UserDataService.update(data).catch((err) => {
          console.log(err);
        });
      }
    },
    async updateRoles() {
      //check if adding a role
      for (let i = 0; i < this.roleArray.length; i++) {
        var newRole = this.roleArray[i];
        var foundRole = this.selectedUser.userRoles.find((oldRole) => {
          return newRole === oldRole.role;
        });

        //found an old role
        if (foundRole !== undefined) {
          //checking if disabled
          if (!foundRole.isActive) {
            const index = this.selectedUser.userRoles.findIndex(
              (obj) => obj.id === foundRole.id
            );
            const data = {
              id: foundRole.id,
              isActive: 1,
            };
            await UserRoleDataService.update(data)
              .then((response) => {
                this.selectedUser.userRoles[index].isActive = 1;
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          var data = {
            role: newRole,
            isActive: 1,
            userId: this.selectedUser.id,
          };
          if (newRole === "Faculty") {
            data.isInstructor = 0;
            data.title = "Professor";
          }
          await UserRoleDataService.create(data)
            .then((response) => {
              this.selectedUser.userRoles.push(response.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      //check if removing a role
      for (let i = 0; i < this.selectedUser.userRoles.length; i++) {
        var oldRole = this.selectedUser.userRoles[i];
        if (
          this.roleArray.findIndex((newRole) => {
            return newRole === oldRole.role;
          }) == -1
        ) {
          const index = this.selectedUser.userRoles.findIndex(
            (obj) => obj.id === oldRole.id
          );
          const data = {
            id: oldRole.id,
            isActive: 0,
          };
          await UserRoleDataService.update(data)
            .then((response) => {
              this.selectedUser.userRoles[index].isActive = 0;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      this.selectedUser.roles = await Promise.resolve(
        this.selectedUser.userRoles
          .filter((obj) => obj.isActive)
          .map((obj) => obj.role)
          .join(", ")
      );
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
    this.getSystemRoles();
    this.roleArray = this.selectedUser.userRoles
      .filter((obj) => obj.isActive)
      .map((obj) => obj.role);
    this.errorMessage = "";
  },
  props: {
    user: Object,
  },
  emits: ["closeDialog", "updateUser"],
};
</script>
