// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000', 
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
});
const users = {};

const secretKey = 'okokokok';

io.use((socket, next) => {
   
    const token = socket.handshake.query.token; 
    if (token) {
        
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
             
                return next(new Error('Authentication error'));
            }
            
            socket.user = decoded; 
            users[socket.user.id]=socket.id;
            next();
        });
    } else {
        
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    
    console.log(socket.user);
    console.log(`New client connected, ${socket.user.email}`);
    console.log(`client name, ${socket.user.email} client socketid ${socket.id}`)
    
    /*socket.on('message', async (data) => {
        console.log('Message received: ', data.message);
        console.log(data);
        io.to(data.community).emit('receive-message-community', data.message);
    
        try {
            await prisma.message.create({
                data: {
                    content: data.message,
                    sender:  { connect: { id: socket.user.id } },
                    community: {connect: { id: data.community}}  
                }
            });
            console.log('Message saved to MongoDB.');
        } catch (error) {
            console.error('Error saving message to MongoDB:', error);
        }
    });*/
    socket.on('check-join', async (data) => {
        try {
            console.log("here");
            const existUser = await prisma.community.findFirst({
                where: {
                    id: data.community,
                    userIds: {
                        has: socket.user.id
                    }
                }
            });
            
            if (existUser) {
                socket.join(data.communityId);
                console.log(`user ${socket.user.email} has joined room ${data.communityId}`);
            }
            else{
                console.log("nah");
            }
        } catch (error) {
            console.error('Error checking user in community:', error);
        }
    });
    
    socket.on('message', async (data) => {
        console.log('Message received:', data.message);
        console.log(data);
    
        // Check and log IDs
        const senderId = socket.user?.id;
        const communityId = data.community;
        const messageContent = data.message;
    
        console.log('Sender ID:', senderId);
        console.log('Community ID:', communityId);
        console.log('Message Content:', messageContent);
    
        if (senderId && communityId && messageContent) {
            try {
               
                const savedMessage = await prisma.message.create({
                    data: {
                        content: messageContent,
                        sender: { connect: { id: senderId } },
                        community: { connect: { id: communityId } }
                    },
                    include: {
                        sender: true,
                        community: true, 
                    }
                });
    
                console.log('Message saved to database:', savedMessage);
    

                io.to(communityId).emit('receive-message-community', savedMessage);
             
                // socket.emit('receive-message-community', savedMessage);
            } catch (error) {
                console.error('Error saving message to database:', error);
            }
        } else {
            console.error('Invalid Sender ID, Community ID, or Message Content.');
        }
    });

    socket.on('dm', async (data) => {
      
        const recipientSocketId = users[socket.user.dmId.id]; 
        console.log(recipientSocketId+" : "+ socket.user.dmId.id + " : "+users[socket.user.dmId.id]);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive-message-dms', data.message,socket.user.name);
            console.log(`Message sent to user ${socket.user.dmId.name}: ${data.message} from ${socket.user.name}`);
            try {
                await prisma.directmessage.create({
                    data: {
                        content: data.message,
                        sender:  { connect: { id: socket.user.id } },
                        receiver: { connect: { id: socket.user.dmId.id } }
                    }
                });
                console.log('Direct message saved to MongoDB.');
            } catch (error) {
                console.error('Error saving direct message to MongoDB:', error);
            }
        } else {
            console.log(`User ${socket.user.dmId.name} is not connected.`);
        }
    });

    // Emitting messages to clients
    socket.on('fetch-community-messages', async ({ communityId }) => {
        try {
            console.log("reached");
            const messages = await prisma.message.findMany({
                where: { communityId: communityId },
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    seenIds: true,
                    communityId: true,
                    senderId: true,
                    sender: { 
                        select: {
                            id: true,
                            first_name: true
                        }
                    }
                }
            });
            console.log(messages[0]);
            socket.emit('receive-message-community', messages);
        } catch (error) {
            console.error('Error fetching community messages:', error);
        }
    });
   /* socket.on('fetch-community-messages', async (data) => {
        try {
            const messages = await prisma.message.findMany({
                where: {
                    community: { id: data.communityId }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
           
            let messageContents=[];
            for(let i=0; i<messages.length; i++){
                const message= messages[i];
                const sender= await prisma.user.findFirst({
                    where:{id: message.senderId}
                })
                //const senderName= sender.name;
                messageContents.push(`${message.content} `);
            }
         
            socket.emit('receive-message-community', messageContents);
        } catch (error) {
            console.error('Error fetching community messages:', error);
        }
    });*/

    socket.on('fetch-direct-messages', async () => {
        try {
            const messages = await prisma.directmessage.findMany({
                where: {
                    receiver: { id: socket.user.id }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
           
            let messageContents=[];
            for(let i=0; i<messages.length; i++){
                const message= messages[i];
                const sender= await prisma.user.findFirst({
                    where:{id: message.senderId}
                })
                const senderName= sender.name;
                messageContents.push(`${message.content} sent by ${senderName}`);
            }
         
            socket.emit('receive-message-dms', messageContents);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    });
    
	socket.on("receive-message-community", (data) => {
		console.log(data);
    });

    socket.on("receive-message-dms", (data) => {
		console.log(data);
    });

    socket.on("join-room",(data)=>{
        console.log(data);
        socket.join(data.communityId);
        console.log(`user ${socket.user.email} has joined room ${data.communityId}`);
    })

    socket.on("leave-room",(data)=>{
        console.log(data);
        socket.leave(data.communityId);
        console.log(`user ${socket.user.email} has left room ${data.communityId}`);
    })


    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));





/*const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = {};

const secretKey = 'okokokok';

io.use((socket, next) => {
   
    const token = socket.handshake.query.token; 
    if (token) {
        
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
             
                return next(new Error('Authentication error'));
            }
            
            socket.user = decoded; 
            users[socket.user.id]=socket.id;
            next();
        });
    } else {
        
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    
    console.log(socket.user);
    console.log(`New client connected, ${socket.user.name}`);
    console.log(`client name, ${socket.user.name} client socketid ${socket.id}`)
    
    socket.on('message', (data) => {
        console.log('Message received: ', data.message);
        io.to(socket.user.community.name).emit('receive-message', data.message);
    });

    socket.on('dm', (data) => {
        const recipientSocketId = users[socket.user.dmId.id]; 
        console.log(recipientSocketId+" : "+ socket.user.dmId.id + " : "+users[socket.user.dmId.id]);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive-message', data.message,socket.user.name);
            console.log(`Message sent to user ${socket.user.dmId.name}: ${data.message} from ${socket.user.name}`);
        } else {
            console.log(`User ${socket.user.dmId.name} is not connected.`);
        }
    });


	socket.on("receive-message", (data) => {
		console.log(data);
    });

    socket.on("join-room",()=>{
        socket.join(socket.user.community.name);
        console.log(`user ${socket.user.name} has joined room ${socket.user.community.name}`);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/
