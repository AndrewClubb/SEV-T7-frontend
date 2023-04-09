import http from "./services.js";
class EventTimeDataService {
  baseUrl = "/performance-t7/eventTimeslot/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getAll() {
    return http.get(this.baseUrl);
  }

  get(id) {
    return http.get(this.baseUrl + id);
  }

  getByEvent(id) {
    return http.get(this.baseUrl + `event/${id}`);
  }
}
export default new EventTimeDataService();
