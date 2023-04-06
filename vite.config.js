import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
//   resolve: {
//     alias: {
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//     },
//   },
// });

export default () => {
  const baseURL =
    process.env.APP_ENV === "development" ? "/" : "performance/t2/";

  return defineConfig({
    transpileDependencies: ["vuetify"],
    plugins: [vue(), vuetify({ autoImport: true })],

    server: {
      host: "localhost",
      port: 8081,
    },
    base: baseURL,
  });
};
