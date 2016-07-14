var socket = io();
var userId = "user";

$("#tempButton").click(function() {
    console.log("statistics click");
    socket.emit("tempButton", {});
});

$("#lightButton").click(function() {
    socket.emit("lightButton", {});
});

  socket.on('temperature', function(msg){
    $('#temperature').text(msg.temperature);
  });

  socket.on('light', function(msg){
    $('#light').text(msg.light);
  });

  socket.on('tresh', function(msg){
    $('#tresh').text(msg.tresh);
  });

  socket.on('tresh', function(msg){
    $('#tresh').text(msg.tresh);
  });

  socket.on('accel', function(msg){
    $('#accelX').text(msg.accelX);
    $('#accelY').text(msg.accelY);
    $('#accelZ').text(msg.accelZ);
      
      $('#pitch').text(msg.pitch);
      $('#roll').text(msg.roll);
      $('#acceleration').text(msg.acceleration);
      $('#inclination').text(msg.inclination);
      $('#orientation').text(msg.orientation);
  });

  socket.on('stick', function(msg){
    $('#stickX').text(msg.stickX);
    $('#stickY').text(msg.stickY);
    //$('#stickZ').text(msg.stickZ));
  });

  socket.on('canon', function(msg){
    $('#canonX').text(msg.canonX);
    $('#canonY').text(msg.canonY);
    //$('#stickZ').text(msg.stickZ));
  });