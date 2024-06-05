function deadReckon (target: number) {
    heading2 = heading.degrees()
    error = angleBetween(heading2, target)
    datalogger.log(
    datalogger.createCV("target", target),
    datalogger.createCV("heading", heading2),
    datalogger.createCV("error", error)
    )
    if (error > 0) {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, powerMid)
    } else {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Left, powerMid)
    }
    basic.pause(Math.abs(powerMid * degreeTime) + timeMin)
    Kitronik_Move_Motor.stop()
    datalogger.log(
    datalogger.createCV("target", target),
    datalogger.createCV("heading", heading2),
    datalogger.createCV("error", error)
    )
}
function adjustAngle (target: number) {
    heading2 = heading.degrees()
    error = angleBetween(heading2, target)
    while (Math.abs(error) > 1) {
        spin(error)
        Kitronik_Move_Motor.stop()
        heading2 = heading.degrees()
        error = angleBetween(heading2, target)
        datalogger.log(
        datalogger.createCV("target", target),
        datalogger.createCV("heading", heading2),
        datalogger.createCV("error", error)
        )
    }
}
input.onButtonPressed(Button.A, function () {
    powerMid = (powerMin + powerMax) / 2
    Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, powerMid)
    heading.scanClockwise(2000)
    Kitronik_Move_Motor.stop()
    basic.showString("Go?")
    for (let index = 0; index < 3; index++) {
        basic.clearScreen()
        basic.pause(100)
        basic.showArrow(ArrowNames.East)
    }
})
function spin (step: number) {
    if (step > 0) {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, Math.max(powerFactor * step, powerMin))
    } else {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Left, Math.min(powerFactor * step, 0 - powerMin))
    }
    basic.pause(Math.min(timeFactor * Math.abs(step), timeMin))
}
function angleBetween (first: number, second: number) {
    return (540 + second - first) % 360 - 180
}
input.onButtonPressed(Button.B, function () {
    datalogger.deleteLog()
    datalogger.setColumnTitles(
    "target",
    "heading",
    "error"
    )
    datalogger.includeTimestamp(FlashLogTimeStampFormat.Milliseconds)
    result = heading.setNorth()
    basic.showNumber(result)
    if (result == -1 || result == -3) {
        basic.showString("Spin more!")
    } else if (result == -2) {
        basic.showString("Weak field!")
    } else {
        degreeTime = heading.spinTime() / 360
        for (let index = 0; index <= 4; index++) {
            deadReckon(index * 90)
            adjustAngle(index * 90)
            basic.pause(2000)
        }
        basic.pause(5000)
        for (let index = 0; index <= 3; index++) {
            star(index * 2 + 3, 500)
            basic.pause(2000)
        }
    }
})
// tuning parameters to suit your particular buggy
function setup () {
    // lowest power that will actually turn the motors
    powerMin = 30
    // highest reasonable power for motors
    powerMax = 100
    // start-up time to overcome inertial effects
    timeMin = 50
    // power multiplier to apply to turn
    powerFactor = 5
    // time multiplier to apply to turn
    timeFactor = 3
}
function star (points: number, leg: number) {
    turn = 180 - 180 / points
    target = heading.degrees()
    for (let index = 0; index < points; index++) {
        Kitronik_Move_Motor.move(Kitronik_Move_Motor.DriveDirections.Forward, powerMid)
        basic.pause(leg)
        Kitronik_Move_Motor.stop()
        target = (360 + (target + turn)) % 360
        deadReckon(target)
        adjustAngle(target)
    }
}
let target = 0
let turn = 0
let result = 0
let timeFactor = 0
let powerFactor = 0
let powerMax = 0
let powerMin = 0
let timeMin = 0
let degreeTime = 0
let powerMid = 0
let error = 0
let heading2 = 0
setup()
basic.showString("Scan")
for (let index = 0; index < 3; index++) {
    basic.clearScreen()
    basic.pause(100)
    basic.showArrow(ArrowNames.West)
}
