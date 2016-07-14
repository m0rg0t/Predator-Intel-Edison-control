var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var unirest = require('unirest');
var groveSensor = require('jsupm_grove');
var mraa = require('mraa');

var version = mraa.getVersion();





// configure jshint
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

// change this to false to use the hand rolled version
var useUpmVersion = true;

// Create the button object using GPIO pin 0
//var button = new groveSensor.GroveButton(2);

var servoModule = require("jsupm_servo");

var Player = require('player');
 
// create player instance 
try {
    //var player = new Player(path.join(__dirname, 'sounds/voice1.mp3'));
    var player;
    //playSong( "client/sounds/music/Predator OST - Mind.mp3");
    playSong( "client/sounds/initializing.mp3");
} catch(ex) {
    console.log(ex);
}


//loop music background
var playerMusic = new Player(path.join(__dirname, 'client/sounds/music/bg1.mp3'));
playerMusic.play(function(err, player){
        console.log(err);
        try {
            //player.stop();
            console.log('playend!');
        } catch(ex) {
            console.log(ex);
        }  
    });
    playerMusic.on('playend', function() {
        playerMusic.play();
       console.log("playend");
       //player.stop(); 
    });
    playerMusic.on('error', function(err){
      playerMusic.add(path.join(__dirname, 'client/sounds/music/bg1.mp3'));
      playerMusic.play();
        playerMusic.on('error', function(err){});
      // when error occurs 
      console.log(err);
    });


function playSong(pathsound, callback) {
    if( Object.prototype.toString.call( pathsound ) === '[object Array]' ) {
        var pathsound2 = [];
        for (var i = 0; i < pathsound.length; i++) {
            var item = path.join(__dirname, pathsound[i]);
            //console.log(item);
            pathsound2.push(item);
        }
        console.log(pathsound2);
        player = new Player(pathsound2[0]);
    } else {
        pathsound = path.join(__dirname, pathsound);
        player = new Player(pathsound);
    }  
    
    if (callback===undefined) {
        callback = function() {};
    }
    
    // play now and callback when playend 
    player.play(function(err, player){
        console.log(err);
        try {
            //player.stop();
            console.log('playend!');
            callback();
        } catch(ex) {
            console.log(ex);
        }  
    });
    player.on('playend', function() {
       console.log("playend");
       //player.stop(); 
    });
    player.on('error', function(err){
      // when error occurs 
      console.log(err);
      callback();
    });
}



var moveTimeouts = [];
var temperatureVal = 24;
var lightVal = 30;

var buzzer = {
        buzzer: null,
        init: function () {
            buzzer.buzzer = new mraa.Gpio(3);

            buzzer.buzzer.dir(mraa.DIR_OUT);
            buzzer.buzzerState = true;
        },
        buzzState: true,
        periodicBuzzerActivity: function (manual) {
            //manual = 0;
            if ((manual === null) && (manual === undefined)) {
                buzzer.buzzer.write(buzzer.buzzerState ? 1 : 0); // установим сигнал по состоянию
                //buzzerState = !buzzerState;
            } else {
                buzzer.buzzerState = manual;
                buzzer.buzzer.write(manual ? 1 : 0);
            }
        },
        periodicMainBuzzerActivity: function () {
            buzzer.periodicBuzzerActivity(1);
            setInterval(function () { buzzer.periodicBuzzerActivity(0); }, 400);
        }
    };

buzzer.init();

var activeMotor = false;
var canonInterval = null;
var prevButtonValue = 0;
// Read the input and print, waiting one second between readings


// Create the temperature sensor object using AIO pin 0

var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});

var GunMode = 0;

