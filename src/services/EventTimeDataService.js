import http from "./services.js";
class EventTimeDataService {
  baseUrl = "/performance-t7/eventTimeslot/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  remove(dataId) {
    return http.delete(this.baseUrl + dataId);
  }

  getAll() {
    return http.get(this.baseUrl);
  }

  get(id) {
    return http.get(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getByEvent(id) {
    return http.get(this.baseUrl + `event/${id}`);
  }
}
export default new EventTimeDataService();
