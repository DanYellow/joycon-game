import React, { Component } from 'react';
import io from 'socket.io-client';

import StartScreen from './screens/start';
import GameScreen from './screens/game';

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
        this.raf = null;

        this.maxScore = 30;
        this.state = {
            isControllersConnected: false,
            currentPermutation: null,
            turnCount: 1,
            scores: {
                teamA: 0,
                teamB: 0,
            },
            isStartScreen: true,
            isGameScreen: false,
            isResultScreen: false,

            showGameScreen: false,
        };

        this.startGame = this.startGame.bind(this);
        this.onMaxScoreReached = this.onMaxScoreReached.bind(this);
        this.checkForControllers = this.checkForControllers.bind(this);
        this.captureGamepadListInputs = this.captureGamepadListInputs.bind(
            this
        );
        this.serverMessagesHandler = this.serverMessagesHandler.bind(this);
    }

    componentDidMount() {
        this.socket = io('http://localhost:8080');
        this.socket.emit('chat message');

        window.addEventListener(
            'gamepadconnected',
            e => {
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

    checkForControllers(event, connecting) {
        const gamepad = event.gamepad;
        const isJoycon = gamepad.id.includes('Joy-Con L+R');

        if (connecting && isJoycon) {
            gamepad.vibrationActuator.playEffect('dual-rumble', {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.5,
                strongMagnitude: 1.0,
            });
            this.serverMessagesHandler();
            this.setState(
                {
                    isControllersConnected: true,
                },
                () => {
                    this.raf = requestAnimationFrame(
                        this.captureGamepadListInputs
                    );
                }
            );
        } else {
            this.setState(
                {
                    isControllersConnected: false,
                },
                () => {
                    cancelAnimationFrame(this.raf);
                }
            );
            console.log('cancel');
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

        const joyconController = gamepadList
            .filter(x => x)
            .find(gamepad => gamepad.id.includes('Joy-Con L+R'));

        // console.log(this.getInputPressed(joyconController));
        requestAnimationFrame(this.captureGamepadListInputs);
    }

    startGame() {
        this.socket.emit('ready_to_play');
    }

    onMaxScoreReached() {
        console.log('onMaxScoreReached');
    }

    serverMessagesHandler() {
        this.socket.on('generate_permutation', msg => {
            this.setState({
                isGameScreen: true,
                isStartScreen: false,
                currentPermutation: msg.permutation,
            });
            console.log('msg', msg);
        });
    }

    render() {
        const {
            isControllersConnected,
            isGameScreen,
            isStartScreen,
            currentPermutation,
        } = this.state;

        return (
            <div className="MainScene">
                {isStartScreen && (
                    <StartScreen
                        isControllersConnected={isControllersConnected}
                        handleClick={this.startGame}
                    />
                )}

                {isGameScreen && (
                    <GameScreen
                        permutation={currentPermutation}
                        handleMaxScoreReached={this.onMaxScoreReached}
                    />
                )}
            </div>
        );
    }
}

export default App;
