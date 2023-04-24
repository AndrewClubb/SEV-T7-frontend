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
          <v-toolbar-title> EVENTS </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="userSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template #item="{ item }">
        <tr>
          <td v-for="(header, index) in userHeaders" :key="index">
            <div v-if="header.title == 'Actions'">
              <v-icon size="small" class="me-2" @click="editEvent(item.raw)">
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
</template>
<script>
import UserDataService from "../../services/UserDataService";
export default {
  name: "adminMaintainUser",
  data: () => ({
    users: [],
    userSearch: "",
    userHeaders: [
      { title: "First Name", key: "fName" },
      { title: "Last Name", key: "lName" },
      { title: "Roles", key: "" },
      { title: "Actions", sortable: false, allign: "end" },
    ],
  }),
  methods: {
    async getUsers() {
      await UserDataService.getAllWithRoles()
        .then((response) => {
          this.users = response.data;
          console.log(this.users);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  async mounted() {
    await this.getUsers();
  },
};
</script>
