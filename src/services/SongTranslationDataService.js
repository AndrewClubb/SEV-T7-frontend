import http from "./services.js";
class SongTranslationDataService {
  baseUrl = "/performance-t7/songTranslation/";

  getAll() {
    return http.get(this.baseUrl);
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
export default new SongTranslationDataService();
