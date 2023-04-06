import http from "./services.js";
class CritiqueDataService {
  baseUrl = "/performance-t2/critique/";

  getAll() {
    return http.get(this.baseUrl);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  update(id, data) {
    return http.put(this.baseUrl + id, data);
  }
  delete(id) {
    return http.delete(this.baseUrl + id);
  }
  deleteAll() {
    return http.delete(this.baseUrl);
  }
}
export default new CritiqueDataService();
