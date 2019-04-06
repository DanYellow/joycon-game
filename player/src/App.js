import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

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

class App extends Component {
    constructor(props) {
        super(props);

        this.socket = null;
        this.gamepadList = {};
        this.raf = null;

        this.state = {
            isControllersConnected: false,
        };

        // this.gamepadHandler = this.gamepadHandler.bind(this);
        this.checkForControllers = this.checkForControllers.bind(this);
        this.captureGamepadListInputs = this.captureGamepadListInputs.bind(
            this
        );
    }

    componentDidMount() {
        this.socket = io('http://localhost:8080');
        this.socket.emit('chat message');

        window.addEventListener(
            'gamepadconnected',
            e => {
                console.log('f', e);
                this.checkForControllers(e, true);
            },
            false
        );
        window.addEventListener(
            'gamepaddisconnected',
            e => {
                this.checkForControllers(e, false);
            },
            false
        );
    }

    // gamepadHandler(event, connecting) {
    //     const gamepad = event.gamepad;
    //     if (connecting) {
    //         this.gamepadList[gamepad.index] = gamepad;
    //     } else {
    //         delete this.gamepadList[gamepad.index];
    //     }

    //     // gamepad.vibrationActuator.playEffect('dual-rumble', {
    //     //     startDelay: 0,
    //     //     duration: 50,
    //     //     weakMagnitude: 1.0,
    //     //     strongMagnitude: 1.0,
    //     // });

    //     requestAnimationFrame(this.captureGamepadListInputs);
    // }

    checkForControllers(event, connecting) {
        const gamepad = event.gamepad;
        const isJoycon = gamepad.id.includes('Joy-Con L+R');

        if (connecting && isJoycon) {
            this.raf = requestAnimationFrame(this.captureGamepadListInputs);
        } else {
            console.log('cancel');
            cancelAnimationFrame(this.raf);
        }
    }

    getInputPressed(gamepad) {
        const allButtons = gamepad.buttons.map((button, index) => {
            return {
                value: button.value,
                index: index,
                button: buttonMapping[index],
            };
        });

        const buttonsPressed = allButtons.filter(button => button.value === 1);

        return buttonsPressed;
    }

    captureGamepadListInputs() {
        let gamepadList = navigator.getGamepads ? navigator.getGamepads() : [];
        gamepadList = Array.from(gamepadList);

        console.log('gamepadList', gamepadList);
        const joyconController = gamepadList
            .filter(x => x)
            .find(gamepad => gamepad.id.includes('Joy-Con L+R'));

        console.log(this.getInputPressed(joyconController));
        requestAnimationFrame(this.captureGamepadListInputs);
    }

    render() {
        return <div className="App" />;
    }
}

export default App;
