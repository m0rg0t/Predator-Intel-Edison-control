'use strict';
// Read only the lightButton callback: never import or execute main.js initialization.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');
const start = source.indexOf("socket.on('lightButton', function(msg){");
assert.notEqual(start, -1, 'lightButton handler remains present');
const end = source.indexOf('\n  });', start);
assert.notEqual(end, -1, 'handler terminator remains present');
const callback = source.slice(start, end + '\n  });'.length);
const helperPath = path.join(__dirname, '..', 'sensorAnnouncements.js');
const sensorAnnouncements = fs.existsSync(helperPath) ? require(helperPath) : {};
const fixtures = [
  [-1, 'less then 10'], [0, 'less then 10'], [19.99, 'less then 10'],
  [20, 'more then 20'], [49.99, 'more then 20'],
  [50, 'more then 50'], [74.99, 'more then 50'],
  [75, 'more then 75'], [99.99, 'more then 75'],
  [100, 'more then 100'], [149.99, 'more then 100'], [150, 'more then 150'], [200, 'more then 150']
];
let checks = 0;
for (const [lightVal, label] of fixtures) {
  for (const temperatureVal of [0, 24, 65, 125, 200]) {
    const played = [];
    const context = { lightVal, temperatureVal, sensorAnnouncements,
      playSong: sound => played.push(sound),
      socket: { on: (event, handler) => { assert.equal(event, 'lightButton'); handler({}); } }
    };
    vm.runInNewContext(callback, context, {timeout: 1000});
    assert.deepEqual(played, ['client/sounds/Predator light sensor - ' + label + ' lumens.mp3'],
      'one light announcement at light=' + lightVal + ', temperature=' + temperatureVal);
    checks++;
  }
}
console.log('PASS ' + checks + ' inert light/temperature boundary combinations');

for (const value of [NaN, Infinity, -Infinity, null, undefined, '20', {}]) {
  assert.equal(sensorAnnouncements.lightSound(value), null, 'invalid light does not select audio');
}
console.log('PASS 7 invalid sensor inputs');
