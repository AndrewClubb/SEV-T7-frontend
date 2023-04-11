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
                    @click="changeCurrentEvent(item.raw)"
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
            <v-select v-model="instAvail" label="Instruc Availability">
            </v-select>
            <!-- <v-btn variant="text" rounded> clear filters </v-btn> -->
          </v-col>
          <v-col cols="3">
            <v-select v-model="accAvail" label="Accomp Availability"></v-select>
          </v-col>
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
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-sheet max-height="400" class="overflow-y-auto" color="fav">
                <v-row>
                  <v-col
                    v-for="event in events"
                    :key="event.id"
                    v-on:click="changeCurrentEvent(event)"
                    variant="tonal"
                    v-bind:color="
                      event.id === currentEvent.id ? 'blue' : 'cyan-darken-2'
                    "
                    cols="6"
                  >
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:00 - 12:05
                    </v-btn>
                    <!-- <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:00 - 12:05
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:10 - 12:15
                    </v-btn>
                    <v-btn
                      size="x-large"
                      elevation="5"
                      class="p-3 ma-2"
                    >
                      12:20 - 12:25
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:30 - 12:35
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:40 - 12:45
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:50 - 12:55
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      01:05 - 01:10
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:05 - 12:10
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:15 - 12:20
                    </v-btn>
                    <v-btn
                      size="x-large"
                      elevation="5"
                      color="cyan-darken-2"
                      class="p-3 ma-2"
                    >
                      12:25 - 12:30
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:35 - 12:40
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:45 - 12:50
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      12:55 - 01:00
                    </v-btn>
                    <v-btn size="x-large" elevation="5" class="p-3 ma-2">
                      01:10 - 01:15
                    </v-btn> -->
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
              <!-- <v-col cols="6">
                <v-btn class="pa-1 ma-3"> Add Piece </v-btn>
                <v-sheet class="overflow-y-auto" color="fav">
                  <v-list lines="two"> </v-list>
                </v-sheet>
              </v-col> -->
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
              <v-btn color="blue-darken-1"> save </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <!-- <v-data-table
          class="mt-15 mb-5 elevation-1"
          :items="currentAvailability"
          :headers="availabilityHeader"
          :sort-by="[{ key: 'startTime', order: 'dsc' }]"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title> AVAILABILITY </v-toolbar-title>
              <div v-if="currentAvailability.length == 0" class="mr-4">
                <v-spacer></v-spacer>
                You currently have no availability for this event.
              </div>
            </v-toolbar>
          </template>
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in availabilityHeader" :key="index">
                <div
                  v-if="
                    header.title == 'Start Time' || header.title == 'End Time'
                  "
                >
                  {{ this.formatTime(item.columns[header.key]) }}
                </div>
                <div v-else>
                  <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                  </v-icon>
                  <v-icon size="small" @click="deleteItem(item.raw)">
                    mdi-delete
                  </v-icon>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table> -->
      </v-card-text>
      <!-- <v-card-actions>
        <v-btn color="blue-darken-1" variant="text" @click="showDialog = false"
          >Close</v-btn
        >
        <v-btn color="blue-darken-1" class="pa-1 ma-1"> save </v-btn>
      </v-card-actions> -->
    </v-card>
    <!-- DELETE dialog button -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-text>
          <v-row class="ml-5">
            <strong class="text-red-lighten-1">{{
              this.editErrorMessage
            }}</strong>
          </v-row>
          <v-row class="mt-4 ml-5">
            <v-col cols="6"
              >{{ "Start Time-" + this.editStartOriginal }}
            </v-col>
            <v-col cols="6">
              {{ "End Time-" + this.editEndOriginal }}
            </v-col>
          </v-row>
          <v-row class="mt-4 ml-5">
            <v-col cols="6">
              <v-select
                v-model="editSelectedStart"
                label="Start Time"
                :items="availabilityStartArray"
                return-object
                :style="{ width: '160px' }"
                @update:modelValue="editStartChange()"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                class="mr-15"
                v-model="editSelectedEnd"
                label="End Time"
                :items="editEndArray"
                return-object
                :style="{ width: '160px' }"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeEdit"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="editItemConfirm"
            >SAVE</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>

  <!-- <div>
    <v-container>
      <v-row>
        <v-col>
          <h3>Events</h3>
          <br />
          <v-card height="500" width="300" class="scrollable">
            <v-btn
              v-for="event in events"
              :key="event.id"
              v-on:click="changeCurrentEvent(event)"
              variant="tonal"
              v-bind:color="event.id === currentEvent.id ? 'blue' : 'black'"
            >
              {{ event.type + " - " + event.date }}
            </v-btn>
          </v-card>

          <br />
        </v-col>
        <v-col>
          <h3>Avaliable Times</h3>
          <br />
          <v-card height="500" class="scrollable">
            <v-checkbox
              v-for="(time, index) in currentEventTimes"
              :key="index"
              v-model="selectedEventTimes"
              :label="time.startTime"
              :value="time"
            >
            </v-checkbox>
          </v-card>
          <br />
          <v-btn>Next</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
        </v-col>
      </v-row>
    </v-container>
  </div> -->
