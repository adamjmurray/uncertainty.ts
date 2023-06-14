import {gpio, GPIOMode} from "@devicescript/core";
import {pinMode, digitalWrite} from "@devicescript/gpio";
import {startPotentiometer} from "@devicescript/servers";
import {interval, map} from "@devicescript/observables";

// There doesn't seem to be an ADC analog pin interface,
// so we configured the CV input as a potentiometer.
// It doesn't matter if the voltage is coming from a pot or a jack.
const cvIn = startPotentiometer({pin: gpio(26)});

const outs = [27, 28, 29, 0, 3, 4, 2, 1].map(gpio);
for (const out of outs) {
    await pinMode(out, GPIOMode.Output);
}

/* 
Simple proof-of-concept:
Send a 1-second long high signal to each gate in order, in a repeating loop
*/
let index = 0;
interval(1000).subscribe(async () => {
    for (let i = 0; i < outs.length; i++) {
        let enabled = i === index;
        await digitalWrite(outs[i], enabled);
    }
    index = (index + 1) % outs.length;
});

/*
In the Visual Studio Code console, we can log the CV input.
I tried to get the range (-5V, +5V) to map cleanly to (-1, 1).
The raw CV value seems to be curved over the possible input voltage range,
so I used Math.pow() to get (-3V, +3V) behaving as linear as possible.
With the following normalize() function, I get these results on my Uncertainty
module (the values can fluctuate by 0.01 due to noise):

-5V -> -1.07
-4V -> -0.82
-3V -> -0.6
-2V -> -0.4
-1V -> -0.2
 0V -> 0
+1V -> 0.2
+2V -> 0.4
+3V -> 0.61
+4V -> 0.83
+5V -> 1.07
beyond +5V stretches out even more (+10V -> 2.51)

I deem this good enough for my purposes.

It is entirely possible you will need to fine-tune normalize() for your module
for best results, but maybe it will work good enough for most people. 
*/
const normalize = (rawCV: number) => Math.pow(rawCV, 0.75) * 4 - 1.318;

const roundToHundredths = (n: number) => Math.round(100 * n) / 100;

let lastCV = NaN;
cvIn.reading
    .pipe(map(normalize))
    .pipe(map(roundToHundredths))
    .subscribe(cv => {
        if (cv !== lastCV) {
            console.log(`CV in: ${cv}`);
            lastCV = cv;
        }
    });
