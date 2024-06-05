// Based on performance during scan, try and spin to the target angle in one go!
function deadReckon (trial: number) {
    heading2 = heading.degrees()
    error = angleBetween(heading2, trial)
    if (error > 0) {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, powerScan)
    } else {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Left, powerScan)
    }
    basic.pause(Math.abs(error * degreeTime) + 100)
    Kitronik_Move_Motor.stop()
}
// Home in gradually on the target angle, taking smaller and smaller steps until heading is close enough.
function adjustAngle (here: number) {
    heading2 = heading.degrees()
    error = angleBetween(heading2, here)
    while (Math.abs(error) > 1) {
        spin(error)
        heading2 = heading.degrees()
        error = angleBetween(heading2, here)
        Kitronik_Move_Motor.stop()
    }
}
input.onButtonPressed(Button.A, function () {
    powerScan = powerMin + (powerMax - powerMin) * 0.25
    Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, powerScan)
    heading.scanClockwise(2000)
    Kitronik_Move_Motor.stop()
    basic.showString("Go?")
    for (let index = 0; index < 3; index++) {
        basic.clearScreen()
        basic.pause(100)
        basic.showArrow(ArrowNames.East)
    }
})
// Spin to right (if amount positive), otherwise to left.
// The power and duration are tuned multiples of amount to suit your particular robot buggy.
// Minimum power and time are enforced, to make sure the motors always actually move!
function spin (amount: number) {
    if (amount > 0) {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, Math.max(powerMin, amount * powerFactor))
    } else {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Left, Math.min(0 - powerMin, amount * powerFactor))
    }
    basic.pause(Math.min(timeMin, Math.abs(amount) * timeFactor))
}
function angleBetween (first: number, second: number) {
    return (540 + second - first) % 360 - 180
}
input.onButtonPressed(Button.B, function () {
    result = heading.setNorth()
    basic.showNumber(result)
    if (result == -1 || result == -3) {
        basic.showString("Spin more!")
    } else if (result == -2) {
        basic.showString("Weak field!")
    } else {
        degreeTime = heading.spinTime() / 360
        basic.showString("D=" + convertToText(degreeTime))
        basic.pause(2000)
        for (let index = 0; index <= 3; index++) {
            target = 90 + index * 90
            basic.showNumber(target)
            basic.pause(500)
            adjustAngle(target)
            basic.pause(2000)
        }
        basic.pause(5000)
        for (let index = 0; index <= 3; index++) {
            target = 90 + index * 90
            basic.showNumber(target)
            basic.pause(500)
            deadReckon(target)
            basic.pause(2000)
        }
    }
})
// tuning parameters to suit your particular buggy
function setup () {
    // lowest power that will actually turn the motors
    powerMin = 30
    // highest reasonable power for motors
    powerMax = 50
    // start-up time to overcome inertial effects
    timeMin = 50
    // power multiplier to apply to turn
    powerFactor = 0.2
    // time multiplier to apply to turn
    timeFactor = 1
}
function star (points: number, leg: number) {
    turn = 180 - 180 / points
    target = heading.degrees()
    for (let index = 0; index < points; index++) {
        Kitronik_Move_Motor.move(Kitronik_Move_Motor.DriveDirections.Forward, powerScan)
        basic.pause(leg)
        Kitronik_Move_Motor.stop()
        target = (360 + (target + turn)) % 360
        deadReckon(target)
        adjustAngle(target)
    }
}
let turn = 0
let target = 0
let result = 0
let timeFactor = 0
let timeMin = 0
let powerFactor = 0
let powerMax = 0
let powerMin = 0
let degreeTime = 0
let powerScan = 0
let error = 0
let heading2 = 0
setup()
basic.showString("Scan")
for (let index = 0; index < 3; index++) {
    basic.clearScreen()
    basic.pause(100)
    basic.showArrow(ArrowNames.West)
}
