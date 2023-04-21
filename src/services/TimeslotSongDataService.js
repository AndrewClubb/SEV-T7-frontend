import http from "./services.js";
class TimeslotSongDataService {
  baseUrl = "/performance-t7/timeslotSong/";

  getAll() {
    return http.get(this.baseUrl);
  }

  getByTimeslotId(timeslotId) {
    return http.get(this.baseUrl + "timeslotId/" + timeslotId);
  }

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
export default new TimeslotSongDataService();
