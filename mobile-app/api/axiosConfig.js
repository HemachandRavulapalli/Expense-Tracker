import axios from 'axios';
import { Platform } from 'react-native';

// For Android Emulator use 10.0.2.2, for Web/iOS use localhost
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const instance = axios.create({
    baseURL: BASE_URL,
});

export default instance;
