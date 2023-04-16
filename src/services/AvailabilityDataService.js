import http from "./services.js";
class AvailabilityDataService {
  baseUrl = "/performance-t7/availability/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getByUser(userId) {
    return http.get(this.baseUrl + "userId/" + userId);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getByUserAndEvent(userId, eventId) {
    return http.get(this.baseUrl + "userId/" + userId + "/eventId/" + eventId);
  }
}
export default new AvailabilityDataService();
