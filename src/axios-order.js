import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://burgerbuilder-dd489-default-rtdb.firebaseio.com/'
});

export default instance;