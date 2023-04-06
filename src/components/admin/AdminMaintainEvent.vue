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
                v-if="this.isAfterNow(item.raw)"
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
            <VueDatePicker
              v-model="this.editedEvent.date"
              position="left"
              type="date"
            ></VueDatePicker>
            <!-- date -->
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              :format="timeFormat"
              v-model="timeData"
            ></vue-timepicker>
            <!-- start -->
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              :format="timeFormat"
              v-model="timeData"
            ></vue-timepicker>
            <!-- end -->
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-select
              density="compact"
              v-model="this.editedEvent.slotDuration"
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
              clearable
              v-model="editedEvent.type"
              label="Type"
              :items="eventTypes"
              return-object
            >
            </v-select>
            <!-- Type -->
          </v-col>
          <v-col>
            <v-text-field
              v-model="editedEvent.name"
              label="Name"
            ></v-text-field>
            <!-- Name -->
          </v-col>
        </v-row>
        <v-row v-if="this.editedEvent.type == 'Other'">
          <!-- if type is "other"-->
          <v-text-field
            v-model="eventOtherType"
            label="Please specify the event type"
          ></v-text-field>
        </v-row>
        <v-row class="mt-15">
          Options
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-divider></v-divider>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox></v-checkbox>
            <!-- visible -->
          </v-col>
          <v-col>
            <v-checkbox></v-checkbox>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
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
      { title: "Title", key: "title" },
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
    timeData: {
      hh: "09",
      mm: "15",
      ss: "00",
      a: "am",
    },
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
    isAfterNow(event) {
      let eventDate = new Date(event.date).getTime();
      let today = new Date().getTime();

      return eventDate > today;
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
      this.editedEvent = {};
      this.editedEvent.slotDuration = "10";
      this.eventOtherType = "";
      this.errorMessage = "";
      this.isEdit = false;
      this.dialog = true;
    },
    addEventConfirm() {
      // validate

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
  components: { VueDatePicker, "vue-timepicker": VueTimePicker },
  async mounted() {
    await this.retrieveAllSemesters();
    await this.getCurrentSemester();
    await this.semesterUpdated();
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
</style>
