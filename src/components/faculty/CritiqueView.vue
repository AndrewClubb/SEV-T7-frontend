<template>
  <v-card>
    <v-card-title> Event Critiques: </v-card-title>
  </v-card>
  <!-- <v-container>
    <v-row>
      <v-col cols="3">
        <v-select
          v-model="selectedSemester"
          label="Semester"
          :items="semesters"
          item-value="id"
          item-title="title"
          @update:modelValue="semesterSearchUpdate(selectedSemester)"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filteredCritiques"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>FILTER BY</v-toolbar-title>
              <v-select
                clearable
                v-model="studentFilter"
                label="Student"
                :items="studentFilterArray"
                :style="{ width: '70px' }"
                @update:modelValue="filterCritiques()"
              ></v-select>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-select
                clearable
                v-model="typeFilter"
                label="Event Type"
                :items="typeFilterArray"
                :style="{ width: '70px' }"
                @update:modelValue="filterCritiques()"
              ></v-select>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-select
                clearable
                v-model="monthFilter"
                label="Month"
                :items="monthFilterArray"
                :style="{ width: '70px' }"
                @update:modelValue="filterCritiques()"
              ></v-select>
            </v-toolbar>
          </template>
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in headers" :key="index">
                <div v-if="header.title == 'Event Date'">
                  {{ this.formatDate(item.columns[header.key]) }}
                </div>
                <div v-else-if="header.title != ' '">
                  {{ item.columns[header.key] }}
                </div>
                <div v-else>
                  <v-btn
                    small
                    color="primary"
                    @click="displayStudentCritiques(item.raw)"
                    >View Critiques</v-btn
                  >
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="showDialog"
    ><v-card>
      <v-card-title>
        <span class="headline">{{
          selectedStudent.studentInstrument.student.user.fName +
          " " +
          selectedStudent.studentInstrument.student.user.lName +
          "'s critiques"
        }}</span>
      </v-card-title>
      <v-card-text
        ><v-card
          v-for="juror in selectedStudent.eventTimeslot.jurorTimeslots"
          class="elevation-2 pa-1 ma-1"
        >
          <v-card-title>
            <span class="headline"
              >{{
                juror.userRole.user.fName +
                " " +
                juror.userRole.user.lName +
                "'s comments"
              }}
              <v-divider></v-divider
            ></span>
          </v-card-title>
          <v-card-text v-for="comment in juror.critiques">
            <p>
              <b>{{ comment.type + ":" }}</b>
            </p>
            <p>
              <b v-if="comment.grade != null">{{
                "Grade: (" + comment.grade + ")"
              }}</b>
            </p>
            <p>{{ comment.comment }}</p>
          </v-card-text></v-card
        ></v-card-text
      >
      <v-card-actions>
        <v-btn color="primary" @click="showDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
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
      <v-card-title></v-card-title>
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
    // semesterCritiques: [],
    // filteredCritiques: [],
    // studentFilterArray: [],
    // studentFilter: null,
    // typeFilterArray: [],
    // typeFilter: null,
    // monthFilterArray: [],
    // monthFilter: null,
    // showDialog: false,
    // selectedStudent: null,
    // headers: [
    //   { title: "Event Date", key: "eventTimeslot.event.date" },
    //   { title: "First Name", key: "studentInstrument.student.user.fName" },
    //   { title: "Last Name", key: "studentInstrument.student.user.lName" },
    //   { title: "Event Type", key: "eventTimeslot.event.type" },
    //   { title: " " },
    // ],
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
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async displayStudent(student) {
      console.log(this.selectedSemester.id, student.id);
      await EventDataService.getStudentSemesterCritiques(
        this.selectedSemester.id,
        student.id
      )
        .then((response) => {
          this.events = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
      this.dialog = true;
    },
    // async semesterSearchUpdate(semester) {
    //   await EventDataService.getSemesterCritiques(semester)
    //     .then((response) => {
    //       this.semesterCritiques = response.data;
    //       this.semesterCritiques.forEach((entry) => {
    //         entry.stuName =
    //           entry.studentInstrument.student.user.fName +
    //           " " +
    //           entry.studentInstrument.student.user.lName;

    //         entry.month = new Date(
    //           entry.eventTimeslot.event.date
    //         ).toLocaleDateString("us-EN", { month: "long" });
    //       });
    //       this.filteredCritiques = this.semesterCritiques;
    //       this.fillFilters();
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // },
    // displayStudentCritiques(student) {
    //   this.selectedStudent = student;
    //   this.showDialog = true;
    // },
    // fillFilters() {
    //   let set = new Set();
    //   this.studentFilter = undefined;
    //   this.semesterCritiques.forEach((obj) => set.add(obj.stuName));
    //   this.studentFilterArray = Array.from(set).sort();

    //   set = new Set();
    //   this.typeFilter = undefined;
    //   this.semesterCritiques.forEach((obj) =>
    //     set.add(obj.eventTimeslot.event.type)
    //   );
    //   this.typeFilterArray = Array.from(set);

    //   set = new Set();
    //   this.monthFilter = undefined;
    //   this.semesterCritiques.forEach((obj) => set.add(obj.month));
    //   this.monthFilterArray = Array.from(set);
    // },
    // filterCritiques() {
    //   if (
    //     this.studentFilter != undefined ||
    //     this.typeFilter != undefined ||
    //     this.monthFilter != undefined
    //   ) {
    //     this.filteredCritiques = this.semesterCritiques.filter((obj) => {
    //       var isValid = true;

    //       if (this.studentFilter != undefined) {
    //         isValid = obj.stuName == this.studentFilter;
    //       }
    //       if (isValid && this.typeFilter != undefined) {
    //         isValid = obj.eventTimeslot.event.type == this.typeFilter;
    //       }
    //       if (isValid && this.monthFilter != undefined) {
    //         isValid = obj.month == this.monthFilter;
    //       }

    //       return isValid;
    //     });
    //   } else {
    //     this.filteredCritiques = this.semesterCritiques;
    //   }
    // },
    // formatDate(date) {
    //   return new Date(date).toLocaleDateString("us-EN", {
    //     month: "long",
    //     day: "numeric",
    //   });
    // },
  },
  async mounted() {
    await this.retrieveAllSemesters();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));

    await this.getCurrentSemester();
    await this.semesterSearchUpdate(this.selectedSemester.id);
  },
};
</script>
