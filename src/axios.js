import axios from "axios"

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5001/clone-a2247/us-central1/api' // THE API URL
});

export default instance