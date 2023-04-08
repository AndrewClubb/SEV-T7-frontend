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
              <v-icon size="small" class="me-2" @click="editEvent(item.raw)">
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="this.isAfterNow(item.raw.date)"
                size="small"
                @click="deleteEvent(item.raw)"
              >
                mdi-delete
              </v-icon>
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
        <div v-if="isEdit">Edit Event</div>
        <div v-else>New Event</div>
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
            <input type="date" v-model="editedEvent.date" />
            <!-- date -->
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              :format="timeFormat"
              v-model="startTimeData"
              :minute-interval="editedEvent.slotDuration"
              ><template v-slot:clearButton><img /> </template
            ></vue-timepicker>
            <!-- start -->
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              :format="timeFormat"
              v-model="endTimeData"
              :minute-interval="editedEvent.slotDuration"
              ><template v-slot:clearButton><img /> </template
            ></vue-timepicker>
            <!-- end -->
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-select
              density="compact"
              v-model="editedEvent.slotDuration"
              variant="solo"
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
            ></v-checkbox>
            <!-- visible -->
          </v-col>
          <v-col>
            <v-checkbox
              v-model="this.editedEvent.canMergeSlots"
              label="Students can sign up for multiple timeslots"
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
          color="blue-darken-1"
          variant="text"
          @click="addEventConfirm"
          v-if="!isEdit"
          >CREATE</v-btn
        >
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="editEventConfirm"
          v-else
          >SAVE</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
import VueTimePicker from "vue3-timepicker";
import "vue3-timepicker/dist/VueTimepicker.css";
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
    selectedEvent: {},
    isEdit: false,
    errorMessage: "",
    eventTypes: [],
    eventOtherType: null,
    timeFormat: "hh:mm a",
    startTimeData: null,
    eventTypes: [],
    dialog: false,
    dialogDelete: false,
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
    isAfterNow(input) {
      const dateParts = input.split("-");
      const eventDate = new Date(
        Date.UTC(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        )
      );

      const today = new Date();
      const utcDate = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        )
      );

      return (
        eventDate.getTime() > utcDate.getTime() ||
        (eventDate.getFullYear() === utcDate.getFullYear() &&
          eventDate.getMonth() === utcDate.getMonth() &&
          eventDate.getDate() === utcDate.getDate())
      );
    },
    deleteEvent(event) {
      this.editedEvent = event;
      this.dialogDelete = true;
    },
    async deleteEventConfirm() {
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
      this.eventOtherType = null;
      this.errorMessage = "";
      this.isEdit = false;
      this.dialog = true;
    },
    isValid(startTime, endTime) {
      var result = true;

      if (!this.isEdit) {
        //selected date is after today
        if (!this.isAfterNow(this.editedEvent.date)) {
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
          this.editedEvent.name == undefined
        ) {
          result = false;
          this.errorMessage = "Name cannot be empty";
        }
      }
      return result;
    },
    addEventConfirm() {
      var startTime, endTime;
      if (this.startTimeData.a === "am") {
        startTime = `${this.startTimeData.hh}:${this.startTimeData.mm}:00`;
      } else {
        startTime = `${Number(this.startTimeData.hh) + 12}:${
          this.startTimeData.mm
        }:00`;
      }

      if (this.endTimeData.a === "am") {
        endTime = `${this.endTimeData.hh}:${this.endTimeData.mm}:00`;
      } else {
        endTime = `${Number(this.endTimeData.hh) + 12}:${
          this.endTimeData.mm
        }:00`;
      }

      if (!this.isValid(startTime, endTime)) {
        return;
      }

      // create event

      // create event TS

      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
    },
    editEvent(event) {},
    editEventConfirm() {},
  },
  components: { "vue-timepicker": VueTimePicker },
  async mounted() {
    await this.retrieveAllSemesters();
    await this.getCurrentSemester();
    await this.semesterUpdated();
    this.getAllEventTypes();
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
