// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = {};

const secretKey = "okokokok";

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }

      socket.user = decoded;
      users[socket.user.id] = socket.id;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(socket.user);
  console.log(`New client connected, ${socket.user.name}`);
  console.log(`client name, ${socket.user.name} client socketid ${socket.id}`);

  socket.on("message", async (data) => {
    console.log("Message received: ", data.message);
    io.to(socket.user.community.name).emit(
      "receive-message-community",
      data.message
    );

    try {
      await prisma.message.create({
        data: {
          content: data.message,
          sender: { connect: { id: socket.user.id } },
          community: { connect: { id: socket.user.community.id } },
        },
      });
      console.log("Message saved to MongoDB.");
    } catch (error) {
      console.error("Error saving message to MongoDB:", error);
    }
  });

  socket.on("dm", async (data) => {
    const recipientSocketId = users[socket.user.dmId.id];
    console.log(
      recipientSocketId +
        " : " +
        socket.user.dmId.id +
        " : " +
        users[socket.user.dmId.id]
    );
    if (recipientSocketId) {
      io.to(recipientSocketId).emit(
        "receive-message-dms",
        data.message,
        socket.user.name
      );
      console.log(
        `Message sent to user ${socket.user.dmId.name}: ${data.message} from ${socket.user.name}`
      );
      try {
        await prisma.directmessage.create({
          data: {
            content: data.message,
            sender: { connect: { id: socket.user.id } },
            receiver: { connect: { id: socket.user.dmId.id } },
          },
        });
        console.log("Direct message saved to MongoDB.");
      } catch (error) {
        console.error("Error saving direct message to MongoDB:", error);
      }
    } else {
      console.log(`User ${socket.user.dmId.name} is not connected.`);
    }
  });

  // Emitting messages to clients
  socket.on("fetch-community-messages", async () => {
    try {
      const messages = await prisma.message.findMany({
        where: {
          community: { id: socket.user.community.id },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      let messageContents = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const sender = await prisma.user.findFirst({
          where: { id: message.senderId },
        });
        const senderName = sender.name;
        messageContents.push(`${message.content} sent by ${senderName}`);
      }

      socket.emit("receive-message-community", messageContents);
    } catch (error) {
      console.error("Error fetching community messages:", error);
    }
  });

  socket.on("fetch-direct-messages", async () => {
    try {
      const messages = await prisma.directmessage.findMany({
        where: {
          receiver: { id: socket.user.id },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      let messageContents = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const sender = await prisma.user.findFirst({
          where: { id: message.senderId },
        });
        const senderName = sender.name;
        messageContents.push(`${message.content} sent by ${senderName}`);
      }

      socket.emit("receive-message-dms", messageContents);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  socket.on("receive-message-community", (data) => {
    console.log(data);
  });

  socket.on("receive-message-dms", (data) => {
    console.log(data);
  });

  socket.on("join-room", () => {
    socket.join(socket.user.community.name);
    console.log(
      `user ${socket.user.name} has joined room ${socket.user.community.name}`
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
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
