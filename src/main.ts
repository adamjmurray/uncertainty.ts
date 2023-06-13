import { gpio, GPIOMode } from "@devicescript/core";
import { pinMode, digitalWrite } from "@devicescript/gpio";
import { startPotentiometer } from "@devicescript/servers";
import { interval } from "@devicescript/observables";


// There doesn't seem to be an ADC analog pin interface, 
// so we configured the CV input as a potentiometer.
// It doesn't matter if the voltage is coming from a pot or a jack.
const cvIn = startPotentiometer({
    pin: gpio(26), 
    // TODO: the scale and offset options probably need to be tuned
    // See test results of input voltage to incoming cv value below
});

const outs = [gpio(27), gpio(28), gpio(29), gpio(0), gpio(3), gpio(4), gpio(2), gpio(1)];
for (const out of outs) {
    await pinMode(out, GPIOMode.Output);
}


// Simple proof-of-concept:
// Send a 1-second long high signal to each gate in order, in a repeating loop
//
// Notes: I doubt the timing is anywhere close to perfect, but maybe DeviceScript
// is a lot better than JavaScript in this regard. It's probably more useful to respond 
// to triggers at the cvIn instead, but setInterval() could work for generative stuff.

let index = 0;
interval(1000).subscribe(async () => {
    for (let i = 0; i < outs.length; i++) {
        let enabled = (i === index);
        await digitalWrite(outs[i], enabled);
    }
    index = (index + 1) % outs.length;
});


// And in the Visual Studio Code console, we can watch the CV input.
// These values are clamped to 0 and 1.
// With my Uncertainty, I see the following (input voltages may not be perfectly accurate):
//
//  -5V -> 0.02  (it reaches 0 at approx -5.8V)
//  -4V -> 0.06
//  -3V -> 0.1
//  -2V -> 0.14
//  -1V -> 0.18
//   0V -> 0.23
//  +1V -> 0.27
//  +2V -> 0.32
//  +3V -> 0.38
//  +4V -> 0.43
//  +5V -> 0.5
//  +6V -> 0.58
//  +7V -> 0.66
//  +8V -> 0.75
//  +9V -> 0.85
// +10V -> 0.94
//
// So roughly:
// -5V to 5V produces 0 - 0.5, with 0V midway at about 0.25 but with some offset.
// Note the range stretches out the higher the input voltage.


// Attempting to calibrate over -5V to +5V based on my measurements (yours might differ)
// Then I fudged things to center 0V
const CV_MIN = -0.05
const CV_MAX = 0.505
const CV_RANGE = CV_MAX - CV_MIN;

// convert to calibrated input range (-1, 1) over -5V to +5V input
function normalize(rawCV: number) {
    const calibrated = (rawCV - CV_MIN)/CV_RANGE;
    const clamped = Math.min(Math.max(calibrated, 0), 1);
    return 2 * clamped - 1;
}


let lastCV = NaN;
cvIn.reading.subscribe(rawCV => {
    // drop some precision to "filter" out noise
    const cv = Math.round(100 * normalize(rawCV))/100;
    if (cv !== lastCV) {
        console.log(`CV in: ${cv}`);
        lastCV = cv;
    }
});
