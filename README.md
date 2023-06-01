# DeviceScript for Uncertainty

This _experimental_ project uses the [DeviceScript](https://microsoft.github.io/devicescript/)
platform to develop firmware for the [Uncertainty Eurorack module](https://oamodular.org/products/uncertainty)
by Olivia Artz Modular.

I haven't bricked my device, but use at your own risk!

## Files of interest

-   `src/main.ts`: firmware entry point
-   `boards/uncertainty.board.json`: hardware configuration

## Local development setup

-   Install Visual Studio Code
-   Install the [DeviceScript extension](https://microsoft.github.io/devicescript/getting-started/vscode) for Visual Studio Code
-   Install Node.js 18+
-   Install dependencies. In this folder, run:

```bash
npm install
```

-   Flash the DeviceScript runtime
    -   With Uncertainty unpowered, hold down the boot button and plug into your computer with USB
    -   Then run:

```bash
npx devicescript flash --board uncertainty
```

Note: Once the devicescript runtime is flashed, you don't need to hold the boot button when powering on. Just connect with USB and you're good to go.

### Running the firmware

-   Open the project folder in Visual Studio Code

```bash
code .
```

-   From the left panel, open the DeviceScript pane

-   Click "Connect Device"

    -   A dropdown appears. Select "Serial"
    -   Assuming Uncertainty is still connected to the computer via USB and had the DeviceScript runtime flashed onto it, it should appear in a Devices pane (with some cryptic name like "VT28")

-   Open `src/main.ts`

-   In the code editor pane, a play button should appear up top by the file tabs.
    Click it to build and run the firmware. To the right is a little drop down where
    you can switch between running with and without the debugger.

-   After making changes to the code, click the run button again. Sometimes it doesn't work and I have to ctrl+C the terminal, and then reconnect to the device. Maybe you're supposed to stop it in one of the side panels first.