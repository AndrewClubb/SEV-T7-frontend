<template>
  <v-card>
    <v-card-title> Maintain Users: </v-card-title>
  </v-card>
  <v-container>
    <v-data-table
      :sort-by="[{ key: 'lName', order: 'asc' }]"
      :headers="userHeaders"
      :items="users"
      :search="userSearch"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title> USERS </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="userSearch"
            label="Search by name, email, or role"
            single-line
            hide-details
            clearable
            class="mr-2"
          ></v-text-field>
          <v-btn color="primary" @click="addUser()">Add User</v-btn>
        </v-toolbar>
      </template>
      <template #item="{ item }">
        <tr>
          <td v-for="(header, index) in userHeaders" :key="index">
            <div v-if="header.title == 'Actions'">
              <v-icon size="small" class="me-2" @click="editUser(item.raw)">
                mdi-pencil
              </v-icon>
            </div>
            <div v-else>
              {{ item.columns[header.key] }}
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
  <v-dialog v-model="dialog" width="350px">
    <AdminEditUserPopUp
      :user="selectedUser"
      @close-dialog="dialog = false"
      @update-user="updateUser"
    ></AdminEditUserPopUp>
  </v-dialog>
  <v-dialog v-model="newUserDialog" width="350px">
    <AdminNewUserPopUp
      :users="users"
      @close-dialog="newUserDialog = false"
      @new-user="newUser"
    ></AdminNewUserPopUp>
  </v-dialog>
</template>
<script>
import UserDataService from "../../services/UserDataService";
import AdminEditUserPopUp from "./AdminEditUserPopUp.vue";
import AdminNewUserPopUp from "./AdminNewUserPopUp.vue";
export default {
  name: "adminMaintainUser",
  data: () => ({
    users: [],
    userSearch: "",
    userHeaders: [
      { title: "First Name", key: "fName" },
      { title: "Last Name", key: "lName" },
      { title: "Email", key: "email" },
      { title: "Roles", key: "roles" },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    selectedUser: {},
    dialog: false,
    newUserDialog: false,
  }),
  methods: {
    async getUsers() {
      await UserDataService.getAllWithRoles()
        .then((response) => {
          this.users = response.data;
          this.users.forEach(async (user) => {
            user.roles = await Promise.resolve(
              user.userRoles
                .filter((obj) => obj.isActive)
                .map((obj) => obj.role)
                .join(", ")
            );
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateUser(user) {
      const index = this.users.findIndex((obj) => {
        return obj.id === user.id;
      });
      this.users[index] = user;
    },
    editUser(user) {
      this.selectedUser = user;
      this.dialog = true;
    },
    addUser() {
      this.newUserDialog = true;
    },
    newUser(user) {
      this.users.push(user);
    },
  },
  async mounted() {
    await this.getUsers();
  },
  components: {
    AdminEditUserPopUp,
    AdminNewUserPopUp,
  },
};
</script>
