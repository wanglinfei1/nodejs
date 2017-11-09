const userApi = require('./userApi');
const stockApi =require('./stockApi');
const musicApi = require('./musicApi')
const querystring = require('querystring');
const path=require('path');
const WebSocketServer =require('ws').Server;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false,"limit":"30000kb"}));
app.use(bodyParser.json({ "limit":"30000kb"}));
app.use('/api',userApi);
app.use('/api',stockApi);
app.use('/api',musicApi)
const server = app.listen(8000, function () {
    console.log('listen: http://localhost:8000');
});

const subscriptions = [];

const wsServer = new WebSocketServer({port:8002,verifyClient:scorkeVerify})

function scorkeVerify(info){
  var origin = info.origin.match(/^(:?.+\:\/\/)([^\/]+)/);
  return true;
}

wsServer.on('connection', (websocket,req) => {
  var query=querystring.parse(req.url.replace('/?',''))
  var userName=query.userName;
  console.log(userName+'连接')
  websocket.send(JSON.stringify({messageCount:userName+'欢迎连接服务器'}));
  subscriptions.push({ws:websocket,userName:userName});
  sendMessage()
  websocket.on('message',message => {
    console.log(message)
  })
  websocket.on('close',() => {
    closeSocket(userName)
  })
})

let timer=null;
function sendMessage(){
  let i = 0;
  clearInterval(timer)
  timer=setInterval(() => {
    i++;
    subscriptions.forEach((item,index) => {
      if(item.ws.readyState == 1){
        item.ws.send(JSON.stringify({messageNumb:i}));
      }else{
        subscriptions.splice(index,1);
        index--;
      }
    })
  },100000)
}

function closeSocket(userName) {
  subscriptions.forEach((item,index) => {
    if(item.ws.readyState != 1&&item.userName == userName) {
      console.log(userName+'客户端断开连接')
      subscriptions.splice(index, 1);
      index--;
    }
  })
}
