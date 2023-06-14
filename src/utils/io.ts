import {gpio} from "@devicescript/core";
import {startPotentiometer} from "@devicescript/servers";

// There doesn't seem to be an ADC analog pin interface,
// so we configured the CV input as a potentiometer.
// It doesn't matter if the voltage is coming from a pot or a jack.
export const cvIn = startPotentiometer({pin: gpio(26)});

export const outs = [27, 28, 29, 0, 3, 4, 2, 1].map(gpio);

// Useful for making for...of loops where you need to await
// DeviceScript doesn't seem to want you to await inside forEach() loops.
export const outIndexes = outs.map((_, index) => index);
/*
I guess this isn't actually necessary. Maybe it's the default.
for (const out of outs) {
    await pinMode(out, GPIOMode.Output);
}
*/
