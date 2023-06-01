import { gpio, GPIOMode } from "@devicescript/core"
import { pinMode, digitalWrite } from "@devicescript/gpio"
import { startPotentiometer } from "@devicescript/servers"

// There doesn't seem to be an ADC analog pin interface, 
// so we configured the CV input as a potentiometer.
// It doesn't matter if the voltage is coming from a pot or a jack.
const cvIn = startPotentiometer({
    pin: gpio(26), 
    // TODO: the scale and offset options need to be tuned
})

const outs = [gpio(27), gpio(28), gpio(29), gpio(0), gpio(3), gpio(4), gpio(2), gpio(1)]
for (const out of outs) {
    await pinMode(out, GPIOMode.Output);
}

// Simple proof-of-concept:
// Send a 1-second long high signal to each gate in order, in a repeating loop
//
// Notes: I doubt the timing is anywhere close to perfect, but maybe DeviceScript
// is a lot better than JavaScript in this regard. It's probably more useful to respond 
// to triggers at the cvIn instead, but setInterval() could work for generative stuff.

let index = 0
setInterval(
    async () => {
        for (let i = 0; i < outs.length; i++) {
            let enabled = (i === index)
            await digitalWrite(outs[i], enabled)
        }
        index = (index + 1) % outs.length  
    }, 
    1000
)

// And in the Visual Studio Code console, we can watch the CV input.
// These values are clamped to 0 and 1. With my Uncertainty, I see:
//  -6V -> ~0.0
//   0V -> ~0.226
// +10V -> ~9.44
// which seems oddly skewed. Maybe the potentiometer is not linear. Hmm...
cvIn.reading.subscribe(v => console.log(`CV in: ${v}`))