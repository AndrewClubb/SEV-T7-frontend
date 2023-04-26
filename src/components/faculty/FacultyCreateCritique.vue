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
        :items="filteredTimeslots.eventTimeslots"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{
              "Today's " + this.timeslots.type + ": " + this.timeslots.name
            }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-checkbox-btn
              class="mr-3"
              label="Filter completed critiques"
              v-model="filterBool"
            ></v-checkbox-btn>
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
                  v-if="!item.raw.hasCritiques"
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
  <v-dialog v-model="recitalHearingDialog" max-width="800px">
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
              <strong>{{ critique.type }}</strong>
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
              v-if="isExpandedForm && critique.type !== 'Overall'"
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
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="recitalHearingDialog = false"
        >
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="ConfirmRecitalCritiques"
        >
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="juryDialog" max-width="800px">
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
        <v-row v-for="critique in juryCritiques">
          <v-spacer></v-spacer>
          <v-col cols="11">
            <div v-if="critique.counter == 1">First piece:</div>
            <div v-else>Additional piece:</div>
            <v-select
              v-model="critique.piece"
              item-title="song.title"
              label="Select the piece"
              :items="timeslotSongs"
              return-object
              :style="{ width: '400px' }"
              clearable
            ></v-select>
            <v-textarea
              variant="outlined"
              label="Critique"
              v-model="critique.comment"
              rows="3"
            ></v-textarea>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-btn
            class="ml-5"
            v-if="juryCritiques.length < timeslotSongs.length"
            @click="addPiece()"
            >Add a piece</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            class="mr-5"
            v-if="juryCritiques.length > 1"
            @click="removePiece()"
            >Remove a piece</v-btn
          >
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue-darken-1" variant="text" @click="juryDialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="confirmJuryCritiques"
        >
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
import TimeslotSongDataService from "../../services/TimeslotSongDataService";
export default {
  name: "FacultyCreateCritique",
  data: () => ({
    facultyId: null,
    timeslots: [],
    filteredTimeslots: [],
    headers: [
      { title: "Student(s)", key: "studentNames" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", sortable: false },
    ],
    recitalHearingDialog: false,
    juryDialog: false,
    currentTimeslot: {},
    isExpandedForm: false,
    critiques: null,
    juryCritiques: null,
    overallComment: null,
    grades: ["Poor", "Fair", "Good", "Excellent"],
    errorMessage: null,
    timeslotSongs: [],
    selectedSong: null,
    filteredTimeslotSongs: [],
    isEdit: null,
    jurorTimeslotId: null,
    originalCritiques: null,
    filterBool: null,
    eventId: null,
  }),
  methods: {
    async fillTimeslots() {
      this.timeslots = [];
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
    async fillHasCritiques() {
      for (let i = 0; i < this.timeslots.eventTimeslots.length; i++) {
        var critiques = await this.getTimeslotCritiques(
          this.timeslots.eventTimeslots[i]
        );
        this.timeslots.eventTimeslots[i].hasCritiques = critiques.length > 0;
      }
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
    async getTimeslotSongs() {
      await TimeslotSongDataService.getByTimeslotId(this.currentTimeslot.id)
        .then((response) => {
          this.timeslotSongs = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getTimeslotCritiques(timeslot) {
      var createdCritiques;
      await CritiqueDataService.getCritiquesByTimeslotAndFaculty(
        timeslot.id,
        this.facultyId
      )
        .then((response) => {
          createdCritiques = response.data;
        })
        .catch((err) => {
          console.log(err);
        });

      return createdCritiques;
    },
    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    async createCritiques(timeslot) {
      this.errorMessage = "";
      this.currentTimeslot = timeslot;
      this.isEdit = false;

      if (this.timeslots.type === "Recital Hearing") {
        this.critiques = [
          {
            type: "Deportment",
            description: "Poise, entrance and exit bow",
          },
          {
            type: "Interpretation / Musicianship",
            description: "Phrasing, temp, dynamics communication, rapport",
          },
          {
            type: "Tone",
            description: "Beauty, control/clarity, vibrato, warmth",
          },
          {
            type: "Balance Blend",
            description: "With accompanist or within ensemble",
          },
          {
            type: "Accuracy / Intonation",
            description:
              "Correct notes with correct rhythm, tuning with keyboard and/or ensemble",
          },
          {
            type: "Diction / Articulation",
            description: "Vowels; consonants - legato, double/triple tongue",
          },
          {
            type: "Technique",
            description:
              "Attacks, releases, flexibility, range, resonance, placement, support, agility",
          },
          {
            type: "Overall",
            description: "General impression of performance",
          },
        ];
        this.recitalHearingDialog = true;
        this.overallComment = null;
        this.isExpandedForm = false;
      } else {
        this.getTimeslotSongs();
        this.juryCritiques = [
          {
            piece: null,
            comment: null,
            counter: 1,
          },
        ];
        this.juryDialog = true;
      }
    },
    async editCritiques(timeslot) {
      this.errorMessage = "";
      this.currentTimeslot = timeslot;
      this.isEdit = true;
      this.originalCritiques = await this.getTimeslotCritiques(timeslot);

      if (this.timeslots.type === "Recital Hearing") {
        this.critiques =
          this.originalCritiques[0].studentTimeslots[0].critiques;
        this.critiques.find((obj) => {
          return obj.type === "Deportment";
        }).description = "Poise, entrance and exit bow";
        this.critiques.find((obj) => {
          return obj.type === "Interpretation / Musicianship";
        }).description = "Phrasing, temp, dynamics communication, rapport";
        this.critiques.find((obj) => {
          return obj.type === "Tone";
        }).description = "Beauty, control/clarity, vibrato, warmth";
        this.critiques.find((obj) => {
          return obj.type === "Balance Blend";
        }).description = "With accompanist or within ensemble";
        this.critiques.find((obj) => {
          return obj.type === "Accuracy / Intonation";
        }).description =
          "Correct notes with correct rhythm, tuning with keyboard and/or ensemble";
        this.critiques.find((obj) => {
          return obj.type === "Diction / Articulation";
        }).description = "Vowels; consonants - legato, double/triple tongue";
        this.critiques.find((obj) => {
          return obj.type === "Technique";
        }).description =
          "Attacks, releases, flexibility, range, resonance, placement, support, agility";
        this.critiques.find((obj) => {
          return obj.type === "Overall";
        }).description = "General impression of performance";
        this.overallComment = this.critiques.find((obj) => {
          return obj.type === "Overall";
        }).comment;
        this.recitalHearingDialog = true;

        this.isExpandedForm =
          this.critiques.findIndex((obj) => {
            return obj.type != "Overall" && obj.comment != null;
          }) != -1;
      } else {
        await this.getTimeslotSongs();
        this.juryCritiques = [];
        this.originalCritiques[0].studentTimeslots[0].critiques.forEach(
          (critique) => {
            this.juryCritiques.push({
              piece: this.timeslotSongs.find((song) => {
                return song.song.title === critique.type;
              }),
              comment: critique.comment,
              counter: this.juryCritiques.length + 1,
            });
          }
        );

        this.juryDialog = true;
      }
    },
    async ConfirmRecitalCritiques() {
      if (!this.isEdit) {
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
              type: critique.type,
              grade: critique.grade,
              comment:
                critique.type === "Overall"
                  ? this.overallComment == null || this.overallComment == ""
                    ? null
                    : this.overallComment
                  : critique.comment == null ||
                    critique.comment == undefined ||
                    critique.comment == ""
                  ? null
                  : critique.comment,
              studentTimeslotId: studentTimeslot.id,
              jurorTimeslotId: jurorTimeslotData.id,
            };

            CritiqueDataService.create(critiqueData).catch((err) => {
              console.log(err);
            });
          });
        });
        this.currentTimeslot.hasCritiques = true;
      } else {
        this.originalCritiques[0].studentTimeslots.forEach(
          (studentTimeslot) => {
            this.critiques.forEach((critique) => {
              const critiqueData = {
                id: studentTimeslot.critiques.find((obj) => {
                  return obj.type === critique.type;
                }).id,
                grade: critique.grade,
                comment:
                  critique.type === "Overall"
                    ? this.overallComment == null || this.overallComment == ""
                      ? null
                      : this.overallComment
                    : critique.comment == null ||
                      critique.comment == undefined ||
                      critique.comment == ""
                    ? null
                    : critique.comment,
              };

              CritiqueDataService.update(critiqueData).catch((err) => {
                console.log(err);
              });
            });
          }
        );
      }

      await this.reloadTable();
      this.recitalHearingDialog = false;
    },
    isValid() {
      var result = true;

      if (this.timeslots.type === "Recital Hearing") {
        for (let i = 0; result && i < this.critiques.length; i++) {
          const critique = this.critiques[i];
          if (critique.grade == null || critique.grade == undefined) {
            this.errorMessage = "Must select a grade for " + critique.type;
            result = false;
          }
        }
      } else if (this.timeslots.type === "Jury") {
        for (let i = 0; result && i < this.juryCritiques.length; i++) {
          const critique = this.juryCritiques[i];
          if (critique.piece == null) {
            this.errorMessage = "A piece cannot be left empty";
            result = false;
          } else if (critique.comment == null) {
            this.errorMessage = "A critique cannot be left empty";
            result = false;
          }
        }
      }

      return result;
    },
    addPiece() {
      this.juryCritiques.push({
        piece: null,
        comment: null,
        counter: this.juryCritiques.length + 1,
      });
    },
    removePiece() {
      this.juryCritiques.pop();
    },
    async confirmJuryCritiques() {
      if (!this.isEdit) {
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
          this.juryCritiques.forEach((critique) => {
            const critiqueData = {
              type: critique.piece.song.title,
              comment: critique.comment,
              studentTimeslotId: studentTimeslot.id,
              jurorTimeslotId: jurorTimeslotData.id,
            };

            CritiqueDataService.create(critiqueData).catch((err) => {
              console.log(err);
            });
          });
        });
      } else {
        if (!this.isValid()) {
          return;
        }

        this.originalCritiques[0].studentTimeslots.forEach((stu) => {
          stu.critiques.forEach((cri) => {
            CritiqueDataService.delete(cri.id).catch((err) => {
              console.log(err);
            });
          });
        });

        var jurorTimeslotData =
          this.originalCritiques[0].studentTimeslots[0].critiques[0]
            .jurorTimeslot;

        this.originalCritiques[0].studentTimeslots.forEach(
          (studentTimeslot) => {
            this.juryCritiques.forEach((critique) => {
              const critiqueData = {
                type: critique.piece.song.title,
                comment: critique.comment,
                studentTimeslotId: studentTimeslot.id,
                jurorTimeslotId: jurorTimeslotData.id,
              };

              CritiqueDataService.create(critiqueData).catch((err) => {
                console.log(err);
              });
            });
          }
        );
      }

      await this.reloadTable();
      this.juryDialog = false;
    },
    async reloadTable() {
      await this.fillTimeslots();
      await this.fillHasCritiques();
      this.hideCritiques();
    },
    hideCritiques() {
      this.filteredTimeslots = [];
      if (this.filterBool) {
        this.filteredTimeslots.eventTimeslots =
          this.timeslots.eventTimeslots.filter((obj) => {
            return !obj.hasCritiques;
          });
      } else {
        this.filteredTimeslots = this.timeslots;
      }
    },
  },
  async mounted() {
    this.eventId = Utils.getStore("eventId");
    this.getFacultyId();
    await this.fillTimeslots();
    await this.fillHasCritiques();
    this.filterBool = true;
  },
  watch: {
    filterBool() {
      this.hideCritiques();
    },
  },
};
</script>

<style>
.description {
  font-size: 14px;
}
</style>
