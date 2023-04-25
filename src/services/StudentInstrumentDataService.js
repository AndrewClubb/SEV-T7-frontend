import http from "./services.js";
class StudentInstrumentDataService {
  baseUrl = "/performance-t7/studentInstrument/";

  getAll() {
    return http.get(this.baseUrl);
  }

  getByUser(userId) {
    return http.get(this.baseUrl + "userId/" + userId);
  }

  getStudentsForInstructorId(id) {
    return http.get(this.baseUrl + "students/instructorId/" + id);
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
export default new StudentInstrumentDataService();
