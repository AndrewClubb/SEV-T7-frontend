<template>
  <v-card>
    <v-card-title> Students Critiques: </v-card-title>
  </v-card>
  <v-container>
    <v-select
      v-model="selectedSemester"
      label="Semester"
      :items="semesters"
      :style="{ width: '250px' }"
      item-value="id"
      item-title="title"
      return-object
      @update:modelValue="semesterSearchUpdate(selectedSemester)"
    ></v-select>
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
        <v-expansion-panel-text v-for="eventTimeslot in event.eventTimeslots">
          <v-card color="fav">
            <v-card-title>
              {{
                eventTimeslot.studentTimeslots[0].studentInstrument.instrument
                  .name
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
    events: [],
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
          this.events = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  async mounted() {
    await this.retrieveAllSemesters();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));
    this.user = Utils.getStore("user");
    await this.getCurrentSemester();
    await this.semesterSearchUpdate(this.selectedSemester);
  },
};
</script>
