import axios from 'axios';

export const api = axios.create({
    // no android tem que ser o endereço ip para funcionar
    baseURL: 'http://192.168.0.7:3333'
});