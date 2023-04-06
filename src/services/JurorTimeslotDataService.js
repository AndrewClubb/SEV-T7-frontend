import http from "./services.js";
class JurorTimeslotDataService {
  baseUrl = "/performance-t7/jurorTimeslot/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }
}
export default new JurorTimeslotDataService();
