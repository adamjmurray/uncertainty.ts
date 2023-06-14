import {map} from "@devicescript/observables";
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

// Unlike in main.ts, we wrap this in map so it can be passed directly to pipe()
export const calibrate = map(
    (rawCV: number) => Math.pow(rawCV, 0.75) * 4 - 1.318
);
