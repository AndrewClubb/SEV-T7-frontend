<template>
  <v-container fluid class="fill-height bg-primary">
    <v-row class="fill-height pa-0 ma-0" justify="center">
      <v-col class="pa-0 ma-0">
        <v-expansion-panels variant="accordion" multiple>
          <v-expansion-panel
            bg-color="primary"
            prominent
            class="elevation-0 pa-0 ma-0"
            v-for="(menu, index) in menus"
            :key="index"
            :value="index"
            :title="menu.title"
          >
            <v-expansion-panel-text class="pa-0 ma-0">
              <v-container class="pa-0 ma-0">
                <v-row
                  v-for="(link, index) in menu.links"
                  :key="index"
                  :value="index"
                  class="pa-0 ma-0"
                >
                  <v-col class="pa-0 ma-0">
                    <v-btn
                      block
                      color="primary"
                      prominent
                      class="elevation-0"
                      @click="changeComp(link.route)"
                    >
                      {{ link.link }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainNav",
  props: {},
  components: {},
  data() {
    return {
      drawer: false,
      selectedItem: "",
      menus: [
        {
          title: "Student",
          links: [
            { link: "View Repertoire", route: "studentRepertoire" },
            { link: "Upcoming Events", route: "studentViewEvents" },
            { link: "Event Sign-Ups", route: "studentEventSignUps" },
            { link: "View Your Critiques", route: "studentCritiques" },
            { link: "Event Recordings", route: "studentRecordings" },
          ],
        },
        {
          title: "Faculty",
          links: [
            { link: "View Student Critiques", route: "facultyViewCritiques" },
            { link: "Create Event Critique", route: "facultyCreateCritiques" },
            { link: "Event Availability", route: "createAvailability" },
          ],
        },
        {
          title: "Accompanist",
          links: [{ link: "Event Availability", route: "createAvailability" }],
        },
        {
          title: "Admin",
          links: [
            { link: "Create Event", route: "adminCreateEvents" },
            { link: "Events", route: "adminViewEvents" },
          ],
        },
      ],
    };
  },
  // emits: ["changeComp"],
  // setup(props, { emit }) {
  //   const changeComp = (route) => {
  //     this.$router.push({ path: route });
  //   };
  //   return {
  //     changeComp,
  //   };
  // },
  methods: {
    changeComp(route) {
      console.log(route);
      this.$router.push({ path: route });
    },
  },
});
</script>

<style scoped>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
  margin: 0;
}
</style>
