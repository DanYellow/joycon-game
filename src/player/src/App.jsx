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
    18: 'L_SL',
    19: 'L_SR',
    20: 'R_SL',
    21: 'R_SR',
    12: 'D_UP',
    13: 'D_DOWN',
    14: 'D_LEFT',
    15: 'D_RIGHT',
};

const leftJoyConBtns = [12, 13, 14, 15, 18, 19];

// Indexes : joy-con r
// Values : joy-con Z
const joyconMapping = {
    0: 13,
    1: 15,
    2: 14,
    3: 12,
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
            hasEnterRightPermutation: false,
            showGameScreen: false,
            inputsCaptured: {
                teamA: [],
                teamB: [],
            },
        };

        this.startGame = this.startGame.bind(this);
        this.onMaxScoreReached = this.onMaxScoreReached.bind(this);
        this.checkForControllers = this.checkForControllers.bind(this);
        this.captureGamepadListInputs = this.captureGamepadListInputs.bind(
            this
        );
        this.serverMessagesHandler = this.serverMessagesHandler.bind(this);
        this.onPermutationTriggered = this.onPermutationTriggered.bind(this);
        this.clearAllInputsCaptured = this.clearAllInputsCaptured.bind(this);
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
            this.setState({
                isControllersConnected: true,
            });
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
                joycon: leftJoyConBtns.includes(index) ? 'LEFT' : 'RIGHT',
            };
        });

        const buttonsPressed = allButtons.filter(button => button.value === 1);

        return buttonsPressed;
    }

    isReinitCapture(inputList) {
        const isSameJoyCon = inputList.every(
            (input, _, arr) => input.joycon === arr[0].joycon
        );

        if (isSameJoyCon) {
            return inputList.every(input => {
                return (
                    input.index === 18 ||
                    input.index === 19 ||
                    input.index === 20 ||
                    input.index === 21
                );
            });
        }

        return false;
    }

    captureGamepadListInputs() {
        let gamepadList = navigator.getGamepads ? navigator.getGamepads() : [];
        gamepadList = Array.from(gamepadList);

        const joyconController = gamepadList
            .filter(x => x)
            .find(gamepad => gamepad.id.includes('Joy-Con L+R'));

        const inputListPressed = this.getInputPressed(joyconController);

        if (inputListPressed.length) {
            let isReinitCapture = false;
            let joyConReset = null;
            if (inputListPressed.length === 2) {
                isReinitCapture = this.isReinitCapture(inputListPressed);
                joyConReset = inputListPressed[0].joycon;
            }

            const isLeftJoyConReset = isReinitCapture && joyConReset === 'LEFT';
            const isRightJoyConReset =
                isReinitCapture && joyConReset === 'RIGHT';
            const inputListCapturable = Object.entries(joyconMapping)
                .flat()
                .map(input => Number(input));

            this.setState(prevState => {
                return {
                    ...prevState,
                    inputsCaptured: {
                        ...(isLeftJoyConReset
                            ? { teamA: [] }
                            : {
                                  teamA: Array.from(
                                      new Set([
                                          ...prevState.inputsCaptured.teamA,
                                          ...inputListPressed
                                              .filter(
                                                  input =>
                                                      input.joycon === 'LEFT' &&
                                                      inputListCapturable.includes(
                                                          input.index
                                                      )
                                              )
                                              .map(input => input.index),
                                      ])
                                  ),
                              }),
                        ...(isRightJoyConReset
                            ? { teamB: [] }
                            : {
                                  teamB: Array.from(
                                      new Set([
                                          ...prevState.inputsCaptured.teamB,
                                          ...inputListPressed
                                              .filter(
                                                  input =>
                                                      input.joycon ===
                                                          'RIGHT' &&
                                                      inputListCapturable.includes(
                                                          input.index
                                                      )
                                              )
                                              .map(input => input.index),
                                      ])
                                  ),
                              }),
                    },
                };
            });
            // console.log(this.getInputPressed(joyconController));
        }

        requestAnimationFrame(this.captureGamepadListInputs);
    }

    startGame() {
        this.socket.emit('ready_to_play');
        this.raf = requestAnimationFrame(this.captureGamepadListInputs);
    }

    onMaxScoreReached() {
        console.log('onMaxScoreReached');
    }

    clearAllInputsCaptured() {
        this.setState({
            inputsCaptured: {
                teamA: [],
                teamB: [],
            },
        });
    }

    onPermutationTriggered() {
        this.setState({
            inputsCaptured: {
                teamA: [],
                teamB: [],
            },
        });
    }

    serverMessagesHandler() {
        this.socket.on('generate_permutation', msg => {
            this.setState({
                isGameScreen: true,
                isStartScreen: false,
                currentPermutation: msg.permutation,
                songInfo: {
                    src: msg.song,
                    choices: msg.choices,
                    loop: msg.loop,
                },
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
            songInfo,
            inputsCaptured,
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
                        handlePermutationTriggered={this.onPermutationTriggered}
                        songInfo={songInfo}
                        inputsCaptured={inputsCaptured}
                    />
                )}
            </div>
        );
    }
}

export default App;
