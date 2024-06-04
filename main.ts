function face (target: number) {
    heading2 = heading.degrees()
    error = angle_between(heading2, target)
    while (Math.abs(error) > 2) {
        datalogger.log(
        datalogger.createCV("target", target),
        datalogger.createCV("heading", heading2),
        datalogger.createCV("error", error)
        )
        spinRight(error)
        heading2 = heading.degrees()
        error = angle_between(heading2, target)
    }
}
function angle_between (first: number, second: number) {
    return (540 + second - first) % 360 - 180
}
input.onButtonPressed(Button.A, function () {
    Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, 2 * powerMin)
    heading.scanClockwise(2000)
    Kitronik_Move_Motor.stop()
    basic.showString("Go?")
    for (let index = 0; index < 3; index++) {
        basic.clearScreen()
        basic.pause(100)
        basic.showArrow(ArrowNames.East)
    }
})
input.onButtonPressed(Button.B, function () {
    result = heading.setNorth()
    basic.showNumber(result)
    if (result == -1 || result == -3) {
        basic.showString("Spin more!")
    } else if (result == -2) {
        basic.showString("Weak field!")
    } else {
        for (let index = 0; index <= 4; index++) {
            star(index + 3, 500)
            basic.pause(2000)
        }
    }
})
function spinRight (step: number) {
    if (step > 0) {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Right, Math.max(powerFactor * step, powerMin))
    } else {
        Kitronik_Move_Motor.spin(Kitronik_Move_Motor.SpinDirections.Left, Math.min(powerFactor * step, 0 - powerMin))
    }
    basic.pause(Math.min(timeFactor * Math.abs(step), timeMin))
    Kitronik_Move_Motor.stop()
}
function star (points: number, leg: number) {
    turn = 180 - 180 / points
    target = heading.degrees()
    for (let index = 0; index < points; index++) {
        Kitronik_Move_Motor.move(Kitronik_Move_Motor.DriveDirections.Forward, 3 * powerMin)
        basic.pause(leg)
        Kitronik_Move_Motor.stop()
        target = (360 + (target + turn)) % 360
        face(target)
    }
}
let target = 0
let turn = 0
let result = 0
let error = 0
let heading2 = 0
let timeMin = 0
let powerMin = 0
let timeFactor = 0
let powerFactor = 0
powerFactor = 5
timeFactor = 3
powerMin = 30
timeMin = 50
basic.showString("Scan")
for (let index = 0; index < 3; index++) {
    basic.clearScreen()
    basic.pause(100)
    basic.showArrow(ArrowNames.West)
}
