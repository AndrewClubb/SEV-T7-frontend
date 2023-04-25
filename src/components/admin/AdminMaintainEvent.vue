<template>
  <v-card>
    <v-card-title> Maintain Events: </v-card-title>
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
          return-object
          @update:modelValue="semesterUpdated()"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-data-table
      :headers="eventHeaders"
      :items="events"
      class="elevation-1"
      :sort-by="[{ key: 'date', order: 'desc' }]"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title> EVENTS </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addEvent()">Add Event</v-btn>
        </v-toolbar>
      </template>
      <template #item="{ item }">
        <tr>
          <td v-for="(header, index) in eventHeaders" :key="index">
            <div v-if="header.title == 'Date'">
              {{ this.formatDate(item.columns[header.key]) }}
            </div>
            <div
              v-else-if="
                header.title == 'Start Time' || header.title == 'End Time'
              "
            >
              {{ this.formatTime(item.columns[header.key]) }}
            </div>
            <div v-else-if="header.title == 'Actions'">
              <div v-if="this.compareDates(item.raw.date) > 0">
                <v-icon size="small" class="me-2" @click="editEvent(item.raw)">
                  mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteEvent(item.raw)">
                  mdi-delete
                </v-icon>
                <v-btn
                  size="small"
                  class="ml-2"
                  @click="eventAvailability(item.raw)"
                >
                  Availability
                </v-btn>
              </div>
              <div v-else>
                <v-icon size="small" class="me-2" @click="editEvent(item.raw)">
                  mdi-pencil
                </v-icon>
              </div>
            </div>
            <div v-else>
              {{ item.columns[header.key] }}
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
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
        <v-btn color="blue-darken-1" variant="text" @click="deleteEventConfirm"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialog" max-width="750px">
    <v-card>
      <v-card-title>
        <div v-if="!this.isEdit">New Event</div>
        <div v-else-if="this.dateCompareResult == '1'">Edit Upcoming Event</div>
        <div v-else-if="this.dateCompareResult == '0'">Edit Today's Event</div>
        <div v-else>Edit Past Event</div>
      </v-card-title>
      <v-card-text>
        <v-row>
          <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        </v-row>
        <v-row align="end">
          <v-col cols="3">
            <p>Event Date</p>
          </v-col>
          <v-col cols="3">
            <p>Start Time</p>
          </v-col>
          <v-col cols="3">
            <p>End Time</p>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <p>Slot Duration</p>
          </v-col>
        </v-row>
        <v-row align="start" class="mt-0">
          <v-col cols="3">
            <input
              type="date"
              v-model="editedEvent.date"
              :disabled="this.isEdit && this.dateCompareResult == '-1'"
            />
            <!-- date -->
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              :format="timeFormat"
              v-model="startTimeData"
              :minute-interval="editedEvent.slotDuration"
              hide-clear-button
              :disabled="this.isEdit && this.dateCompareResult == '-1'"
            ></vue-timepicker>
            <!-- start -->
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              :format="timeFormat"
              v-model="endTimeData"
              :minute-interval="editedEvent.slotDuration"
              hide-clear-button
              :disabled="this.isEdit && this.dateCompareResult == '-1'"
            ></vue-timepicker>
            <!-- end -->
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-select
              density="compact"
              v-model="editedEvent.slotDuration"
              variant="solo"
              :disabled="this.isEdit && this.dateCompareResult == '-1'"
              :items="[5, 10, 15]"
            >
              <template v-slot:selection="{ item, index }">
                {{ item.title }} Minutes
              </template></v-select
            >
            <!-- duration -->
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              v-model="editedEvent.type"
              label="Event Type"
              :items="eventTypes"
              variant="solo"
              return-object
              :disabled="this.isEdit && this.dateCompareResult == '-1'"
            >
            </v-select>
            <!-- Type -->
          </v-col>
          <v-col>
            <v-text-field
              variant="underlined"
              v-model="editedEvent.name"
              label="Event Name"
            ></v-text-field>
            <!-- Name -->
          </v-col>
        </v-row>
        <v-row v-if="this.editedEvent.type === 'Other'">
          <v-col cols="6">
            <!-- if type is "other"-->
            <v-text-field
              v-model="eventOtherType"
              variant="underlined"
              label="Enter the event type here"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox
              v-model="this.editedEvent.isPrivateEvent"
              label="Private event (ex. Senior Recital)"
              :disabled="this.isEdit && this.dateCompareResult == '-1'"
            ></v-checkbox>
            <!-- visible -->
          </v-col>
          <v-col>
            <v-checkbox
              v-model="this.editedEvent.canMergeSlots"
              label="Students can sign up for multiple timeslots"
              :disabled="this.isEdit && this.dateCompareResult == '-1'"
            ></v-checkbox>
            <!-- multiple TS slection -->
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-5">
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog"
          >Cancel</v-btn
        >
        <v-btn
          v-if="!this.isEdit"
          color="blue-darken-1"
          variant="text"
          @click="addEventConfirm"
          >CREATE</v-btn
        >
        <v-btn
          v-else
          color="blue-darken-1"
          variant="text"
          @click="editEventConfirm"
          >SAVE</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="confirmPastEvent" max-width="700px">
    <v-card>
      <v-card-title class="text-h5"
        >Are you sure you want to update this event to be in the
        past?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="confirmPastEvent = false"
          >Cancel</v-btn
        >
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="runEditEventCommands"
          >I am sure</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="availabilityDialog" max-width="900px">
    <v-card>
      <v-card-title> Event Availability </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-data-table
          :sort-by="[{ key: 'lName', order: 'asc' }]"
          :headers="userHeaders"
          :items="users"
          :search="userSearch"
          items-per-page="5"
          class="elevation-1"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title> USERS </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="userSearch"
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
              <td v-for="(header, index) in userHeaders" :key="index">
                <div v-if="header.title == 'Actions'">
                  <v-btn
                    size="small"
                    class="ml-2"
                    @click="userAvailability(item.raw)"
                  >
                    Availability
                  </v-btn>
                </div>
                <div v-else>
                  {{ item.columns[header.key] }}
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="availabilityDialog = false"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="userAvailabilityDialog"
      :style="{ width: '875px' }"
      class="mx-auto"
    >
      <AvailabilityPopUp
        :event-id="selectedEvent.id"
        :user-id="selectedUser.id"
        @closeDialog="userAvailabilityDialog = false"
      ></AvailabilityPopUp>
    </v-dialog>
  </v-dialog>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
