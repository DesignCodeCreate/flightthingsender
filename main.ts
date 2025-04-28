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

input.onButtonPressed(Button.B, function () {
    // Lift off
    if (!processes["liftOff"]) {
        processes["liftOff"] = true;
        radio.sendNumber(2);
    }
})

input.onButtonPressed(Button.A, function () {
    // Stabilise and fly

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


basic.forever(function () {
    serial.writeLine("" + ((input.rotation(Rotation.Pitch)).toString()))
})