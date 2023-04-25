<template>
  <v-card>
    <v-card-title> Maintain Users: </v-card-title>
  </v-card>
  <v-container>
    <v-data-table
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
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            clearable
            class="mr-2"
          ></v-text-field>
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
    <!-- :user="selectedUser" -->
    <AdminEditUserPopUp
      :user="selectedUser"
      @close-dialog="dialog = false"
      @update-user="updateUser"
    ></AdminEditUserPopUp>
  </v-dialog>
</template>
<script>
import UserDataService from "../../services/UserDataService";
import AdminEditUserPopUp from "./AdminEditUserPopUp.vue";
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
    async updateUser(user) {
      const index = this.users.findIndex((obj) => {
        return obj.id === user.id;
      });
      this.users[index] = user;
    },
    editUser(user) {
      this.selectedUser = user;
      this.dialog = true;
    },
  },
  async mounted() {
    await this.getUsers();
  },
  components: {
    AdminEditUserPopUp,
  },
};
</script>
