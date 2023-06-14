# TypeScript for Uncertainty

This is an _experimental_ project to run TypeScript on the [Uncertainty Eurorack
module](https://oamodular.org/products/uncertainty) using Microsoft's
[DeviceScript](https://microsoft.github.io/devicescript/) platform.

This repository has a working proof-of-concept you can try. At the time of
writing, DeviceScript is still a "technical preview" release. My code probably
has bugs too.

## Files of interest

-   `src/main.ts`: firmware entry point
-   `boards/uncertainty.board.json`: hardware configuration

## Local development setup

-   Install Visual Studio Code
-   Install the [DeviceScript
    extension](https://microsoft.github.io/devicescript/getting-started/vscode)
    for Visual Studio Code
-   Install Node.js 18+
-   Install dependencies. In this folder, run:

```bash
npm install
```

-   Flash the DeviceScript runtime
    -   With Uncertainty unpowered, hold down the boot button and plug into your
        computer with USB
    -   Then run:

```bash
npx devicescript flash --board uncertainty
```

Note: Once the devicescript runtime is flashed, you don't need to hold the boot
button when powering on. Just connect with USB and you're good to go.

### Running the firmware

-   Open the project folder in Visual Studio Code

```bash
code .
```

-   From the left panel, open the DeviceScript pane

-   Click "Connect Device"

    -   A dropdown appears. Select "Serial"
    -   Assuming Uncertainty is still connected to the computer via USB and had
        the DeviceScript runtime flashed onto it, it should appear in a Devices
        pane (with some cryptic name like "VT28")

-   Open `src/main.ts` (this script has lots of comments explaining what it
    does, so take a read through it)

-   In the code editor pane, a play button should appear up top by the file
    tabs. Click it to build and run the firmware. To the right is a little drop
    down where you can switch between running with and without the debugger.

-   After making changes to the code, click the run button again. Sometimes it
    doesn't work and I have to ctrl+C the terminal, and then reconnect to the
    device. Maybe you're supposed to stop it in one of the side panels first.

### Running from the command line / running other firmware files

With Uncertainty connected over USB, you can use a different file as its
firmware with:

```bash
npx devs devtools --logging --serial src/alt-firmware.ts
```

This probably won't work at first. The DeviceScript plugin for VS Code often
automatically connects to the device. You should see two terminals are actually
open off to the side. Kill the one called DeviceScript. Then the above command
should work in your main terminal.

If you're lucky, saving changes to your firmware file may auto-reload the
hardware. Or hit Ctrl+C to detach the logger connection, then rerun to load your
latest code changes onto the hardware.

Note, when rerunning this command, it sometimes prints out logs from the
previous version of the firmware for a moment. If you look closer, there's
build, deploy, and init steps happening, so ignore any logs you see before that.

Also note, if you're logging, sometimes build errors fly by and it attaches the
console to the logger from the last successful firmware build. So if it seems
like your code changes are not being picked up, that might be why. Try `npx devs
build` on your firmware file to see if there are build errors.

## Changing the board config

After editing boards/uncertainty.board.json, you need to re-flash the firmware.
See the "Flash the DeviceScript runtime" instructions above (power on into boot
mode, run the `devicescript flash` command).
