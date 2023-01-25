const noteFreq = {
    C : [16.05, 32.11, 64.22 , 128.43, 256.87, 513.74, 1027.47, 2054.95, 4109.90],
    Db: [17.01, 34.02, 68.04 , 136.07, 272.14, 544.29, 1088.57, 2177.14, 4354.29],
    D : [18.02, 36.04, 72.08 , 144.16, 288.33, 576.65, 1153.30, 2306.60, 4613.21],
    Eb: [19.09, 38.18, 76.37 , 152.74, 305.47, 610.94, 1221.88, 2443.76, 4887.52],
    E : [20.23, 40.45, 80.91 , 161.82, 323.63, 647.27, 1294.54, 2589.07, 5178.15],
    F : [21.43, 42.86, 85.72 , 171.44, 342.88, 685.76, 1371.51, 2743.03, 5486.06],
    Gb: [22.70, 45.41, 90.82 , 181.63, 363.27, 726.53, 1453.07, 2906.14, 5812.28],
    G : [24.05, 48.11, 96.22 , 192.43, 384.87, 769.74, 1539.47, 3078.95, 6157.89],
    Ab: [25.48, 50.97, 101.94, 203.88, 407.75, 815.51, 1631.01, 3262.03, 6524.06],
    A : [27.00, 54.00, 108.00, 216.00, 432.00, 864.00, 1728.00, 3456.00, 6912.00],
    Bb: [28.61, 57.21, 114.42, 228.84, 457.69, 915.38, 1830.75, 3661.50, 7323.01],
    B : [30.31, 60.61, 121.23, 242.45, 484.90, 969.81, 1939.61, 3879.23, 7758.46],
}

var oscillatorOptions = [
    {
    type: "sine",
    frequency: {note: "A", octave: 4},
    detune: 0
    },
    {
    type: "sine",
    frequency: {note: "A", octave: 4},
    detune: 0
    },
    {
    type: "sine",
    frequency: {note: "A", octave: 4},
    detune: 0
    }
]

var filterOptions = [
    {
    type: "lowpass",
    frequency: 20000,
    Q: 0.5,
    gain: 1
    },
    {
    type: "lowpass",
    frequency: 20000,
    Q: 0.5,
    gain: 1
    },
    {
    type: "lowpass",
    frequency: 20000,
    Q: 0.5,
    gain: 1
    }
]

var gainOptions = [
    {
    gain: 0.5
    },
    {
    gain: 0.5
    },
    {
    gain: 0.5
    }
]






function init() {

    initView();

    ctx = new AudioContext();
    
    for (var i = 0; i < 3; i++) {
    osc.push(ctx.createOscillator());
    updateOscillatorWithOptions(i);
    osc[i].start();

    filter.push(ctx.createBiquadFilter());
    updateFilterWithOptions(i);

    osc[i].connect(filter[i]);

    gain.push(ctx.createGain())
    updateGainWithOptions(i)

    filter[i].connect(gain[i]);

    }
}

function initView() {
    $("#btninitialize").toggleClass("hidden");
    $("#maincontainer").toggleClass("hidden");
}

function setOscillatorType(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    oscillatorOptions[index]['type'] = selectedObject.value;
    updateOscillatorWithOptions(index);
}

function setOscillatorFrequencyNote(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    oscillatorOptions[index]['frequency']['note'] = selectedObject.value;
    updateOscillatorWithOptions(index);
}

function setOscillatorFrequencyOctave(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    oscillatorOptions[index]['frequency']['octave'] = parseInt(selectedObject.value);
    updateOscillatorWithOptions(index);
}

function setOscillatorDetune(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    oscillatorOptions[index]['detune'] = selectedObject.value;
    updateOscillatorWithOptions(index);
}

function updateOscillatorWithOptions(index) {
    osc[index].type = oscillatorOptions[index]['type'];
    osc[index].frequency
        .setValueAtTime(
            noteFreq[oscillatorOptions[index]['frequency']['note']][oscillatorOptions[index]['frequency']['octave']],
            ctx.currentTime);
    osc[index].detune.setValueAtTime(oscillatorOptions[index]['detune'], ctx.currentTime);
}

function setFilterType(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    filterOptions[index]["type"] = selectedObject.value;
    updateFilterWithOptions(index);
}

function setFilterFrequency(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    filterOptions[index]["frequency"] = selectedObject.value;
    updateFilterWithOptions(index);
}

function setFilterQ(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    filterOptions[index]["Q"] = selectedObject.value;
    updateFilterWithOptions(index);
}

function setFilterGain(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    filterOptions[index]["gain"] = selectedObject.value;
    updateFilterWithOptions(index);
}


function updateFilterWithOptions(index) {
    filter[index].type = filterOptions[index]["type"];
    filter[index].frequency.setValueAtTime(filterOptions[index]['frequency'], ctx.currentTime);
    filter[index].Q.setValueAtTime(filterOptions[index]['Q'], ctx.currentTime);
    filter[index].gain.setValueAtTime(filterOptions[index]['gain'], ctx.currentTime);
}

function setGain(selectedObject) {
    const index = getNodeIndex(selectedObject.id);
    gainOptions[index]["gain"] = selectedObject.value;
    updateGainWithOptions(index);
}


function updateGainWithOptions(index) {
    gain[index].gain.setValueAtTime(gainOptions[index]["gain"], ctx.currentTime);
}


function getNodeIndex(objectID) {
    return parseInt(objectID.split("-")[1]);
}

function generateSound() {
    gain.forEach(g => {
        g.connect(ctx.destination);
    });
}

function stopSound() {
    gain.forEach(g => {
        g.disconnect(ctx.destination);
    });
}

var ctx;
var osc = [];
var filter = [];
var gain = [];