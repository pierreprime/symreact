import axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../config";

function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers['Authorization'];
}

function setAxiosToken(token){
    axios.defaults.headers['Authorization'] = 'Bearer ' + token;
}

function setup() {
    // check if token
    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

function isAuthenticated(){
    // check if token
    const token = window.localStorage.getItem('authToken');
    if(token){
        const {exp: expiration} = jwtDecode(token);
        // boolean
        return expiration * 1000 > new Date().getTime();
    }
    return false;
}

function authenticate(credentials) {
    return axios.post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // use of localStorage to store JWT
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token);

            return true;
        });
}

// expose defined function for outside use
export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};