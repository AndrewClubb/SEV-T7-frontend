<template>
  <v-card>
    <v-card-title> Sign-Up For Events: </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="events" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>UPCOMING EVENTS TO SIGN-UP FOR</v-toolbar-title>
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
                    small
                    color="primary"
                    @click="makeCurrentEvent(item.raw)"
                    >Sign Up Here</v-btn
                  >
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <!-- Signing up for an event through this dialog -->
  <v-dialog v-model="showDialog" :style="{ width: '950px' }" class="mx-auto">
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
        <!-- <v-row class="ml-5">
          <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        </v-row> -->
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
              <!-- @change="showAvailability()" -->
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              :model-value="
                selectedStudentInstrument != null
                  ? selectedStudentInstrument.accompanist.user.fName +
                    ' ' +
                    selectedStudentInstrument.accompanist.user.lName
                  : ''
              "
              class="mb-2"
              label="Accompanist"
              readonly
            >
            </v-text-field>
          </v-col>
          <v-co>
            <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
          </v-co>
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
                      :style="{ width: '180px' }"
                      :disabled="this.isDisabled(time)"
                      size="large"
                      elevation="6"
                      class="pa-0 pl-auto ma-1 mt-3"
                    >
                      <!-- @click="chooseEventTime(index)""
                        :class="if notSelectedTime ? : selectedTime" -->
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
              <v-col cols="12">
                <!-- add cols="6" -->
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
              </v-col>
              <v-col v-if="selectedEvent.type === 'Jury'" cols="6">
                <v-btn class="pa-1 ma-3"> Add Piece </v-btn>
                <v-sheet class="overflow-y-auto" color="fav">
                  <v-list lines="two"> </v-list>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row>
              <input class="pa-1 ma-1" type="checkbox" v-model="transBool" />
              <label for="checkbox"> Foreign Translation</label>
            </v-row>
            <v-row>
              <v-textarea
                :disabled="!transBool"
                label="Translation here..."
                variant="outlined"
              >
              </v-textarea>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="pa-1 ma-1">
          <v-col class="pa-1 ma-1">
            <v-card-text class="pa-1 ma-1">
              Nothing available/request swap:
              <v-btn> Request </v-btn>
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-text class="pa-1 ma-1">
              Group performance/same timeslot:
              <v-btn> Request </v-btn>
            </v-card-text>
          </v-col>
        </v-row>
        <v-row class="pt-1 mt-1">
          <v-col class="pa-0 ma-1">
            <v-card-actions class="pa-1 ma-1">
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="showDialog = false"
                >Close</v-btn
              >
              <v-spacer></v-spacer>
              <!-- @click="signUp" below -->
              <v-btn color="blue-darken-1"> save </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card-text>
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
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
import StudentRepertoire from "./StudentRepertoire.vue";
export default {
  name: "studentEventList",
  components: {
    StudentRepertoire,
  },
  data: () => ({
    headers: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    showDialog: false,
    user: {},
    search: "",
    userChosenSlot: [],
    selectedEvent: null,
    checked: false,
    eventHeader: [
      { title: "Start Time", key: "startTime", sortable: false },
      { title: "End Time", key: "endTime", sortable: false },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    events: [],
    errorMessage: "",
    songs: [],
    selectedComposer: null,
    selectedSong: null,
    composers: [],
    displayComposers: [],
    hasSearched: false,
    selectedStudentInstrument: null,
    composerSearch: null,
    transBool: false,
    instAvail: [],
    accAvail: [],
    currentEventTimes: [],
    selectedEventTimes: [],
    isValid: true,
    selectedTime: [],
    notSelectedTime: [],
  }),
  methods: {
    isDisabled(eventTimeslot) {
      var result = false;

      if (this.selectedStudentInstrument == null) {
        result = true;
      } else if (eventTimeslot.isReserved == "1") {
        result = true;
      }

      //within faculty time

      return result;
    },
    // chooseEventTime(index, selectedStudentInstrument) {
    //   let time = this.currentEventTimes[index];

    //   console.log(time);
    // },
    // async signUp() {
    //   if (!this.isValid()) {
    //     return;
    //   }

    // const data = {
    //   studentInstrumentId: this.selectedStudentInstrument.id,
    //   eventTimeslotId: this.currentEventTimes.id,
    //   facultyId: this.selectedStudentInstrument.faculty.id,

    //   timeslotId: this.time
    //   songId: this.selectedSong.id,
    //   semesterId:
    //     this.selectedSemester == null ? null : this.selectedSemester.id,
    // };

    //   await RepertoireDataService.create(data).catch((e) => {
    //     console.log(e);
    //   });

    //   this.fillSemesters();
    //   this.fillRepertoire();
    //   this.closeDialog();
    // },
    async showAvailability() {
      this.selectedStudentInstrument.faculty.user.availabilities =
        this.instAvail;
      this.selectedStudentInstrument.accompanist.user.availabilities =
        this.accAvail;

      console.log(instAvail);
      console.log(accAvail);
    },
    async makeCurrentEvent(event) {
      this.errorMessage = "";
      this.selectedEvent = event;
      this.currentSlot = this.userChosenSlot.filter(
        (obj) => obj.eventId == event.id
      );

      await EventTimeDataService.getByEvent(event.id)
        .then((response) => {
          this.currentEventTimes = response.data;
          // console.log(this.currentEventTimes);
        })
        .catch((e) => {
          console.log(e);
        });

      this.showDialog = true;
    },
    async retrieveEventsDateAndAfter(date) {
      await EventDataService.getGTEDate(date)
        .then((response) => {
          this.events = response.data;
          // console.log(this.events);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async retrieveStudentInstruments() {
      await StudentInstrumentDataService.getByUser(this.user.userId)
        .then((response) => {
          this.studentInstruments = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.studentInstruments);
      console.log(this.selectedStudentInstrument);
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
          .catch((e) => {
            console.log(e);
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
        .catch((e) => {
          console.log(e);
        });
    },
    querySelections(value) {
      this.displayComposers = this.composers.filter((composer) => {
        return composer.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    },
    stuRep() {
      this.$router.push({ path: "studentRepertoire" });
    },
    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
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
      if (val == null) {
        return;
      }

      const facultyId = val.faculty.userId;
      // const accompId = val.accompanistId;

      console.log("facultyid", facultyId);
      console.log("eventId", this.selectedEvent.id);

      if (facultyId !== null && facultyId !== undefined) {
        await AvailabilityDataService.getByUserAndEvent(
          facultyId,
          this.selectedEvent.id
        )
          .then((response) => {
            console.log("faculty avail", response.data);
          })
          .catch((err) => {
            console.log(err);
          });
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
  async mounted() {
    this.user = Utils.getStore("user");
    this.retrieveStudentInstruments();
    this.fillComposers();
    this.currentDate = new Date();
    let dateString = this.currentDate.toISOString().substring(0, 10);
    await this.retrieveEventsDateAndAfter(dateString);
    // await this.getAvailabilityForUser();
  },
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
</style>