board.on("ready", function() {
        
    var servoX = new five.Servo({
      pin: 5,
      startAt: 90,
      range: [90, 160]
    });
    
    var servoY = new five.Servo({
      pin: 6,
      startAt: 50,
      range: [40, 60]
    });
    var servoXCurrent = 90;
    var servoYCurrent = 20;
    var servoYDefault = 40;
    
    servoX.stop();
    servoY.stop();
    
    servoX.to(90);
    servoY.to(servoYDefault);
    
    
  var lcd = new five.LCD({
    controller: "JHD1313M1"
  });

  lcd.bgColor("#00ff00");
  lcd.cursor(0, 0).print("GUN MODE: 0");
    
var temperature = new groveSensor.GroveTemp(3);
var light = new groveSensor.GroveLight(1);
console.log(temperature.name());
console.log(light.name());
    
/*var upmMicrophone = require("jsupm_mic");
// Attach microphone to analog port A0
var myMic = new upmMicrophone.Microphone(1);

var threshContext = new upmMicrophone.thresholdContext;
threshContext.averageReading = 0;
threshContext.runningAverage = 0;
threshContext.averagedOver = 2;*/
    

    var waiting = setInterval(function() {
    
    var celsius = temperature.value();
        temperatureVal = celsius;
        lightVal = light.value();
    //console.log("light", light.value());
    lcd.cursor(1, 0).print(celsius + "C");
    lcd.cursor(0, 13).print(light.value().toString().slice(0,3));   
    
    try {
        io.emit('temperature', { for: 'everyone', temperature: celsius });    
        io.emit('light', { for: 'everyone', light: light.value() });
    } catch(ex) {
        console.log(ex);
    }
    
    /////////////////
    /*var buffer = new upmMicrophone.uint16Array(128);
    var len = myMic.getSampledWindow(2, 128, buffer);
        console.log("len", len);
    if (len)
    {
        var thresh = myMic.findThreshold(threshContext, 30, buffer, len);
        
        if (thresh) {
            try {
                io.emit('thresh', { for: 'everyone', thresh: thresh });
                console.log(tresh);
            } catch(ex) {};
            //myMic.printGraph(threshContext);
        }
    }*/
    //////////////
    io.emit('canon', { for: 'everyone', 'canonX': servoX.position, 'canonY': servoY.position });  
    switch (GunMode) {              
          case 0:            
              break;
    }
    
}, 500);
    
  

    
  var button = new five.Button(2);

  // The following will turn the Led
  // on and off as the button is
  // pressed and released.
  button.on("press", function() {
    buzzer.periodicBuzzerActivity(1);
      if (GunMode<3) { //3
          GunMode++;
      } else {
          GunMode = 0;
      }
      console.log("GunMode", GunMode);
  });

  button.on("release", function() {
    buzzer.periodicBuzzerActivity(0);
      
      lcd.cursor(0, 10).print(GunMode);
      switch (GunMode) {
          case 0:
              lcd.bgColor("#00ff00");

              servoX.to(90);
              servoY.to(servoYDefault);
              servoX.stop();
              servoY.stop();
              playSong(["client/sounds/gun_mode_0.mp3","client/sounds/gun_is_disabled.mp3"], function() {
              });
              break;
          case 2: 
              lcd.bgColor("#0000ff");
              servoX.stop();
              servoY.stop();
              servoX.sweep();
              //servoX.to(160, 1000);
              console.log("sweep1");
              /*servoY.sweep({
                  //interval: 3000,
                  step: 10
              });*/
              playSong(["client/sounds/gun_mode_2.mp3","client/sounds/Automatic_gun_mod.mp3"], function() {
                  //playSong("client/sounds/Automatic_gun_mod.mp3");
              });
              break;
          case 3: 
              lcd.bgColor("#0088ff");
              servoX.stop();
              servoY.stop();
              servoX.sweep();
              servoY.sweep();
              //servoX.to(160, 1000);
              console.log("sweep1");
              /*servoY.sweep({
                  //interval: 3000,
                  step: 10
              });*/
              playSong(["client/sounds/gun_mode_3.mp3","client/sounds/Automatic_gun_mod.mp3"], function() {
                  //playSong("client/sounds/Automatic_gun_mod.mp3");
              });
              break;
          case 1: 
              lcd.bgColor("#ff0000");
              servoX.stop();
              servoY.stop();
              servoX.to(90);
              servoY.to(servoYDefault);
              servoXCurrent = 90;
              servoYCurrent = servoYDefault;
              playSong( ["client/sounds/gun_mode_1.mp3", "client/sounds/manual_control_for_gun.mp3"], function() {
                  //playSong("client/sounds/manual_control_for_gun.mp3");
              });
              break;
              
          /*case 3: 
              lcd.bgColor("#ff00ff");
              servoX.stop();
              servoY.stop();
              servoX.to(90);
              servoY.to(servoYDefault);
              servoXCurrent = 90;
              servoYCurrent = servoYDefault;
              break;*/
          default:
      }
  });
    
process.on('SIGINT', function()
{
  clearInterval(myInterval);
    servoX.to(90);
    servoY.to(servoYDefault);
  console.log("Exiting...");
  process.exit(0);
});
    
    
    /*var proximity = new five.Proximity({
     //controller: "HCSR04",
     // pin: 7
      //pin: "A2"
      controller: "HCSR04I2CBACKPACK"
    });*/

// When exiting: clear interval and print message

    var led = new five.Led(4);
    led.blink(500);
    
  var joystick = new five.Joystick(["A0", "A1"]);

  // Observe change events from the Joystick!
  joystick.on("change", function() {
      try {
        io.emit('stick', { for: 'everyone', stickX: this.x, stickY: this.y });
      } catch(ex) {
          console.log(ex);
      }
      
      if (GunMode === 1) {
      lcd.cursor(1, 12).print(this.y.toString().slice(0,4));      
      lcd.cursor(1, 7).print(this.x.toString().slice(0,4));
          
      //console.log("  x            : ", this.x);
      //console.log("  y            : ", this.y);
      
      if (Math.abs(this.x)>0.3) {
          servoXCurrent += this.x*4;
          if (servoXCurrent>160) {
              servoXCurrent = 160;
          }
          if (servoXCurrent<90) {
              servoXCurrent = 90;
          }
          servoXCurrent = Math.round(servoXCurrent);
          servoX.to(servoXCurrent);
      }
      
      if (Math.abs(this.y)>0.2) {
          servoYCurrent += this.y*3;
          if (servoYCurrent>60) {
              servoYCurrent = 60;
          }
          if (servoYCurrent<servoYDefault) {
              servoYCurrent = servoYDefault;
          }
          servoYCurrent = Math.round(servoYCurrent);
          servoY.to(servoYCurrent);
      }    
      }
  });
    
  var acceleration = new five.Accelerometer({
    controller: "MMA7660"
  });

  acceleration.on("change", function() {
      
      try {
        io.emit('accel', { for: 'everyone', accelX: this.x, accelY: this.y, accelZ: this.z, pitch: this.pitch, roll: this.roll, acceleration: this.acceleration, inclination: this.inclination, orientation: this.orientation});
      } catch(ex) {
          console.log(ex);
      }
      
    /*if (GunMode === 3) {
    lcd.cursor(1, 12).print(this.y.toString().slice(0,4));
      
    lcd.cursor(1, 7).print(this.x.toString().slice(0,4));   
    
      
      if (Math.abs(this.x - 1)>0.3) {
          servoXCurrent += (this.x - 1);
          if (servoXCurrent>140) {
              servoXCurrent = 140;
          }
          if (servoXCurrent<40) {
              servoXCurrent = 40;
          }
          
          servoX.to(servoXCurrent);
      }
      
      if (Math.abs(this.y)>0.1) {
          servoYCurrent += this.y;
          if (servoYCurrent>140) {
              servoYCurrent = 140;
          }
          if (servoYCurrent<20) {
              servoYCurrent =20;
          }
          servoY.to(servoYCurrent);
      } 
      }*/
    
  });
    


    
});


