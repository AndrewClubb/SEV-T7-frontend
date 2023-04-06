import http from "./services.js";
class EventTimeDataService {
  baseUrl = "/performance-t2/eventTimeslot/";

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
