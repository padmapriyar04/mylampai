import { useEffect, useState } from 'react';

const url = "wss://127.0.0.1:8000//ws"

const useWebSocket = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onerror = (error) => {
            console.log("Error conecting socket: ", error)
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    return { ws };
};

export default useWebSocket;