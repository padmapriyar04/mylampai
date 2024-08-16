import { io } from 'socket.io-client';

const socket = io('wss://localhost:4000/', {
    withCredentials: true,
    query: {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
    }
});

export default socket; 
