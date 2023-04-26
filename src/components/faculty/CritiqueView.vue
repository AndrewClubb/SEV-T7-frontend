<template>
  <v-card>
    <v-card-title> Event Critiques: </v-card-title>
  </v-card>
  <v-container>
    <v-data-table
      :sort-by="[{ key: 'lName', order: 'asc' }]"
      :headers="studentHeaders"
      :items="students"
      :search="studentSearch"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title> STUDENTS </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="studentSearch"
            append-icon="mdi-magnify"
            label="Search by name or email"
            single-line
            hide-details
            clearable
            class="mr-2"
          ></v-text-field>
        </v-toolbar>
      </template>
      <template #item="{ item }">
        <tr>
          <td v-for="(header, index) in studentHeaders" :key="index">
            <div v-if="header.title == 'Actions'">
              <v-btn
                size="small"
                class="ml-2"
                color="primary"
                @click="displayStudent(item.raw)"
              >
                View Critiques
              </v-btn>
            </div>
            <div v-else>
              {{ item.columns[header.key] }}
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
  <v-dialog v-model="dialog" :style="{ width: '1000px' }" class="mx-auto">
    <v-card>
      <v-card-title>
        {{ selectedStudent.fName + " " + selectedStudent.lName }}
      </v-card-title>
      <v-card-text>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="event in events">
            <v-expansion-panel-title>
              <v-row>
                <v-col>
                  <v-row>
                    <strong>Date:&nbsp;</strong>
                    {{ event.date }}
                  </v-row>
                </v-col>
                <v-col>
                  <v-row>
                    <strong>Name:&nbsp;</strong>
                    {{ event.name }}
                  </v-row>
                </v-col>
                <v-col>
                  <v-row>
                    <strong>Type:&nbsp;</strong>
                    {{ " " + event.type }}
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text
              v-for="eventTimeslot in event.eventTimeslots"
            >
              <v-card color="fav">
                <v-card-title>
                  {{
                    eventTimeslot.studentTimeslots[0].studentInstrument
                      .instrument.name
                  }}
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="jurorTimeslot in eventTimeslot.jurorTimeslots"
                      cols="4"
                    >
                      <v-card elevation="15">
                        <v-card-title>
                          {{
                            jurorTimeslot.userRole.user.fName +
                            " " +
                            jurorTimeslot.userRole.user.lName
                          }}
                        </v-card-title>
                        <v-row no-gutters>
                          <v-col
                            v-for="critique in jurorTimeslot.critiques"
                            cols="6"
                          >
                            <v-card-text>
                              <strong>{{ critique.type }}</strong>
                              <div v-if="critique.grade">
                                {{ "Grade: " + critique.grade }}
                              </div>
                              <div v-if="critique.comment">
                                {{ "Comment: " + critique.comment }}
                              </div>
                            </v-card-text></v-col
                          ></v-row
                        >
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
export default {
  name: "facultyCritiqueView",
  data: () => ({
    semesters: [],
    selectedSemester: null,
    students: [],
    studentHeaders: [
      { title: "First Name", key: "fName" },
      { title: "Last Name", key: "lName" },
      { title: "Email", key: "email" },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    studentSearch: "",
    dialog: false,
    events: [],
    selectedStudent: {},
  }),
  methods: {
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesters = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getCurrentSemester() {
      this.currentDate = new Date();
      let dateString = this.currentDate.toISOString().substring(0, 10);
      await SemesterDataService.getCurrent(dateString)
        .then((response) => {
          this.selectedSemester = this.semesters.find(
            (obj) => obj.id == response.data[0].id
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async semesterSearchUpdate(semester) {
      await EventDataService.getSemesterCritiques(semester)
        .then((response) => {
          this.students = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async displayStudent(student) {
      this.selectedStudent = student;
      await EventDataService.getStudentSemesterCritiques(
        this.selectedSemester.id,
        student.id
      )
        .then((response) => {
          this.events = response.data;
          console.log(this.events);
        })
        .catch((e) => {
          console.log(e);
        });
      this.dialog = true;
    },
  },
  async mounted() {
    await this.retrieveAllSemesters();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));

    await this.getCurrentSemester();
    await this.semesterSearchUpdate(this.selectedSemester.id);
  },
};
</script>
