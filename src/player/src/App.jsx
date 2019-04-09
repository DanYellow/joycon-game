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

        this.then = null;
        this.elapsed = null;
        this.fpsInterval = null;
        this.startTime = null;
        this.now = null;

        this.lastInputPressed = null;

        this.maxScore = 30;
        this.state = {
            isControllersConnected: false,
            currentPermutation: null,
            turnCount: 1,

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
        this.clearAllInputsCaptured = this.clearAllInputsCaptured.bind(this);
        this.animate = this.animate.bind(this);
        this.startAnimating = this.startAnimating.bind(this);
        this.startTurn = this.startTurn.bind(this);
    }

    componentDidMount() {
        this.socket = io('http://localhost:8080');
        this.socket.emit('chat message');

        this.checkForControllers();

        window.addEventListener(
            'gamepadconnected',
            this.checkForControllers,
            false
        );
        window.addEventListener(
            'gamepaddisconnected',
            this.checkForControllers,
            false
        );
    }

    startAnimating(fps) {
        this.fpsInterval = 1000 / fps;
        this.then = window.performance.now();
        this.startTime = this.then;

        this.animate();
    }

    animate(newtime) {
        // stop
        // if (stop) {
        //     return;
        // }

        // request another frame

        this.raf = requestAnimationFrame(this.animate);

        // calc elapsed time since last loop

        this.now = newtime;
        this.elapsed = this.now - this.then;

        // if enough time has elapsed, draw the next frame

        if (this.elapsed > this.fpsInterval) {
            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            this.then = this.now - (this.elapsed % this.fpsInterval);

            this.captureGamepadListInputs();
        }
    }

    checkForControllers(connecting) {
        let gamepadList = navigator.getGamepads ? navigator.getGamepads() : [];
        gamepadList = Array.from(gamepadList);

        const joyconController = gamepadList
            .filter(x => x)
            .find(gamepad => gamepad.id.includes('Joy-Con L+R'));

        this.setState({
            isControllersConnected: true,
        });

        if (connecting && joyconController) {
            joyconController.vibrationActuator.playEffect('dual-rumble', {
                startDelay: 0,
                duration: 150,
                weakMagnitude: 0.5,
                strongMagnitude: 1.0,
            });

            this.socket.emit('start_host');
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
                pressed: button.pressed,
                index: index,
                button: buttonMapping[index],
                joycon: leftJoyConBtns.includes(index) ? 'LEFT' : 'RIGHT',
            };
        });

        const buttonsPressed = allButtons.filter(button => button.pressed);

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

        if (!joyconController) {
            return false;
        }

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
        }
    }

    startGame() {
        this.socket.emit('ready_to_play');
        this.startAnimating(60);
    }

    startTurn() {
        this.clearAllInputsCaptured();
        this.socket.emit('get_song');
    }

    onMaxScoreReached() {
        console.log('onMaxScoreReached');
    }

    clearAllInputsCaptured(team) {
        cancelAnimationFrame(this.raf);
        this.setState(
            prevState => ({
                inputsCaptured: {
                    ...(team === 'teamA' || !team
                        ? { teamA: [] }
                        : { teamA: prevState.inputsCaptured.teamA }),
                    ...(team === 'teamB' || !team
                        ? { teamB: [] }
                        : { teamB: prevState.inputsCaptured.teamB }),
                },
            }),
            () => {
                setTimeout(() => {
                    requestAnimationFrame(this.animate);
                }, 500);
            }
        );
    }

    serverMessagesHandler() {
        console.log('reggegrergr');
        this.socket.on('get_song', msg => {
            console.log('msg.permutation', msg.permutation);
            this.setState({
                isGameScreen: true,
                isStartScreen: false,
                currentPermutation: msg.permutation,
                songInfo: {
                    src: msg.song,
                    propositions: msg.propositions,
                    loop: msg.loop,
                },
            });
        });

        this.socket.on('start_game', msg => {
            this.setState({
                isControllersConnected: true,
            });
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
                        resetInputCaptured={this.clearAllInputsCaptured}
                        songInfo={songInfo}
                        inputsCaptured={inputsCaptured}
                        handleNewTurn={this.startTurn}
                    />
                )}
            </div>
        );
    }
}

export default App;