var connectedUsersArray = [];
var userId;



app.set('views', __dirname + '/client/views');
app.set('view engine', 'ejs');



app.get('/', function (req, res) {
    //Join all arguments together and normalize the resulting path.
    //res.sendFile(path.join(__dirname + "/client", 'index.html'));
    res.render('index', { name: "example" });
});

app.get('/control', function (req, res) {
    //Join all arguments together and normalize the resulting path.
    //res.sendFile(path.join(__dirname + "/client", 'index.html'));
    res.render('index', { name: "example" });
});

io.on('connection', function(socket){
    console.log("connection");
  socket.on('tempButton', function(msg){
      if (temperatureVal<25) {
        playSong( "client/sounds/Predator temperature is more then 20 degrees.mp3");
      }
      if ((temperatureVal>=25) && (temperatureVal<30)) {
         playSong( "client/sounds/Predator temperature is more then 25 degrees.mp3"); 
      }
      if ((temperatureVal>=30) && (temperatureVal<35)) {
          playSong( "client/sounds/Predator temperature is more then 30 degrees.mp3");
      }
      if ((temperatureVal>=35) && (temperatureVal<40)) {
          playSong( "client/sounds/Predator temperature is more then 35 degrees.mp3");
      }
      if ((temperatureVal>=40)) {
          playSong( "client/sounds/Predator temperature is more then 40 degrees.mp3");
      }
      
  });
    
    
  socket.on('lightButton', function(msg){
      if (lightVal<20) {
        playSong( "client/sounds/Predator light sensor - less then 10 lumens.mp3");
      }
      if ((temperatureVal>=20) && (temperatureVal<50)) {
         playSong( "client/sounds/Predator light sensor - more then 20 lumens.mp3"); 
      }
      if ((temperatureVal>=50) && (temperatureVal<75)) {
          playSong( "client/sounds/Predator light sensor - more then 50 lumens.mp3");
      }
      if ((temperatureVal>=75) && (temperatureVal<100)) {
          playSong( "client/sounds/Predator light sensor - more then 75 lumens.mp3");
      }
      if ((temperatureVal>=100) && (temperatureVal<150)) {
          playSong( "client/sounds/Predator light sensor - more then 100 lumens.mp3");
      }
      if ((temperatureVal>=150)) {
          playSong( "client/sounds/Predator light sensor - more then 150 lumens.mp3");
      }      
  });
    
});

//Allow use of files in client folder
app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/client/css'));
app.use(express.static(__dirname + '/client/dist'));
app.use(express.static(__dirname + '/client/js'));
app.use(express.static(__dirname + '/client/pages'));
app.use(express.static(__dirname + '/client/less'));
app.use(express.static(__dirname + '/client/sounds'));
app.use(express.static(__dirname + '/client/bower_components'));
app.use('/client', express.static(__dirname + '/client'));

/*io.sockets.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})*/

http.listen(3000, function () {
    console.log('Web server Active listening on *:3000');
});