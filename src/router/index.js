import { createRouter, createWebHistory } from "vue-router";
import Base from "../views/Base.vue";
import LoginPage from "../views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/loginPage",
      component: LoginPage,
      name: "loginPage",
    },
    {
      path: "/base",
      component: Base,
      name: "base",
    },
    // Student Routes
    {
      path: "/base",
      component: Base,
      name: "studentHome",
      alias: "/studentHome",
    },
    {
      path: "/base",
      component: Base,
      name: "studentSettings",
      alias: "/studentSettings",
    },
    {
      path: "/base",
      component: Base,
      name: "studentRepertoire",
      alias: "/studentRepertoire",
    },
    {
      path: "/base",
      component: Base,
      name: "studentViewEvents",
      alias: "/studentViewEvents",
    },
    {
      path: "/base",
      component: Base,
      name: "studentEventSignUps",
      alias: "/studentEventSignUps",
    },
    {
      path: "/base",
      component: Base,
      name: "studentCritiques",
      alias: "/studentCritiques",
    },
    {
      path: "/base",
      component: Base,
      name: "studentRecordings",
      alias: "/studentRecordings",
    },
    // Faculty Routes
    {
      path: "/base",
      component: Base,
      name: "facultyHome",
      alias: "/facultyHome",
    },
    {
      path: "/base",
      component: Base,
      name: "facultyViewCritiques",
      alias: "/facultyViewCritiques",
    },
    {
      path: "/base",
      component: Base,
      name: "facultyCreateCritiques",
      alias: "/facultyCreateCritiques",
    },
    // Accompanist and Faculty Availability
    {
      path: "/base",
      component: Base,
      name: "createAvailability",
      alias: "/createAvailability",
    },
    // Admin Routes
    {
      path: "/base",
      component: Base,
      name: "adminHome",
      alias: "/adminHome",
    },
    {
      path: "/base",
      component: Base,
      name: "adminCreateEvents",
      alias: "/adminCreateEvents",
    },
    {
      path: "/base",
      component: Base,
      name: "adminViewEvents",
      alias: "/adminViewEvents",
    },
    {
      path: "/base",
      component: Base,
      name: "adminViewUsers",
      alias: "/adminViewUsers",
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  if (authRequired && !loggedIn) {
    return next("/");
  }
  next();
});

export default router;
