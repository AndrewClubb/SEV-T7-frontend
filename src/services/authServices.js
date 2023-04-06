import apiClient from "./services.js";

export default {
  loginUser(user) {
    return apiClient.post("performance-t7/login", user);
  },
  authorizeUser(code) {
    return apiClient.post("performance-t7/authorize", code);
  },
  logoutUser(token) {
    return apiClient.post("performance-t7/logout", token);
  },
};
