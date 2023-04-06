import http from "./services.js";
class SongDataService {
  baseUrl = "/performance-t7/song/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getByComposerId(composerId) {
    return http.get(this.baseUrl + "composer/" + composerId);
  }
}
export default new SongDataService();
