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
      <v-row class="ml-5">
        <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
      </v-row>
      <v-row class="mt-4 ml-5">
        <v-select
          v-model="availabilityStart"
          label="Start Time"
          :items="availabilityStartArray"
          :style="{ width: '40px' }"
          return-object
          @update:modelValue="startTimeUpdated()"
        ></v-select>
        <v-select
          class="ml-15"
          v-model="availabilityEnd"
          label="End Time"
          :items="availabilityEndArray"
          :style="{ width: '40px' }"
          return-object
        ></v-select>
        <v-spacer></v-spacer>
      </v-row>
      <v-row class="ml-5">
        <v-btn color="primary" @click="createAvailability()"
          >Create Availability</v-btn
        >
        <v-spacer></v-spacer>
      </v-row>
      <v-data-table
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
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue-darken-1" variant="text" @click="$emit('closeDialog')"
        >Close</v-btn
      >
    </v-card-actions>
  </v-card>
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
          <v-col cols="6">{{ "Start Time-" + this.editStartOriginal }} </v-col>
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
</template>
<script>
import EventDataService from "../../services/EventDataService";
import AvailabilityDataService from "../../services/AvailabilityDataService";
export default {
  name: "availabilityPopUp",
  data: () => ({
    selectedEvent: {},
    userAvailability: [],
    availabilitySlots: [],
    availabilityStart: null,
    availabilityStartArray: [],
    availabilityEnd: null,
    availabilityEndArray: [],
    currentAvailability: [],
    availabilityHeader: [
      { title: "Start Time", key: "startTime", sortable: false },
      { title: "End Time", key: "endTime", sortable: false },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    dialogDelete: false,
    editedAvail: null,
    editedIndex: -1,
    errorMessage: "",
    dialogEdit: false,
    editSelectedStart: null,
    editEndArray: [],
    editSelectedEnd: null,
    editStartOriginal: null,
    editEndOriginal: null,
    editErrorMessage: "",
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
    async getAvailabilityForUser() {
      await AvailabilityDataService.getByUser(this.userId)
        .then((response) => {
          this.userAvailability = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    fillAvailabilityArrays() {
      this.availabilitySlots = [];
      let tempTime = this.selectedEvent.startTime;

      while (tempTime <= this.selectedEvent.endTime) {
        this.availabilitySlots.push({
          title: this.formatTime(tempTime),
          value: tempTime,
        });
        tempTime = this.addDurationMinutes(tempTime);
      }

      this.availabilityEndArray = Array.from(this.availabilitySlots);
      this.availabilityStartArray = Array.from(this.availabilitySlots);

      this.availabilityEndArray.shift(); //removes the first timeslot from the end array
      this.availabilityStartArray.pop(); //removes the last timeslot from the start array

      this.availabilityStart = this.availabilityStartArray[0];
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
    startTimeUpdated() {
      this.availabilityEndArray = [];
      this.availabilityEndArray = this.availabilitySlots.filter(
        (obj) => obj.value >= this.availabilityStart.value
      );

      this.availabilityEndArray.shift(); //removes the first timeslot from the end array

      if (!this.availabilityEndArray.includes(this.availabilityEnd)) {
        this.availabilityEnd = null;
      }
    },
    createAvailability() {
      if (this.availabilityEnd == undefined) {
        this.errorMessage = "Please select an End Time";
        return;
      }
      const data = {
        date: this.selectedEvent.date,
        startTime: this.availabilityStart.value,
        endTime: this.availabilityEnd.value,
        userId: this.userId,
        eventId: this.selectedEvent.id,
      };
      if (!this.checkForOverlap(data)) {
        AvailabilityDataService.create(data)
          .then((response) => {
            this.errorMessage = "";
            this.currentAvailability.push(response.data);
            this.userAvailability.push(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.errorMessage =
          "That time would overlap with an existing time. Please try again";
      }
    },
    checkForOverlap(entry) {
      var result = false;
      if (entry.id == undefined) {
        this.currentAvailability.forEach((obj) => {
          if (!result) {
            if (
              (entry.startTime <= obj.startTime &&
                entry.endTime > obj.startTime) ||
              (entry.startTime > obj.startTime && entry.startTime < obj.endTime)
            ) {
              result = true;
            }
          }
        });
      } else {
        this.currentAvailability.forEach((obj) => {
          if (!result) {
            if (
              (entry.startTime <= obj.startTime &&
                entry.endTime > obj.startTime) ||
              (entry.startTime > obj.startTime && entry.startTime < obj.endTime)
            ) {
              if (obj.id != entry.id) {
                result = true;
              }
            }
          }
        });
      }
      return result;
    },
    deleteItem(item) {
      this.editedIndex = this.currentAvailability.indexOf(item);
      this.editedAvail = item;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      AvailabilityDataService.remove(
        this.currentAvailability[this.editedIndex].id
      ).catch((error) => {
        console.log(error);
      });
      this.userAvailability.splice(
        this.userAvailability.indexOf(
          this.currentAvailability[this.editedIndex]
        ),
        1
      );
      this.currentAvailability.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedAvail = null;
        this.editedIndex = -1;
      });
    },
    editItem(item) {
      this.editedIndex = this.currentAvailability.indexOf(item);
      this.editedAvail = item;
      this.editSelectedStart = this.availabilitySlots.find(
        (obj) => obj.value == this.editedAvail.startTime
      );
      this.editSelectedEnd = this.availabilitySlots.find(
        (obj) => obj.value == this.editedAvail.endTime
      );

      this.editStartOriginal = this.editSelectedStart.title;
      this.editEndOriginal = this.editSelectedEnd.title;

      this.editStartChange();
      this.dialogEdit = true;
    },
    editStartChange() {
      this.editEndArray = this.availabilitySlots.filter(
        (obj) => obj.value >= this.editSelectedStart.value
      );

      this.editEndArray.shift(); //removes the first timeslot from the end array

      if (!this.editEndArray.includes(this.editSelectedEnd)) {
        this.editSelectedEnd = null;
      }
    },
    editItemConfirm() {
      if (this.editSelectedEnd == undefined) {
        this.editErrorMessage = "Please select an End Time";
        return;
      }
      const index = this.userAvailability.indexOf(
        this.currentAvailability[this.editedIndex]
      );
      const data = {
        id: this.editedAvail.id,
        startTime: this.editSelectedStart.value,
        endTime: this.editSelectedEnd.value,
      };
      if (this.checkForOverlap(data)) {
        this.editErrorMessage =
          "That time would overlap with an existing time. Please try again";
      } else {
        AvailabilityDataService.update(data).catch((error) => {
          console.log(error);
        });
        this.currentAvailability[this.editedIndex].startTime = data.startTime;
        this.currentAvailability[this.editedIndex].endTime = data.endTime;
        this.userAvailability[index].startTime = data.startTime;
        this.userAvailability[index].endTime = data.endTime;

        this.closeEdit();
      }
    },
    closeEdit() {
      this.editErrorMessage = "";
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedAvail = null;
      });
    },
    async reset() {
      await this.getEvent();
      await this.getAvailabilityForUser();

      this.errorMessage = "";
      this.fillAvailabilityArrays();
      this.currentAvailability = this.userAvailability.filter(
        (obj) => obj.eventId == this.eventId
      );
    },
  },
  async created() {
    await this.reset();
  },
  props: {
    eventId: Number,
    userId: Number,
  },
  emits: ["closeDialog"],
};
</script>
