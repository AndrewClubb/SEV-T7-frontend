<template>
  <v-card>
    <v-card-title> Event Critiques: </v-card-title>
  </v-card>
  <v-container>
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
    semesterCritiques: [],
    filteredCritiques: [],
    studentFilterArray: [],
    studentFilter: null,
    typeFilterArray: [],
    typeFilter: null,
    monthFilterArray: [],
    monthFilter: null,
    showDialog: false,
    selectedStudent: null,
    headers: [
      { title: "Event Date", key: "eventTimeslot.event.date" },
      { title: "First Name", key: "studentInstrument.student.user.fName" },
      { title: "Last Name", key: "studentInstrument.student.user.lName" },
      { title: "Event Type", key: "eventTimeslot.event.type" },
      { title: " " },
    ],
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
          this.semesterCritiques = response.data;
          this.semesterCritiques.forEach((entry) => {
            entry.stuName =
              entry.studentInstrument.student.user.fName +
              " " +
              entry.studentInstrument.student.user.lName;

            entry.month = new Date(
              entry.eventTimeslot.event.date
            ).toLocaleDateString("us-EN", { month: "long" });
          });
          this.filteredCritiques = this.semesterCritiques;
          this.fillFilters();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    displayStudentCritiques(student) {
      this.selectedStudent = student;
      this.showDialog = true;
    },
    fillFilters() {
      let set = new Set();
      this.studentFilter = undefined;
      this.semesterCritiques.forEach((obj) => set.add(obj.stuName));
      this.studentFilterArray = Array.from(set).sort();

      set = new Set();
      this.typeFilter = undefined;
      this.semesterCritiques.forEach((obj) =>
        set.add(obj.eventTimeslot.event.type)
      );
      this.typeFilterArray = Array.from(set);

      set = new Set();
      this.monthFilter = undefined;
      this.semesterCritiques.forEach((obj) => set.add(obj.month));
      this.monthFilterArray = Array.from(set);
    },
    filterCritiques() {
      if (
        this.studentFilter != undefined ||
        this.typeFilter != undefined ||
        this.monthFilter != undefined
      ) {
        this.filteredCritiques = this.semesterCritiques.filter((obj) => {
          var isValid = true;

          if (this.studentFilter != undefined) {
            isValid = obj.stuName == this.studentFilter;
          }
          if (isValid && this.typeFilter != undefined) {
            isValid = obj.eventTimeslot.event.type == this.typeFilter;
          }
          if (isValid && this.monthFilter != undefined) {
            isValid = obj.month == this.monthFilter;
          }

          return isValid;
        });
      } else {
        this.filteredCritiques = this.semesterCritiques;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("us-EN", {
        month: "long",
        day: "numeric",
      });
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
