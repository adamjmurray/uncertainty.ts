import {digitalWrite} from "@devicescript/gpio";
import {calibrate} from "./utils/calibration";
import {cvIn, outs, outIndexes} from "./utils/io";

/* 
Alternate firmware. See README for how to run.
This one controls the high gate from the cv input.

It reveals a problem. The subscribe() callback rate is not very
high by default and not suitable for realtime audio work. 
Further investigation is required.
*/
cvIn.reading.pipe(calibrate).subscribe(async cv => {
    const clampedUnipolarCV = Math.min(Math.max(Math.abs(cv), 0), 1);
    const activeGate = Math.round(clampedUnipolarCV * (outs.length - 1));

    console.log({cv, activeGate});

    for (const index of outIndexes) {
        await digitalWrite(outs[index], index === activeGate);
    }
});
