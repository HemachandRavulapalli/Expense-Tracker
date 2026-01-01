import axios from 'axios';
import { Platform } from 'react-native';

// For Web use localhost, for Mobile use LAN IP (192.168.1.17)
const BASE_URL = Platform.OS === 'web' ? 'http://localhost:5000/api' : 'http://192.168.1.17:5000/api';

const instance = axios.create({
    baseURL: BASE_URL,
});

export default instance;
