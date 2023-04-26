<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col>
          {{ "Event Type: " + this.selectedEvent.type }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          {{ "Event Date: " + this.selectedEvent.date }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          {{
            "Times: (" +
            this.formatTime(this.selectedEvent.startTime) +
            " - " +
            this.formatTime(this.selectedEvent.endTime) +
            ")"
          }}
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row class="ml-1">
        <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-select
            clearable
            v-model="selectedStudentInstrument"
            label="Instrument"
            :items="studentInstruments"
            item-title="instrument.name"
            return-object
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field
            :model-value="
              selectedStudentInstrument != null
                ? selectedStudentInstrument.faculty.user.fName +
                  ' ' +
                  selectedStudentInstrument.faculty.user.lName
                : ''
            "
            class="mb-2"
            label="Instructor"
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            :model-value="
              selectedStudentInstrument != null
                ? selectedStudentInstrument.accompanistId != null
                  ? selectedStudentInstrument.accompanist.user.fName +
                    ' ' +
                    selectedStudentInstrument.accompanist.user.lName
                  : 'No Accompanist'
                : ''
            "
            class="mb-2"
            label="Accompanist"
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-sheet max-height="400" class="overflow-y-auto" color="fav">
              <v-row>
                <v-col
                  v-for="(time, index) in currentEventTimes"
                  :key="index"
                  cols="6"
                  class="pa-1 ma-0 d-flex justify-center"
                >
                  <v-btn
                    v-if="!this.isDisabled(time)"
                    :style="{ width: '180px' }"
                    size="large"
                    :disabled="this.isDisabled(time)"
                    elevation="6"
                    class="pa-0 pl-auto ma-1 mt-3"
                    :color="time.color"
                    @click="timeslotSelected(time)"
                  >
                    {{
                      this.formatTime(time.startTime) +
                      " - " +
                      this.formatTime(time.endTime)
                    }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>
          </v-card>
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="5">
              <v-autocomplete
                clearable
                v-model="selectedComposer"
                v-model:search="composerSearch"
                label="Composer"
                :items="displayComposers"
                return-object
                :style="{ width: '175px' }"
                :no-data-text="noComposerDataText"
                @update:modelValue="composerUpdated()"
              ></v-autocomplete>
              <v-autocomplete
                clearable
                class="mr-15"
                v-model="selectedSong"
                label="Pieces"
                :items="songs"
                return-object
                :no-data-text="noPieceDataText"
                :style="{ width: '175px' }"
              ></v-autocomplete>
              <!-- v-if="selectedEvent.type === 'Jury'" -->
              <v-btn class="pa-1 ma-3" @click="addPiece()">
                Add To Repertoire
              </v-btn>
            </v-col>
            <!-- If its a jury have the ability to add songs
            v-if="selectedEvent.type === 'Jury'" -->
            <v-col cols="7">
              <!-- semester, stuInstrument, song -->
              <v-btn class="pa-1 ma-3" @click="removePiece()">
                Delete From Repertoire
              </v-btn>
              <v-sheet
                max-height="200"
                class="overflow-y-auto"
                activeColor="piece.color"
              >
                <v-list lines="one">
                  <v-list-item
                    v-for="(piece, index) in currentRepertoire"
                    :key="index"
                    :title="piece.title"
                    :subtitle="
                      piece.composer.fName + ' ' + piece.composer.lName
                    "
                    @click="changePieceOptions(piece)"
                    :class="
                      selectedPiece.id === piece.id ? 'bg-darkB' : 'bg-white'
                    "
                  >
                  </v-list-item>
                  <v-list-item
                    v-if="this.currentRepertoire.length == 0"
                    title="No current Repertoire"
                  ></v-list-item>
                </v-list>
              </v-sheet>
            </v-col>
          </v-row>
          <!-- <v-row>
            <input class="pa-1 ma-1" type="checkbox" v-model="transBool" />
            <label for="checkbox"> Foreign Translation </label>
          </v-row> -->
          <!-- <v-row>
            <v-textarea
              v-if="selectedEvent.type === 'Jury'"
              :disabled="!transBool || selectedPiece.id == undefined"
              v-model="selectedPiece.translation"
              label="Translation for selected piece here..."
              variant="outlined"
            >
            </v-textarea>
            <v-textarea
              v-else
              :disabled="!transBool"
              v-model="translation"
              label="Translation here..."
              variant="outlined"
            >
            </v-textarea>
          </v-row> -->
        </v-col>
      </v-row>
      <v-row class="pa-1 ma-1">
        <v-col class="pa-1 ma-1">
          <v-card-text class="pa-1 ma-1">
            Nothing available/request swap:
            <v-btn @click="requestDialog = true"> Request </v-btn>
          </v-card-text>
        </v-col>
        <!-- <v-col>
            <v-card-text class="pa-1 ma-1">
              Group performance/same timeslot:
              <v-btn> Request </v-btn>
            </v-card-text>
          </v-col> -->
      </v-row>
      <v-row class="pt-1 mt-1">
        <v-col class="pa-0 ma-1">
          <v-card-actions class="pa-1 ma-1">
            <v-btn color="darkB" variant="text" @click="$emit('closeDialog')"
              >Close</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="darkB" @click="signUp()"> save </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="requestDialog" max-width="500px">
    <v-card>
      <v-card-text class="text-h5" align="center">
        {{
          "You are requesting to take timeslot: " +
          this.formatTime(this.selectedEventTimes[0].startTime) +
          "-" +
          this.formatTime(this.selectedEventTimes[0].endTime) +
          " from "
        }}
      </v-card-text>
      <v-card-text> Are you sure this is what you want to do? </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="requestDialog = false"
          >Cancel</v-btn
        >
        <v-btn color="blue-darken-1" variant="text" @click="approvedDialog()"
          >REQUEST</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Utils from "../../config/utils.js";
import { reactive } from "vue";
import AvailabilityDataService from "../../services/AvailabilityDataService";
import ComposerDataService from "../../services/ComposerDataService";
import EventDataService from "../../services/EventDataService";
import EventTimeDataService from "../../services/EventTimeDataService";
import SongDataService from "../../services/SongDataService";
import SemesterDataService from "../../services/SemesterDataService";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
import StudentTimeslotDataService from "../../services/StudentTimeslotDataService";
import TimeslotSongDataService from "../../services/TimeslotSongDataService";
import SongTranslationDataService from "../../services/SongTranslationDataService";
import RepertoireDataService from "../../services/RepertoireDataService";
export default {
  name: "studentSignUpPopUp",
  data: () => ({
    accAvail: [],
    composers: [],
    composerSearch: null,
    currentEventTimes: [],
    currentRepertoire: [],
    currentSemester: {},
    displayComposers: [],
    eventHeader: [
      { title: "Start Time", key: "startTime", sortable: false },
      { title: "End Time", key: "endTime", sortable: false },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    errorMessage: "",
    events: [],
    hasSearched: false,
    headers: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    instAvail: [],
    notSelectedTime: [],
    repertoire: [],
    requestDialog: false,
    search: "",
    selectedComposer: null,
    selectedEvent: {},
    selectedEventTimes: [],
    selectedPiece: {},
    selectedSong: null,
    selectedStudentInstrument: null,
    selectedTime: [],
    songs: [],
    studentInstruments: [],
    transBool: false,
    translation: "",
    user: {},
    userChosenSlot: [],
  }),
  methods: {
    async getEvent() {
      await EventDataService.getById(this.eventId)
        .then((response) => {
          this.selectedEvent = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    isDisabled(eventTimeslot) {
      var result = false;

      if (this.selectedStudentInstrument == null) {
        result = true;
      } else if (eventTimeslot.isReserved == "1") {
        // result = true;
        eventTimeslot.color = "#804752";
        //find way to get student associated
      } else if (!this.isTimeslotInAvail(eventTimeslot, this.instAvail)) {
        result = true;
      } else if (
        this.selectedStudentInstrument.accompanistId != null &&
        !this.isTimeslotInAvail(eventTimeslot, this.accAvail)
      ) {
        result = true;
      }
      return result;
    },
    isTimeslotInAvail(timeslot, avail) {
      var isWithin = false;

      avail.forEach((chunk) => {
        if (
          timeslot.startTime >= chunk.startTime &&
          timeslot.endTime <= chunk.endTime
        ) {
          isWithin = true;
        }
      });
      return isWithin;
    },
    timeslotSelected(timeslot) {
      const tsIndex = this.selectedEventTimes.findIndex(
        (obj) => obj.id == timeslot.id
      );
      //checking if de-selecting button
      if (tsIndex != -1) {
        timeslot.color = null;
        this.selectedEventTimes.splice(tsIndex, 1);
      } else {
        if (
          !this.selectedEvent.canMergeSlots &&
          this.selectedEventTimes.length > 0
        ) {
          //if cannot merge slots, this clears out any current selected slots
          const oldTimeslot = this.selectedEventTimes[0];
          oldTimeslot.color = null;
          this.selectedEventTimes = [];
        }
        timeslot.color = "#00ACC1";
        this.selectedEventTimes.push(timeslot);
      }
    },
    signUp() {
      if (!this.isValid()) {
        return;
      }
      const studentTimeslotData = {
        studentInstrumentId: this.selectedStudentInstrument.id,
        eventTimeslotId: this.selectedEventTimes[0].id,
        facultyId: this.selectedStudentInstrument.facultyId,
      };

      StudentTimeslotDataService.create(studentTimeslotData).catch((err) => {
        console.log(err);
      });

      const eventTimeslotData = {
        id: this.selectedEventTimes[0].id,
        isReserved: true,
      };

      EventTimeDataService.update(eventTimeslotData).catch((err) => {
        console.log(err);
      });

      if (this.selectedEvent.type !== "Jury") {
        const timeslotSongData = {
          timeslotId: this.selectedEventTimes[0].id,
          songId: this.selectedPiece.id,
        };

        TimeslotSongDataService.create(timeslotSongData).catch((err) => {
          console.log(err);
        });

        if (this.transBool) {
          const translationData = {
            type: "User",
            text: this.translation,
            language: "English",
            songId: this.selectedPiece.id,
          };

          SongTranslationDataService.create(translationData).catch((err) => {
            console.log(err);
          });
        }
      } else {
        this.currentRepertoire.forEach((song) => {
          const timeslotSongData = {
            timeslotId: this.selectedEventTimes[0].id,
            // songId: song.id,
            songId: this.selectedPiece.id,
          };

          TimeslotSongDataService.create(timeslotSongData).catch((err) => {
            console.log(err);
          });
        });

        this.currentRepertoire.forEach((piece) => {
          if (piece.translation !== null && piece.translation !== undefined) {
            if (piece.originalId == null) {
              //creating
              const translationData = {
                type: "User",
                text: piece.translation,
                language: "English",
                songId: piece.id,
              };

              SongTranslationDataService.create(translationData).catch(
                (err) => {
                  console.log(err);
                }
              );
            } else {
              //updating
              const translationData = {
                id: piece.originalId,
                type: "User",
                text: piece.translation,
                language: "English",
                songId: piece.id,
              };

              SongTranslationDataService.update(translationData).catch(
                (err) => {
                  console.log(err);
                }
              );
            }
          }
        });
      }

      // timeslot.color = "#804752";
      this.$emit("closeDialog");
      this.$emit("successAlert");
    },
    closeDialog() {
      this.dialog = false;
    },
    approvedDialog() {
      this.$emit("closeDialog");
      this.$emit("requestAlert");
    },
    changePieceOptions(piece) {
      this.selectedPiece = piece;

      if (this.selectedPiece.translation == undefined) {
        SongTranslationDataService.getByPieceId(this.selectedPiece.id)
          .then((response) => {
            var translation = null;
            var originalId = null;
            var curPiece = this.currentRepertoire.find((obj) => {
              return obj.id === this.selectedPiece.id;
            });

            if (response.data.length > 0) {
              translation = response.data[0].text;
              originalId = response.data[0].id;
            }

            curPiece.translation = translation;
            curPiece.originalId = originalId;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    removePiece() {
      RepertoireDataService.remove(this.selectedPiece.repertoireId).catch(
        (err) => {
          console.log(err);
        }
      );

      var index = this.repertoire.findIndex((obj) => {
        return obj.id === this.selectedStudentInstrument.id;
      });

      var pieceIndex = this.repertoire[index].repertoire.findIndex(
        (obj) => obj.id === this.selectedPiece.id
      );

      this.repertoire[index].repertoire.splice(pieceIndex, 1);
    },
    isValid() {
      var result = true;
      //Check if jury and repertoire has pieces in it no need for the rest of this
      var index = this.repertoire.findIndex((obj) => {
        return obj.id === this.selectedStudentInstrument.id;
      });

      if (this.selectedStudentInstrument === null) {
        this.errorMessage = "Select your instrument.";
        result = false;
      } else if (this.selectedEventTimes.length == 0) {
        this.errorMessage = "Select a timeslot.";
        result = false;
      } else if (
        this.transBool &&
        this.translation === "" &&
        this.selectedEvent.type !== "Jury"
      ) {
        this.errorMessage = "Write foreign translation.";
        result = false;
      } else if (this.selectedEvent.type === "Jury") {
        if (this.repertoire[index].repertoire.length > -1) {
          return result;
        }
      } else if (this.selectedPiece === null || this.selectedPiece === "") {
        this.errorMessage = "Select a piece from your repertoire.";
        result = false;
      }
      // else if (
      //   this.selectedComposer === null ||
      //   this.selectedComposer === ""
      // ) {
      //   this.errorMessage = "Select your composer.";
      //   result = false;
      // } else if (this.selectedSong === null || this.selectedSong === "") {
      //   this.errorMessage = "Select your piece.";
      //   result = false;
      // }
      return result;
    },
    async showAvailability() {
      this.selectedStudentInstrument.faculty.user.availabilities =
        this.instAvail;
      this.selectedStudentInstrument.accompanist.user.availabilities =
        this.accAvail;
    },
    async retrieveStudentInstruments() {
      await StudentInstrumentDataService.getByUser(this.user.userId)
        .then((response) => {
          this.studentInstruments = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleClick() {
      this.active = !this.active;
    },
    async composerUpdated() {
      this.selectedSong = null;
      this.songs = [];
      if (this.selectedComposer != null) {
        await SongDataService.getByComposerId(this.selectedComposer.id)
          .then((response) => {
            this.songs = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    fillComposers() {
      ComposerDataService.getAll()
        .then((response) => {
          this.composers = response.data;
          this.composers.forEach((composer) => {
            composer.title = composer.fName + " " + composer.lName;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fillRepertoire() {
      RepertoireDataService.getSemesterByUser(this.user.userId)
        .then((response) => {
          var userSemester = response.data.find((semester) => {
            return semester.id === this.currentSemester.id;
          });

          userSemester.studentInstruments = [];
          userSemester.repertoires.forEach((rep) => {
            var index = userSemester.studentInstruments.findIndex(
              (obj2) => obj2.id === rep.studentInstrument.id
            );

            if (index == -1) {
              userSemester.studentInstruments.push(rep.studentInstrument);
              index = userSemester.studentInstruments.length - 1;
              userSemester.studentInstruments[index].repertoire = [];
            }

            rep.song.repertoireId = rep.id;

            userSemester.studentInstruments[index].repertoire.push(rep.song);
          });

          this.repertoire = userSemester.studentInstruments;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async addPiece() {
      var index = this.repertoire.findIndex((obj) => {
        return obj.id === this.selectedStudentInstrument.id;
      });

      if (
        this.repertoire[index] != undefined &&
        this.repertoire[index].repertoire != undefined &&
        this.repertoire[index].repertoire.findIndex((obj) => {
          return obj.id === this.selectedSong.id;
        }) != -1
      ) {
        this.errorMessage = "That piece already exists";
        return;
      }
      this.errorMessage = "";
      // send to database async
      const data = {
        studentInstrumentId: this.selectedStudentInstrument.id,
        songId: this.selectedSong.id,
        semesterId: this.currentSemester.id,
      };
      RepertoireDataService.create(data).catch((err) => {
        console.log(err);
      });
      //add to rep array repertoire
      if (index == -1) {
        this.repertoire.push(this.selectedStudentInstrument);
        index = this.repertoire.length - 1;
        this.repertoire[index].repertoire = [];
      }

      this.selectedSong.composer = this.selectedComposer;

      this.repertoire[index].repertoire.push(this.selectedSong);
      this.currentRepertoire = this.repertoire[index].repertoire;

      //clear composer
      this.selectedComposer = null;
      this.selectedSong = null;
      this.songs = [];
    },
    querySelections(value) {
      this.displayComposers = this.composers.filter((composer) => {
        return composer.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    },
    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    async getCurrentSemester(dateString) {
      await SemesterDataService.getCurrent(dateString)
        .then((response) => {
          this.currentSemester = response.data[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addDurationMinutes(time) {
      let timeSplit = time.split(":");
      let hour = Number(timeSplit[0]);
      let minute =
        Number(timeSplit[1]) + Number(this.selectedEvent.slotDuration);

      if (minute >= "60") {
        hour++;
        minute -= 60;
      }

      return (
        hour.toString().padStart(2, "0") +
        ":" +
        minute.toString().padStart(2, "0") +
        ":00"
      );
    },
    async reset() {
      await this.getEvent();
      this.user = Utils.getStore("user");
      await this.retrieveStudentInstruments();
      this.fillComposers();
      let currentDate = new Date();
      let dateString = currentDate.toISOString().substring(0, 10);
      await this.getCurrentSemester(dateString);
      this.fillRepertoire();

      this.errorMessage = "Select your instrument.";
      this.currentSlot = this.userChosenSlot.filter(
        (obj) => obj.eventId == this.eventId
      );
      await EventTimeDataService.getByEvent(this.eventId)
        .then((response) => {
          this.currentEventTimes = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.selectedStudentInstrument = null;
      this.currentRepertoire = [];
      this.selectedPiece = {};
      this.transBool = false;
      this.translation = "";
    },
  },
  setup() {
    const state = reactive({
      buttonColor: "white",
    });
    function changeColor() {
      state.buttonColor = "primary";
    }
    return {
      buttonColor: state.buttonColor,
      changeColor,
    };
  },
  watch: {
    composerSearch(val) {
      if (val && val.length > 1) {
        this.hasSearched = true;
        this.querySelections(val);
      } else {
        this.hasSearched = false;
        this.displayComposers = [];
      }
    },
    async selectedStudentInstrument(val) {
      //selected timeslots
      this.selectedEventTimes.forEach((ts) => {
        ts.color = null;
      });
      this.selectedEventTimes = [];

      if (val == null) {
        return;
      }

      if (this.errorMessage === "Select your instrument.") {
        this.errorMessage = "";
      }

      //availability
      const facultyId = val.faculty.userId;
      const accompId =
        val.accompanistId == null ? null : val.accompanist.userId;

      if (facultyId !== null && facultyId !== undefined) {
        await AvailabilityDataService.getByUserAndEvent(
          facultyId,
          this.selectedEvent.id
        )
          .then((response) => {
            this.instAvail = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (accompId !== null && accompId !== undefined) {
        await AvailabilityDataService.getByUserAndEvent(
          accompId,
          this.selectedEvent.id
        )
          .then((response) => {
            this.accAvail = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }

      this.currentRepertoire = this.repertoire.find((rep) => {
        return rep.id === this.selectedStudentInstrument.id;
      });

      if (this.currentRepertoire == undefined) {
        this.currentRepertoire = [];
      } else {
        this.currentRepertoire = this.currentRepertoire.repertoire;
      }
    },
  },
  computed: {
    noComposerDataText() {
      if (this.hasSearched) {
        return "No composers found";
      } else {
        return "Start typing to search for composers";
      }
    },
    noPieceDataText() {
      if (this.selectedComposer != null) {
        return "No songs currently for this composer";
      } else {
        return "No composer selected";
      }
    },
  },
  async created() {
    await this.reset();
  },
  props: {
    eventId: Number,
  },
  emits: ["closeDialog", "successAlert", "requestAlert"],
};
</script>
<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.scrollable {
  overflow-y: scroll;
}
.selected {
  background-color: darkB;
}
</style>
