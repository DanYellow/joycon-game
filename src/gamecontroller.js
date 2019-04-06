const buttonMapping = {
    0: 'B',
    1: 'A',
    2: 'Y',
    3: 'X',
    12: 'D_UP',
    13: 'D_DOWN',
    14: 'D_LEFT',
    15: 'D_RIGHT',
};

const textDiv = document.getElementById('opil');

function updateStatus() {
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gamepadArray = [];
    for (let i = 0; i < gamepads.length; i++) {
        gamepadArray.push(gamepads[i]);
    }

    let orderedGamepads = [];
    orderedGamepads.push(
        gamepadArray.find(gamepad => {
            if (gamepad && gamepad.id.includes('Joy-Con L+R')) {
                const allButtons = gamepad.buttons.map((button, index) => {
                    // console.log('f', index, button)
                    return {
                        value: button.value,
                        index: index,
                    };
                });

                const buttonsPressed = allButtons.filter(
                    button => button.value === 1
                );
                //   console.log('buttonsPressed', buttonsPressed)
                textDiv.innerText = buttonsPressed.map(button => {
                    return buttonMapping[button.index];
                });
            }
        })
    );

    requestAnimationFrame(updateStatus);
}

var gamepads = {};

function gamepadHandler(event, connecting) {
    var gamepad = event.gamepad;
    console.log('fzadaz', event);
    // Note:
    // gamepad === navigator.getGamepads()[gamepad.index]

    if (connecting) {
        gamepads[gamepad.index] = gamepad;
    } else {
        delete gamepads[gamepad.index];
    }

    requestAnimationFrame(updateStatus);
}

window.addEventListener(
    'gamepadconnected',
    function(e) {
        gamepadHandler(e, true);
    },
    false
);
window.addEventListener(
    'gamepaddisconnected',
    function(e) {
        gamepadHandler(e, false);
    },
    false
);
