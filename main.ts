let processes = {
    "init": false,
    "liftOff": false,
    "land": false,
    "deadlock": false,
    "flight": false,
}

input.onButtonPressed(Button.AB, function () {
    // Initialise
    if (!processes["init"]) {
        processes["init"] = true;
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
    } else {
        // Stabilise
        
        // Run this when ready
        processes["flight"] = true;
    }
    
    if (processes["flight"]) {
        if (!(leftPower <= 0 || rightPower <= 0))
        leftPower -= 10; rightPower -= 10;
    }
})

function setup() {
    radio.setGroup(RADIO_GROUP)
    basic.showLeds(`
        . # # . .
        . # . . .
        . # # # .
        . # . # .
        . # # # .
        `)
    basic.showLeds(`
        . . . . #
        . . . # .
        # . # . .
        . # . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
}

let UP_Servo = 0
let RADIO_GROUP = 6
let HORIZONTAL = 0
RADIO_GROUP = 1
UP_Servo = 90
let DOWN_Servo = -90
let UP_Gyro = -90
let DOWN_Gyro = 90


let leftPower = 60;
let rightPower = 60;

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