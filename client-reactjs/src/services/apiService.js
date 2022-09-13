import axios from "axios";
import config from "../config.json";
axios.defaults.withCredentials = true;

async function post(path, data) {
  try {
    return await axios
      .post(config.BackendUrl + path, data, { withCredentials: true })
      .catch((error) => {
        if (window.location.href.includes("localhost")) {
          console.error(error);
        }
      });
  } catch (error) {
    return false;
  }
}

async function get(path) {
  try {
    return await axios
      .get(config.BackendUrl + path, { withCredentials: true })
      .catch((error) => {
        if (window.location.href.includes("localhost")) {
          console.error(error);
        }
      });
  } catch (error) {
    return false;
  }
}

async function put(path, data) {
  try {
    return await axios
      .put(config.BackendUrl + path, data, { withCredentials: true })
      .catch((error) => {
        if (window.location.href.includes("localhost")) {
          console.error(error);
        }
      });
  } catch (error) {
    return false;
  }
}

export default class ApiService {
  static async login(email, password) {
    return await post("/login", { email, password });
  }
  static async status() {
    return await get("/user/status");
  }

  static async logout() {
    return await post("/logout");
  }

  static async register(email, password) {
    return await put("/register", { email, password });
  }
}