</template>

<script>
// import EventTimeDataService from "../../services/EventTimeDataService";
import Utils from "../../config/utils.js";
import { reactive } from "vue";
import AvailabilityDataService from "../../services/AvailabilityDataService";
import ComposerDataService from "../../services/ComposerDataService";
import EventDataService from "../../services/EventDataService";
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
    //Inside dialogue
    eventHeader: [
      { title: "Start Time", key: "startTime", sortable: false },
      { title: "End Time", key: "endTime", sortable: false },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    events: [],
    songs: [],
    selectedComposer: null,
    selectedSong: null,
    composers: [],
    displayComposers: [],
    hasSearched: false,
    selectedStudentInstrument: null,
    composerSearch: null,
    transBool: false,
    //maybe
    selectedEvent: null,
    currentEvent: {},
    currentEventTimes: [],
    selectedEventTimes: [],
    // currentDate: new Date(),
  }),
  methods: {
    changeCurrentEvent(event) {
      this.currentEvent = event;
      this.determineEventTimes();
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
    async retrieveStudentInstruments() {
      await StudentInstrumentDataService.getByUser(this.user.userId)
        .then((response) => {
          this.studentInstruments = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleClick() {
      this.active = !this.active;
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
      // this.$route.fullPath === "/studentRepertoire";
    },
    //change these accordingly
    async getAvailabilityForAcc() {
      await AvailabilityDataService.getByUser(this.user.userId)
        .then((response) => {
          this.userAvailability = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getAvailabilityForInst() {
      await AvailabilityDataService.getByUser(this.user.userId)
        .then((response) => {
          this.userAvailability = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async retrieveEvents() {
      await EventDataService.getAll()
        .then((response) => {
          this.events = response.data;
          // console.log(this.events);
        })
        .catch((e) => {
          console.log(e);
        });

      // Narrow down to events in the future
    },
    async retrieveEventTimes(eventId) {
      await EventTimeDataService.getByEvent(eventId)
        .then((response) => {
          this.currentEventTimes = response.data;
          // console.log(this.currentEventTimes);
        })
        .catch((e) => {
          console.log(e);
        });

      // Narrow down to events in the future
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
    async determineEventTimes() {
      this.selectedEventTimes = [];
      await this.retrieveEventTimes(this.currentEvent.id);
    },

    async retrieveCourses() {
      await CourseDataService.getAll()
        .then((response) => {
          this.courses = response.data;
          this.filteredCourses = this.courses;
          // console.log(this.courses);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    changeCurrentEvent(event) {
      this.errorMessage = "";
      this.selectedEvent = event;
      // this.chosenEvent();
      this.currentSlot = this.userChosenSlot.filter(
        (obj) => obj.eventId == event.id
      );
      this.showDialog = true;
    },
    chosenEvent() {
      let tempTime = this.selectedEvent.startTime;

      while (tempTime <= this.selectedEvent.endTime) {
        // this.availabilitySlots.push({
        //   title: this.formatTime(tempTime),
        //   value: tempTime,
        // });
        tempTime = this.addDurationMinutes(tempTime);
      }

      this.availabilityEndArray = Array.from(this.availabilitySlots);
      this.availabilityStartArray = Array.from(this.availabilitySlots);

      this.availabilityEndArray.shift(); //removes the first timeslot from the end array
      this.availabilityStartArray.pop(); //removes the last timeslot from the start array

      this.availabilityStart = this.availabilityStartArray[0];
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
