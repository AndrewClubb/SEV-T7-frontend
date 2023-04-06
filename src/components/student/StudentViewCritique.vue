<template>
  <v-row align="start">
    <v-col>
      <v-card>
        <v-card-title> Students Critiques: </v-card-title>
      </v-card>
    </v-col>
  </v-row>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-select
          v-model="selectedSemester"
          label="Semester"
          :items="semesters"
          item-value="id"
          item-title="title"
          return-object
          @update:modelValue="semesterSearchUpdate(selectedSemester)"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid class="bg-white">
    <v-card>
      <div
        v-if="selectedSemester != null && selectedSemester.code === 'SP'"
        class="text-subtitle-1 mt-4 mb-2"
        @update:modelValue="semesterSearchUpdate(selectedSemester.eventDate)"
      >
        {{ "  " + "Spring " + selectedSemester.year }}
      </div>
      <div
        v-else-if="selectedSemester != null && selectedSemester.code === 'FA'"
        class="text-subtitle-1 mt-4 mb-2"
        @update:modelValue="semesterSearchUpdate(selectedSemester.eventDate)"
      >
        {{ "  " + "Fall " + selectedSemester.year }}
      </div>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="month in months">
          <v-expansion-panel-title>
            {{ "  " + month.string }}
          </v-expansion-panel-title>
          <v-expansion-panel-text v-for="event in month.events">
            <v-row>
              <v-col
                v-for="juror in event.eventTimeslot.jurorTimeslots"
                cols="6"
              >
                <v-card elevation="15">
                  <v-card-title>
                    {{
                      event.eventTimeslot.event.date +
                      " " +
                      event.eventTimeslot.event.type
                    }}
                  </v-card-title>
                  <v-card-text justify="center" class="pa-1 ma-1">
                    {{
                      "Critiquer: " +
                      juror.userRole.user.fName +
                      " " +
                      juror.userRole.user.lName
                    }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      variant="plain"
                      class="text-center"
                      @click="setSelectedJurorCritiques(juror.critiques)"
                    >
                      Click to see critique
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-text v-for="critique in selectedJurorCritiques">
          <div v-if="critique.type !== null">
            <strong>{{ critique.type }}</strong>
          </div>
          <div v-if="critique.grade !== null">
            {{ " Grade: " + critique.grade }}
          </div>
          <div v-if="critique.comment !== null">
            {{ " Comments: " + critique.comment }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn block @click="dialog = false">Close Critique</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
import Utils from "../../config/utils.js";
export default {
  name: "StudentViewCritique",
  data: () => ({
    user: {},
    semesters: [],
    selectedSemester: null,
    semesterCritiques: [],
    showDialog: false,
    selectedStudent: null,
    headers: [
      { title: "Event Date", key: "eventDate" },
      { title: "First Name", key: "studentFName" },
      { title: "Last Name", key: "studentLName" },
      { title: "Event Type", key: "eventType" },
      { title: " " },
    ],
    months: [],
    dialog: false,
    selectedJurorCritiques: {},
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
      await EventDataService.getStudentSemesterCritiques(
        semester.id,
        this.user.userId
      )
        .then((response) => {
          this.semesterCritiques = response.data;

          this.semesterCritiques.forEach((entry) => {
            var date = new Date(entry.eventTimeslot.event.date);
            entry.month = {
              string: date.toLocaleDateString("us-EN", { month: "long" }),
              number: date.toLocaleDateString("us-EN", { month: "numeric" }),
            };
          });
          this.getMonths();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    displayStudentCritiques(student) {
      this.selectedStudent = student;
      this.showDialog = true;
    },
    getMonths() {
      this.months = [];
      const compareObj = (a, b) => a.number == b.number;

      this.semesterCritiques.forEach((obj) => {
        if (!this.months.some((item) => compareObj(item, obj.month))) {
          this.months.push(obj.month);
        }
      });

      this.months.forEach((obj) => {
        obj.events = this.semesterCritiques.filter(
          (critique) => critique.month.number == obj.number
        );
      });

      this.months.sort(function (a, b) {
        return b.number - a.number;
      });

      console.log(this.months);
    },
    getMonth(month) {
      const monthArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return monthArray[month - 1];
    },
    setSelectedJurorCritiques(critique) {
      this.selectedJurorCritiques = critique;
      this.dialog = true;
    },
  },
  async mounted() {
    await this.retrieveAllSemesters();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));
    this.user = Utils.getStore("user");
    await this.getCurrentSemester();
    console.log(this.selectedSemester);
    await this.semesterSearchUpdate(this.selectedSemester);
  },
};
</script>

<style scoped></style>
