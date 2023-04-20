<template>
  <v-card>
    <v-card-title> Faculty Create Critique: </v-card-title>
  </v-card>
  <v-container>
    <div v-if="timeslots.length === 0">
      <v-row>
        <v-spacer></v-spacer>
        <strong>There are no timeslots today</strong>
        <v-spacer></v-spacer>
      </v-row>
    </div>
    <div v-else>
      <v-data-table
        :headers="headers"
        :items="timeslots.eventTimeslots"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{
              "Today's " + this.timeslots.type + ": " + this.timeslots.name
            }}</v-toolbar-title>
          </v-toolbar>
        </template>
        <template #item="{ item }">
          <tr>
            <td v-for="(header, index) in headers" :key="index">
              <div
                v-if="
                  header.title == 'Start Time' || header.title == 'End Time'
                "
              >
                {{ this.formatTime(item.columns[header.key]) }}
              </div>
              <div v-else-if="header.title != 'Actions'">
                {{ item.columns[header.key] }}
              </div>
              <div v-else>
                <v-btn
                  v-if="true"
                  small
                  color="primary"
                  @click="createCritiques(item.raw)"
                  >Create Critiques</v-btn
                >
                <v-btn
                  v-else
                  small
                  color="primary"
                  @click="editCritiques(item.raw)"
                  >Edit Critiques</v-btn
                >
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </v-container>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col>
            {{ "Date: " + this.timeslots.date }}
          </v-col>
          <v-spacer></v-spacer>
          <v-col align="end">
            {{ "Type: " + this.timeslots.type }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="mb-5 mt-2">
          <v-spacer></v-spacer>
          <v-btn
            v-if="isExpandedForm"
            @click="isExpandedForm = !isExpandedForm"
          >
            Collapse Critique
          </v-btn>
          <v-btn v-else @click="isExpandedForm = !isExpandedForm">
            Expand Critique
          </v-btn>
          <v-spacer></v-spacer>
        </v-row>
        <v-row no-gutters>
          <v-col cols="6" v-for="critique in critiques">
            <v-row no-gutters>
              <strong>{{ critique.title }}</strong>
            </v-row>
            <v-row no-gutters>
              <v-col justify="end" align-self="start">
                <p class="font-weight-light description">
                  {{ critique.description }}
                </p>
              </v-col>
              <v-col>
                <v-select
                  v-model="critique.grade"
                  :style="{ width: '120px' }"
                  :items="grades"
                  density="compact"
                  title="Grade"
                ></v-select>
              </v-col>
            </v-row>
            <v-row
              v-if="isExpandedForm && critique.title !== 'Overall'"
              no-gutters
            >
              <v-col cols="10">
                <v-text-field
                  v-model="critique.comment"
                  label="Comments (optional)"
                  variant="outlined"
                  density="compact"
                  class="ma-0"
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <strong>Performance and Suggestions</strong>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-textarea
            variant="outlined"
            label="Comments (optional)"
            v-model="overallComment"
            rows="2"
          ></v-textarea>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="ConfirmCritiques">
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EventDataService from "../../services/EventDataService";
import Utils from "../../config/utils";
import UserRoleDataService from "../../services/UserRoleDataService";
import JurorTimeslotDataService from "../../services/JurorTimeslotDataService";
import CritiqueDataService from "../../services/CritiqueDataService";
export default {
  name: "FacultyCreateCritique",
  data: () => ({
    facultyId: null,
    timeslots: [],
    headers: [
      { title: "Student(s)", key: "studentNames" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", sortable: false },
    ],
    dialog: false,
    currentTimeslot: {},
    isExpandedForm: false,
    critiques: [
      {
        title: "Deportment",
        description: "Poise, entrance and exit bow",
      },
      {
        title: "Interpretation / Musicianship",
        description: "Phrasing, temp, dynamics communication, rapport",
      },
      {
        title: "Tone",
        description: "Beauty, control/clarity, vibrato, warmth",
      },
      {
        title: "Balance Blend",
        description: "With accompanist or within ensemble",
      },
      {
        title: "Accuracy / Intonation",
        description:
          "Correct notes with correct rhythm, tuning with keyboard and/or ensemble",
      },
      {
        title: "Diction / Articulation",
        description: "Vowels; consonants - legato, double/triple tongue",
      },
      {
        title: "Technique",
        description:
          "Attacks, releases, flexibility, range, resonance, placement, support, agility",
      },
      {
        title: "Overall",
        description: "General impression of performance",
      },
    ],
    overallComment: "",
    grades: ["Poor", "Fair", "Good", "Excellent"],
    errorMessage: null,
  }),
  methods: {
    async fillTimeslots() {
      await EventDataService.getStudentTimeslotsForEvent(this.eventId)
        .then((response) => {
          this.timeslots = response.data[0];

          this.timeslots.eventTimeslots.forEach((obj) => {
            if (obj.studentTimeslots.length > 1) {
              var names = [];
              obj.studentTimeslots.forEach((stuObj) => {
                names.push(
                  stuObj.studentInstrument.student.user.fName +
                    " " +
                    stuObj.studentInstrument.student.user.lName
                );
              });
              obj.studentNames = names.join(", ");
            } else {
              obj.studentNames =
                obj.studentTimeslots[0].studentInstrument.student.user.fName +
                " " +
                obj.studentTimeslots[0].studentInstrument.student.user.lName;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFacultyId() {
      const user = Utils.getStore("user");
      UserRoleDataService.getRolesForUser(user.userId)
        .then((response) => {
          this.facultyId = response.data.find((role) => {
            return role.role === "Faculty";
          }).id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    createCritiques(timeslot) {
      this.errorMessage = "";
      this.currentTimeslot = timeslot;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async ConfirmCritiques() {
      if (!this.isValid()) {
        return;
      }

      var jurorTimeslotData = {
        eventTimeslotId: this.currentTimeslot.id,
        jurorId: this.facultyId,
      };

      await JurorTimeslotDataService.create(jurorTimeslotData)
        .then((response) => {
          jurorTimeslotData = response.data;
        })
        .catch((err) => {
          console.log(err);
        });

      this.currentTimeslot.studentTimeslots.forEach((studentTimeslot) => {
        this.critiques.forEach((critique) => {
          const critiqueData = {
            type: critique.title,
            grade: critique.grade,
            comment:
              critique.title === "Overall"
                ? this.overallComment
                : critique.comment,
            studentTimeslotId: studentTimeslot.id,
            jurorTimeslotId: jurorTimeslotData.id,
          };

          CritiqueDataService.create(critiqueData).catch((err) => {
            console.log(err);
          });
        });
      });

      this.closeDialog();
    },
    isValid() {
      var result = true;

      for (let i = 0; result && i < this.critiques.length; i++) {
        const critique = this.critiques[i];
        if (critique.grade == null || critique.grade == undefined) {
          this.errorMessage = "Must select a grade for " + critique.title;
          result = false;
        }
      }

      return result;
    },
  },
  async mounted() {
    await this.fillTimeslots();
    this.getFacultyId();
  },
  props: {
    eventId: Number,
  },
};
</script>

<style>
.description {
  font-size: 14px;
}
</style>
