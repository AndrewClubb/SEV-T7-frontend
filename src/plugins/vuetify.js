// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const myCustomTheme = {
  dark: false,
  colors: {
    primary: "#80162B",
    cream: "#DADADA",
    darkB: "#00ACC1",
    fav: "d2f0ee", //light blue
    secondary: "#262626", //grey
  },
};

// Vuetify
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    defaultTheme: "myCustomTheme",
    themes: {
      myCustomTheme,
    },
  },
  components: {
    VDataTable,
  },
});
