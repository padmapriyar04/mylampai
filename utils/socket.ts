
import { io, Socket } from 'socket.io-client';

interface UserStorage {
    state?: {
        token?: string;
    };
}

const userStorage: UserStorage | null = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('user-storage') as string) 
    : null;

const token: string | null = userStorage?.state?.token || null;

const socket: Socket = io('wss://localhost:4000/', {
    withCredentials: true,
    query: {
        token: token || '',
    },
});

export default socket;