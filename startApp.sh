#!/bin/bash

#Server
cd server
npm i
npm run dev &

#Websocket
npm run socketDev &

#Client
cd ../client
npm i
npm run dev

#Finish Message
echo "done"