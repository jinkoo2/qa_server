
class websocket_handler{
    constructor(){
        console.log('socketes=', this.sockets)
        this.websocketserver = null;
    }

    name = 'hello~~~, I am your handler!'
    websocketserver = null;
    set_server(server){
        this.websocketserver = server
    }
  
    // all open clients
    get_all_open_clients(){
        return Array.from(this.websocketserver.clients).filter(client=>client.readyState === WebSocket.OPEN);
    }

    // all open clients except the given one
    get_all_open_clients_except_this(ws){
        return this.get_all_open_clients().filter(client => client !== ws)
    }

    // onconnection
    onconnection (ws) {
      console.log('new client connected');
       
      ws.on('message', (message) => {
        console.log('Received message:', message);
        // Broadcast the message to all connected clients
        // wss.clients.forEach((client) => {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     client.send(message);
        //   }
        // });
        
        // var msg = 'hello from the server~~~'
        // console.log('sending echo back: '+msg)
        // ws.send(msg)
      });
    
      ws.on('close', () => {
        console.log('Client disconnected');
        console.log(ws)
      });
    
      ws.send("cmd - please start the training!")
    }
  }

  module.exports = websocket_handler