import EventTimeDataService from "../../services/EventTimeDataService";
import VueTimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";
import UserDataService from "../../services/UserDataService";
import AvailabilityPopUp from "../faculty/AvailabilityPopUp.vue";
export default {
  name: "adminMaintainEvent",
  data: () => ({
    semesters: [],
    selectedSemester: null,
    events: [],
    eventHeaders: [
      { title: "Date", key: "date" },
      { title: "Name", key: "name" },
      { title: "Type", key: "type" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    editedEvent: {},
    originalEvent: {},
    selectedEvent: {},
    errorMessage: "",
    eventTypes: [],
    eventOtherType: null,
    timeFormat: "hh:mm a",
    startTimeData: null,
    endTimeData: null,
    eventTypes: [],
    dialog: false,
    dialogDelete: false,
    isEdit: null,
    dateCompareResult: null,
    confirmPastEvent: false,
    availabilityDialog: false,
    users: [],
    userSearch: "",
    userHeaders: [
      { title: "First Name", key: "fName" },
      { title: "Last Name", key: "lName" },
      { title: "Email", key: "email" },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    selectedUser: {},
    userAvailabilityDialog: false,
  }),
  methods: {
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesters = response.data;
          this.semesters.forEach(
            (obj) => (obj.title = obj.year + " - " + obj.code)
          );
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
    async semesterUpdated() {
      await EventDataService.getBySemester(this.selectedSemester.id)
        .then((response) => {
          this.events = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getAllEventTypes() {
      this.eventTypes = [];
      await EventDataService.getEventTypes()
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            this.eventTypes.push(response.data[i].type);
          }
          this.eventTypes.push("Other");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatDate(date) {
      if (date === null || date === undefined) {
        return date;
      }
      return new Date(date).toLocaleDateString("us-US", {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    },
    formatTime(time) {
      if (time === null || time === undefined) {
        return time;
      }
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    compareDates(input) {
      const today = new Date();
      const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

      if (input > todayString) {
        return 1;
      } else if (input == todayString) {
        return 0;
      } else {
        return -1;
      }
    },
    deleteEvent(event) {
      this.editedEvent = event;
      this.dialogDelete = true;
    },
    async deleteEventConfirm() {
      EventDataService.remove(this.editedEvent.id)
        .then((data) => {
          this.semesterUpdated();
        })
        .catch((err) => {
          console.log(err);
        });

      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedEvent = null;
      });
    },
    addEvent() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");

      this.editedEvent = {};
      this.editedEvent.date = `${year}-${month}-${day}`;
      this.startTimeData = {
        hh: "10",
        mm: "00",
        a: "am",
      };
      this.endTimeData = {
        hh: "02",
        mm: "30",
        a: "pm",
      };
      this.editedEvent.slotDuration = "10";
      this.editedEvent.type = "Recital Hearing";
      this.editedEvent.isPrivateEvent = false;
      this.editedEvent.canMergeSlots = false;
      this.eventOtherType = null;
      this.errorMessage = "";
      this.isEdit = false;
      this.dialog = true;
    },
    isValid(startTime, endTime) {
      var result = true;
      //selected date is after today
      if (!this.isEdit && this.compareDates(this.editedEvent.date) < 0) {
        result = false;
        this.errorMessage = "The selected date has already passed";
      }
      //end time is before start time
      else if (startTime > endTime) {
        result = false;
        this.errorMessage = "End time cannot be before the start time";
      }
      //end time being the same as start
      else if (startTime === endTime) {
        result = false;
        this.errorMessage = "End time cannot be the same as the start time";
      }
      //event type (other)
      else if (
        this.editedEvent.type === "Other" &&
        this.eventOtherType == null
      ) {
        result = false;
        this.errorMessage = "Event type must be entered";
      }
      //event name
      else if (
        this.editedEvent.name == null ||
        this.editedEvent.name == undefined ||
        this.editedEvent.name === ""
      ) {
        result = false;
        this.errorMessage = "Name cannot be empty";
      }

      return result;
    },
    async addEventConfirm() {
      var startTime, endTime, eventId;
      if (this.startTimeData.a === "am" && this.startTimeData.hh === "12") {
        startTime = `00:${this.startTimeData.mm}:00`;
      } else if (
        this.startTimeData.a === "am" ||
        this.startTimeData.hh === "12"
      ) {
        startTime = `${this.startTimeData.hh}:${this.startTimeData.mm}:00`;
      } else {
        startTime = `${Number(this.startTimeData.hh) + 12}:${
          this.startTimeData.mm
        }:00`;
      }

      if (this.endTimeData.a === "am" && this.endTimeData.hh === "12") {
        endTime = `00:${this.endTimeData.mm}:00`;
      } else if (this.endTimeData.a === "am" || this.endTimeData.hh === "12") {
        endTime = `${this.endTimeData.hh}:${this.endTimeData.mm}:00`;
      } else {
        endTime = `${Number(this.endTimeData.hh) + 12}:${
          this.endTimeData.mm
        }:00`;
      }

      if (!this.isValid(startTime, endTime)) {
        return;
      }

      this.editedEvent.startTime = startTime;
      this.editedEvent.endTime = endTime;
      this.editedEvent.semesterId = this.selectedSemester.id;
      if (this.editedEvent.type === "Other") {
        this.editedEvent.type = this.eventOtherType;
      }

      await EventDataService.create(this.editedEvent)
        .then((response) => {
          eventId = response.data.id;
        })
        .catch((err) => {
          console.log(err);
        });

      // create event TS
      let tempStartTime = startTime;
      let tempEndTime = this.addDurationMinutes(tempStartTime);

      while (tempEndTime <= endTime) {
        const tsData = {
          startTime: tempStartTime,
          endTime: tempEndTime,
          isReserved: false,
          eventId: eventId,
        };

        await EventTimeDataService.create(tsData).catch((err) => {
          console.log(err);
        });

        tempStartTime = tempEndTime;
        tempEndTime = this.addDurationMinutes(tempEndTime);
      }

      this.semesterUpdated();
      this.getAllEventTypes();
      this.closeDialog();
    },
    addDurationMinutes(time) {
      let timeSplit = time.split(":");
      let hour = Number(timeSplit[0]);
      let minute = Number(timeSplit[1]) + Number(this.editedEvent.slotDuration);

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
    closeDialog() {
      this.dialog = false;
    },
    editEvent(event) {
      var startStrArr = event.startTime.split(":");
      var endStrArr = event.endTime.split(":");
      this.editedEvent = Object.assign({}, event);
      this.originalEvent = event;
      this.dateCompareResult = this.compareDates(event.date);

      this.startTimeData = {
        hh:
          startStrArr[0] > "12"
            ? (Number(startStrArr[0]) - 12).toString().padStart(2, "0")
            : startStrArr[0],
        mm: startStrArr[1],
        a: startStrArr[0] >= "12" ? "pm" : "am",
      };
      this.endTimeData = {
        hh:
          endStrArr[0] > "12"
            ? (Number(endStrArr[0]) - 12).toString().padStart(2, "0")
            : endStrArr[0],
        mm: endStrArr[1],
        a: endStrArr[0] >= "12" ? "pm" : "am",
      };

      this.errorMessage = null;
      this.isEdit = true;
      this.dialog = true;
    },
    async editEventConfirm() {
      var startTime, endTime;
      if (this.startTimeData.a === "am" && this.startTimeData.hh === "12") {
        startTime = `00:${this.startTimeData.mm}:00`;
      } else if (
        this.startTimeData.a === "am" ||
        this.startTimeData.hh === "12"
      ) {
        startTime = `${this.startTimeData.hh}:${this.startTimeData.mm}:00`;
      } else {
        startTime = `${Number(this.startTimeData.hh) + 12}:${
          this.startTimeData.mm
        }:00`;
      }

      if (this.endTimeData.a === "am" && this.endTimeData.hh === "12") {
        endTime = `00:${this.endTimeData.mm}:00`;
      } else if (this.endTimeData.a === "am" || this.endTimeData.hh === "12") {
        endTime = `${this.endTimeData.hh}:${this.endTimeData.mm}:00`;
      } else {
        endTime = `${Number(this.endTimeData.hh) + 12}:${
          this.endTimeData.mm
        }:00`;
      }

      if (!this.isValid(startTime, endTime)) {
        return;
      }

      if (
        this.editedEvent.date != this.originalEvent.date &&
        this.compareDates(this.editedEvent.date) < 0
      ) {
        this.confirmPastEvent = true;
      } else {
        this.runEditEventCommands();
      }
    },
    async runEditEventCommands() {
      this.confirmPastEvent = false;
      var startTime, endTime;
      if (this.startTimeData.a === "am" && this.startTimeData.hh === "12") {
        startTime = `00:${this.startTimeData.mm}:00`;
      } else if (
        this.startTimeData.a === "am" ||
        this.startTimeData.hh === "12"
      ) {
        startTime = `${this.startTimeData.hh}:${this.startTimeData.mm}:00`;
      } else {
        startTime = `${Number(this.startTimeData.hh) + 12}:${
          this.startTimeData.mm
        }:00`;
      }

      if (this.endTimeData.a === "am" && this.endTimeData.hh === "12") {
        endTime = `00:${this.endTimeData.mm}:00`;
      } else if (this.endTimeData.a === "am" || this.endTimeData.hh === "12") {
        endTime = `${this.endTimeData.hh}:${this.endTimeData.mm}:00`;
      } else {
        endTime = `${Number(this.endTimeData.hh) + 12}:${
          this.endTimeData.mm
        }:00`;
      }
      // Get all TS for eventId
      var timeslots = [];
      await EventTimeDataService.getByEvent(this.editedEvent.id)
        .then((data) => {
          timeslots = data.data;
        })
        .catch((err) => {
          console.log(err);
        });

      this.editedEvent.startTime = startTime;
      this.editedEvent.endTime = endTime;
      if (this.editedEvent.type === "Other") {
        this.editedEvent.type = this.eventOtherType;
      }

      await EventDataService.update(this.editedEvent).catch((err) => {
        console.log(err);
      });

      if (
        this.originalEvent.startTime != startTime ||
        this.originalEvent.endTime != endTime ||
        this.originalEvent.slotDuration != this.editedEvent.slotDuration
      ) {
        if (this.originalEvent.slotDuration != this.editedEvent.slotDuration) {
          for (let i = 0; i < timeslots.length; i++) {
            await EventTimeDataService.remove(timeslots[i].id).catch((err) => {
              console.log(err);
            });
          }
          let tempStartTime = startTime;
          let tempEndTime = this.addDurationMinutes(tempStartTime);
          while (tempEndTime <= endTime) {
            const tsData = {
              startTime: tempStartTime,
              endTime: tempEndTime,
              isReserved: false,
              eventId: this.editedEvent.id,
            };
            await EventTimeDataService.create(tsData).catch((err) => {
              console.log(err);
            });
            tempStartTime = tempEndTime;
            tempEndTime = this.addDurationMinutes(tempEndTime);
          }
        } else {
          for (let i = 0; i < timeslots.length; i++) {
            if (
              timeslots[i].startTime < startTime ||
              timeslots[i].endTime > endTime
            ) {
              await EventTimeDataService.remove(timeslots[i].id).catch(
                (err) => {
                  console.log(err);
                }
              );
            }
          }
          let tempStartTime = startTime;
          let tempEndTime = this.addDurationMinutes(tempStartTime);
          while (tempEndTime <= endTime) {
            //update condition to varify new TS doesn't already exist
            if (
              timeslots.findIndex(
                (obj) =>
                  obj.startTime === tempStartTime && obj.endTime === tempEndTime
              ) == -1
            ) {
              const tsData = {
                startTime: tempStartTime,
                endTime: tempEndTime,
                isReserved: false,
                eventId: this.editedEvent.id,
              };
              await EventTimeDataService.create(tsData).catch((err) => {
                console.log(err);
              });
            }
            tempStartTime = tempEndTime;
            tempEndTime = this.addDurationMinutes(tempEndTime);
          }
        }
      }

      await this.semesterUpdated();
      this.getAllEventTypes();
      this.closeDialog();
    },
    eventAvailability(event) {
      this.userSearch = "";
      this.selectedEvent = event;
      this.availabilityDialog = true;
    },
    userAvailability(user) {
      this.selectedUser = user;
      this.userAvailabilityDialog = true;
    },
    async getUsers() {
      await UserDataService.getAllWithRoles()
        .then((response) => {
          this.users = response.data.filter((user) => {
            const index = user.userRoles.findIndex((role) => {
              return (
                role.isActive &&
                (role.role === "Faculty" || role.role === "Accompanist")
              );
            });

            return index != -1;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  components: { "vue-timepicker": VueTimePicker, AvailabilityPopUp },
  async mounted() {
    await this.retrieveAllSemesters();
    await this.getCurrentSemester();
    await this.semesterUpdated();
    this.getAllEventTypes();
    this.getUsers();
  },
};
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 60px; /* set a height for the container */
}
input[type="date"] {
  border: 1px solid lightgrey;
  padding: 8px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}
</style>
