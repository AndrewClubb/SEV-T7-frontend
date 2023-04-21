import http from "./services.js";
class CritiqueDataService {
  baseUrl = "/performance-t7/critique/";

  getAll() {
    return http.get(this.baseUrl);
  }

  getCritiquesByTimeslotAndFaculty(timeslotId, facultyId) {
    return http.get(
      this.baseUrl + "timeslotId/" + timeslotId + "/facultyId/" + facultyId
    );
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  delete(id) {
    return http.delete(this.baseUrl + id);
  }

  deleteAll() {
    return http.delete(this.baseUrl);
  }
}
export default new CritiqueDataService();
