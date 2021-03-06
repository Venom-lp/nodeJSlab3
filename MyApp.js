var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;

var ip;
var id;

server.listen(port, function() {
   console.log('Listening on ' + port);
});


app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(server);

io.configure(function () {
   io.set("transports", ["xhr-polling"]);
   io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {

   socket.on('vkID', function(data) {

 id = data.id;

  });
  
   socket.on('score', function (score) {
       if (id != null){
         var user = {vkid: id ,  ipAddress: ip, dateConnection: new Date(), clickScore:score.clicked};
         
    conn.collection('collectionName').findOne(
    {
      vkid:user.vkid
    },
    function(err, doc)
    {
    if (err) { }
    if (doc) //если пользователь есть, то обновляем
     {  
         //socket.emit('saved', {pos:'update'});
         conn.collection('collectionName').update(
        {
             vkid:user.vkid
        },
        {
    
           $set: {updated_at: new Date(),clickScore: user.clickScore}
            //$set: {: new Date()}
        },
        {
            
         upsert:true
        });
     }
     else //если нет, то создаем
     {
         /// socket.emit('saved', {pos:'saved'});
         conn.collection('collectionName').insert(user, {safe: true}, function(err, records){
       ////console.log("Record added  ");

         });
     }
});
       
       }   
   });
   
});

var mongo = require('mongoskin');
var conn = mongo.db('mongodb://venom-lp:spider11@dharma.mongohq.com:10001/nodeJSDataBase');


app.get('/', function (request, response)
{
   response.sendfile(__dirname + '/index.html');
   
   ip = request.connection.remoteAddress;
  // var user = {ipAddress: ip, dateConnection: new Date()};


   
});

