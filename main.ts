let processes = {
    "init": false,
    "liftOff": false,
    "land": false,
    "deadlock": false,
    "flight": false,
}

// Radio Logic
radio.onReceivedNumber(function (receivedNumber) {
    switch (receivedNumber) {
        case 0: {
            stabiliseDone = true;
            if (processes["liftOff"] && !processes["flight"]) {
                showDebugLeds(3);
                processes["flight"] = true;
                radio.sendNumber(6);
                showTick();
            }
            break;
        }
    }
})

input.onButtonPressed(Button.AB, function () {
    // Initialise
    if (!processes["init"]) {
        showDebugLeds(0);
        processes["init"] = true;
        radio.sendNumber(1);
        showTick();
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
        showDebugLeds(1);
        processes["liftOff"] = true;
        radio.sendNumber(2);
        showTick();
    } else {
        if (!processes["flight"]) {
            // Stabilise
            showDebugLeds(3);
            radio.sendNumber(5);

            processes["flight"] = true;
            radio.sendNumber(6);
            showTick();
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
        radio.sendValue("pitch", input.rotation(Rotation.Pitch));
        radio.sendValue("roll", input.rotation(Rotation.Roll));
    }
  
}) 


function showDebugLeds(code: number) {
    switch (code) {
        // Init
        case 0: {
            basic.showNumber(6);
        }; break;

        // liftOff
        case 1: {
            basic.showArrow(ArrowNames.North);
            basic.clearScreen();
        }; break;

        // stabilisation
        case 2: {
            basic.showIcon(IconNames.Pitchfork);
            basic.clearScreen();
        }; break;

        // Flight pattern
        case 3: {
            basic.showArrow(ArrowNames.East);
            basic.clearScreen();
        }; break;

        // Land
        case 4: {
            basic.showArrow(ArrowNames.South);
            basic.clearScreen();
        }; break;

        // Deadlock
        case 5: {
            basic.showIcon(IconNames.Skull);
            basic.clearScreen();
        }; break;
    }
}

function showTick() {
    basic.showLeds(`
        . . . . #
        . . . # .
        # . # . .
        . # . . .
        . . . . .
    `);
    basic.clearScreen();
}