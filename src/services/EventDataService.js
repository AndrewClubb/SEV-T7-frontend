import http from "./services.js";
class EventDataService {
  baseUrl = "/performance-t7/event/";

  getAll() {
    return http.get(this.baseUrl);
  }
  getGTEDate(date) {
    return http.get(this.baseUrl + `date/${date}`);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  createCritique(data) {
    return http.post(this.baseUrl, data);
  }

  getStudentTimeslotsForDate(date) {
    return http.get(this.baseUrl + "critiqueTimeslots/" + date);
  }

  getSemesterCritiques(semesterId) {
    return http.get(this.baseUrl + "semesterCritiques/" + semesterId);
  }

  getStudentSemesterCritiques(semesterId, userId) {
    return http.get(
      this.baseUrl + "semesterCritiques/" + semesterId + "/user/" + userId
    );
  }

  getBySemester(semesterId) {
    return http.get(this.baseUrl + `semesterId/${semesterId}`);
  }
}
export default new EventDataService();
