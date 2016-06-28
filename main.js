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
    var player = new Player(path.join(__dirname, "client/sounds/voice1.mp3"));
} catch(ex) {
    console.log(ex);
}

// play now and callback when playend 
player.play(function(err, player){
    console.log(err);
    try {
        player.stop();
        console.log('playend!');
    } catch(ex) {
        console.log(ex);
    }  
});
player.on('playend', function() {
    console.log("playend");
   player.stop(); 
});
player.on('error', function(err){
  // when error occurs 
  console.log(err);
});

var moveTimeouts = [];


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
    

  /*var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: "A2"
  });

  proximity.on("data", function() {
    console.log("Proximity: ");
    console.log("  cm  : ", this.cm);
    console.log("  in  : ", this.in);
    console.log("-----------------");
  });

  proximity.on("change", function() {
    console.log("The obstruction has moved.");
  });*/

    
    
    var servoX = new five.Servo({
      pin: 5,
      range: [40, 140]
    });
    
    var servoY = new five.Servo({
      pin: 6,
      range: [5, 175]
    });
    var servoXCurrent = 90;
    var servoYCurrent = 0;
    
    servoX.stop();
    servoY.stop();
    
    
  var lcd = new five.LCD({
    controller: "JHD1313M1"
  });

  lcd.bgColor("#00ff00");
  lcd.cursor(0, 0).print("GUN MODE: 0");
    
var temperature = new groveSensor.GroveTemp(3);
var light = new groveSensor.GroveLight(1);
console.log(temperature.name());
console.log(light.name());
var waiting = setInterval(function() {
    
    var celsius = temperature.value();
    //console.log("light", light.value());
    lcd.cursor(1, 0).print(celsius + "C");
    lcd.cursor(1, 4).print(light.value().toString().slice(0,3));
}, 300);
    
  

    
  var button = new five.Button(2);

  // The following will turn the Led
  // on and off as the button is
  // pressed and released.
  button.on("press", function() {
    buzzer.periodicBuzzerActivity(1);
      if (GunMode<2) { //3
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
              servoX.stop();
              servoY.stop();
              servoX.to(90);
              servoY.to(0);
              servoX.stop();
              servoY.stop();
              break;
          case 1: 
              lcd.bgColor("#0000ff");
              servoX.stop();
              servoX.sweep({
                  interval: 3000,
                  //step: 5
              });
              break;
          case 2: 
              lcd.bgColor("#ff0000");
              servoX.stop();
              servoY.stop();
              servoX.to(90);
              servoY.to(0);
              servoXCurrent = 90;
              servoYCurrent = 0;
              break;
          case 3: 
              lcd.bgColor("#ff00ff");
              servoX.stop();
              servoY.stop();
              servoX.to(90);
              servoY.to(0);
              servoXCurrent = 90;
              servoYCurrent = 0;
              break;
          default:
      }
  });
    
process.on('SIGINT', function()
{
  clearInterval(myInterval);
    servoX.to(90);
    servoY.to(90);
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
      if (GunMode === 2) {
      lcd.cursor(1, 12).print(this.y.toString().slice(0,4));      
      lcd.cursor(1, 7).print(this.x.toString().slice(0,4));
      
      if (Math.abs(this.x)>0.3) {
          servoXCurrent += this.x*5;
          if (servoXCurrent>140) {
              servoXCurrent = 140;
          }
          if (servoXCurrent<40) {
              servoXCurrent = 40;
          }
          
          servoX.to(servoXCurrent);
      }
      
      if (Math.abs(this.y)>0.1) {
          servoYCurrent += this.y*5;
          if (servoYCurrent>150) {
              servoYCurrent = 150;
          }
          if (servoYCurrent<10) {
              servoYCurrent = 10;
          }
          servoY.to(servoYCurrent);
      }    
      }
  });
    
  var acceleration = new five.Accelerometer({
    controller: "MMA7660"
  });

  acceleration.on("change", function() {
      if (GunMode === 3) {
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
      }
      
    /*console.log("accelerometer");
    console.log("  x            : ", this.x);
    console.log("  y            : ", this.y);
    console.log("  z            : ", this.z);
      
    console.log("  pitch        : ", this.pitch);
    console.log("  roll         : ", this.roll);
    console.log("  acceleration : ", this.acceleration);
    console.log("  inclination  : ", this.inclination);
    console.log("  orientation  : ", this.orientation);
    //console.log("--------------------------------------");*/
  });
    


    
});


var connectedUsersArray = [];
var userId;

app.get('/', function (req, res) {
    //Join all arguments together and normalize the resulting path.
    res.sendFile(path.join(__dirname + "/client", 'index.html'));
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


http.listen(3000, function () {
    console.log('Web server Active listening on *:3000');
});