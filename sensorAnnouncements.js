// Pure selection only: no hardware, audio, network or timers are initialized here.
// Keep the existing sound assets and light threshold boundaries.
exports.lightSound = function (light) {
    if (typeof light !== 'number' || !isFinite(light)) return null;
    var label;
    if (light < 20) label = 'less then 10';
    else if (light < 50) label = 'more then 20';
    else if (light < 75) label = 'more then 50';
    else if (light < 100) label = 'more then 75';
    else if (light < 150) label = 'more then 100';
    else label = 'more then 150';
    return 'client/sounds/Predator light sensor - ' + label + ' lumens.mp3';
};
