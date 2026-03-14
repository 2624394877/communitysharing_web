import auth from "./auth";
import user from "./user";
import content from "./content";

const api = { 
    BaseURL: 'http://127.0.0.1:8081/',
    auth,
    user,
    content
};

export default api;