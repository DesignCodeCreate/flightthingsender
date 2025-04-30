let processes = {
    "init": false,
    "liftOff": false,
    "land": false,
    "deadlock": false,
    "flight": false,
}

// Radio Logic
radio.onReceivedNumber(function (receivedNumber) {
    serial.writeLine(receivedNumber.toString());
    switch (receivedNumber) {
        case 0: {
            stabiliseDone = true;
            if (processes["liftOff"] && !processes["flight"]) {
                processes["flight"] = true;
                radio.sendNumber(6);
                showDebugLeds(3);
            }
            break;
        }
    }
})

input.onButtonPressed(Button.AB, function () {
    // Initialise
    if (!processes["init"]) {
        processes["init"] = true;
        radio.setGroup(RADIO_GROUP);
        showDebugLeds(0);
        radio.sendNumber(1);
    } else {
        processes["deadlock"] = true;
        radio.sendNumber(4);
    }
})

input.onButtonPressed(Button.A, function () {
    if (processes["flight"]) {
        if (!(leftPower >= 100 || rightPower >= 100)) {
            leftPower += 10; rightPower += 10;
        }
    }
})

input.onButtonPressed(Button.B, function () {
    // Lift off
    if (!processes["liftOff"]) {
        processes["liftOff"] = true;
        radio.sendNumber(2);
        showDebugLeds(1);
    } else {
        if (!processes["flight"]) {
            // Stabilise
            radio.sendNumber(5);

            processes["flight"] = true;
            radio.sendNumber(6);
            showDebugLeds(3);
        }

    }
    
    if (processes["flight"]) {
        if (!(leftPower <= 0 || rightPower <= 0)) {
            leftPower -= 10; rightPower -= 10;
        }
    }
})


let UP_Servo = 0
let RADIO_GROUP = 6
let HORIZONTAL = 0
UP_Servo = 90
let DOWN_Servo = -90
let UP_Gyro = -90
let DOWN_Gyro = 90
let stabiliseDone = false;

let leftPower = 60;
let rightPower = 60;

function setup() {
    radio.setGroup(RADIO_GROUP);
}

basic.forever(function () {
    if (processes["flight"]) {
        let pitch = input.rotation(Rotation.Pitch);
        let pitchStr = "0#" + pitch.toString();
        radio.sendString(pitchStr);

        let roll = input.rotation(Rotation.Roll);
        let rollStr = "1#" + pitch.toString();
        radio.sendString(rollStr);
    }

    let leftPowerStr = "2#" + leftPower;
    radio.sendString(leftPowerStr);

    let rightPowerStr = "3#" + rightPower;
    radio.sendString(rightPowerStr);
})


function showDebugLeds(code: number) {
    switch (code) {
        // Initialisation
        case 0: {
        basic.showNumber(6);
        
        basic.showLeds(`
            . . . . #
            . . . # .
            # . # . .
            . # . . .
            . . . . .
        `)

        basic.clearScreen();

        }; break;

        // Liftoff
        case 1: {
            basic.showArrow(ArrowNames.North)
            basic.clearScreen();
        }; break;

        // Stabilisation
        case 2: {
            basic.showString("Stable");
            basic.clearScreen();
        }; break;

        // Flight Pattern

        case 3: {
            basic.showArrow(ArrowNames.East);
            basic.clearScreen();
        }; break;
    }
}