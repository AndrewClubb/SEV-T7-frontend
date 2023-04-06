import http from "./services.js";
class UserRoleDataService {
  baseUrl = "/performance-t2/userRole/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getRolesForUser(userId) {
    return http.get(this.baseUrl + "roles/userId/" + userId);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }
}
export default new UserRoleDataService();
