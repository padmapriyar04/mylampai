import { io } from 'socket.io-client';

const socket = io('https://mylamp-server.onrender.com', {
    withCredentials: true,
    query: {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
    }
});

export default socket; 
