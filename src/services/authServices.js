import apiClient from "./services.js";

export default {
  loginUser(user) {
    return apiClient.post("performance-t2/login", user);
  },
  authorizeUser(code) {
    return apiClient.post("performance-t2/authorize", code);
  },
  logoutUser(token) {
    return apiClient.post("performance-t2/logout", token);
  },
};
