import React, { Component, Fragment } from 'react';

import io from 'socket.io-client';

import ChoicesScreen from './choices';
import TeamTurn from './team-turn';
import ResultScreen from './results';

import PermutationIndicator from './permutation-indicator';

import './game.css';

const ScoreHUD = props => {
    const { scores } = props;
    return (
        <div className="score-hud">
            <ul>
                <li className="teamA">{scores.teamA} </li>
                <li className="maxScore">
                    {/* <p>Score à atteindre</p>
                    <p>30</p> */}
                </li>
                <li className="teamB">{scores.teamB}</li>
            </ul>
        </div>
    );
};

// Indexes : joy-con R
// Values : joy-con L
const joyconMapping = {
    13: 0,
    15: 1,
    14: 2,
    12: 3,
};

class GameScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showInputSequence: true,
            showAudioPlayer: false,
            showResults: false,
            showChoices: false,
            showSelectNbChoices: false,
            teamTurn: null,
            nbChoices: null,
            choice: null,

            scores: {
                teamA: 0,
                teamB: 0,
            },
        };

        this.resultsMapping = [[3, 12], [1, 15], [0, 13], [2, 14]];

        this.deltaInputCapture = null;
        this.showAudioPlayer = this.showAudioPlayer.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.reinitTurn = this.reinitTurn.bind(this);
        this.checkTeamInputListCaptured = this.checkTeamInputListCaptured.bind(
            this
        );
    }

    componentDidMount() {
        this.raf = requestAnimationFrame(this.checkTeamInputListCaptured);
        const { resetInputCaptured } = this.props;

        this.socket = io('http://localhost:8080');

        this.socket
            .on('reload_turn', msg => {
                this.setState({
                    showInputSequence: true,
                    teamTurn: null,
                });
            })
            .on('update_score', msg => {
                const { showResults } = this.state;
                if (showResults) {
                    return false;
                }
                this.updateScore(msg);
                this.setState(
                    {
                        teamTurn: null,
                        showResults: true,
                    },
                    () => {
                        resetInputCaptured();
                    }
                );
                // this.reinitTurn()
            })
            .on('get_song', msg => {
                const { showResults } = this.state;
                if (showResults) {
                    this.setState({
                        showInputSequence: true,
                        showResults: false,
                    });
                }
            });
    }

    mapJoyconLeftInputs(inputList) {
        return inputList.map(input => joyconMapping[input]);
    }

    showAudioPlayer() {
        const { showChoices, showSelectNbChoices, showResults } = this.state;

        if (showChoices || showSelectNbChoices || showResults) {
            return;
        }

        this.setState({
            showAudioPlayer: true,
            showInputSequence: false,
        });
    }

    checkTeamInputListCaptured() {
        const {
            showAudioPlayer,
            showSelectNbChoices,
            teamTurn,
            showChoices,
        } = this.state;

        const { permutation, inputsCaptured, resetInputCaptured } = this.props;

        if (!teamTurn || showAudioPlayer) {
            const inputListTeamA = inputsCaptured.teamA;
            const inputListTeamB = inputsCaptured.teamB;

            const inputListTeamAMapped = this.mapJoyconLeftInputs(
                inputListTeamA
            );

            if (
                JSON.stringify(inputListTeamAMapped) ===
                JSON.stringify(permutation)
            ) {
                resetInputCaptured();
                this.setState(
                    {
                        teamTurn: 'teamA',
                        showSelectNbChoices: true,
                        showAudioPlayer: false,
                        showInputSequence: false,
                        showResults: false,
                    },
                    () => {}
                );
            } else if (
                JSON.stringify(inputListTeamA) !==
                    JSON.stringify(permutation) &&
                inputListTeamA.length === 4
            ) {
                resetInputCaptured('teamA');
            }

            if (
                JSON.stringify(inputListTeamB) === JSON.stringify(permutation)
            ) {
                resetInputCaptured();
                this.setState({
                    teamTurn: 'teamB',
                    showSelectNbChoices: true,
                    showAudioPlayer: false,
                    showInputSequence: false,
                    showResults: false,
                });
            } else if (
                JSON.stringify(inputListTeamB) !==
                    JSON.stringify(permutation) &&
                inputListTeamB.length === 4
            ) {
                resetInputCaptured('teamB');
            }
        }

        if (!showAudioPlayer && teamTurn && showSelectNbChoices) {
            const nbChoices = inputsCaptured[teamTurn][0];

            if (nbChoices) {
                this.setState(
                    {
                        showSelectNbChoices: false,
                        showChoices: true,
                        showResults: false,
                        nbChoices,
                    },
                    () => {
                        resetInputCaptured();
                    }
                );
            }
        }

        // Display results
        // if (teamTurn && showChoices) {
        //     const choice = inputsCaptured[teamTurn][0];

        //     const { songInfo } = this.props;

        //     if (choice) {
        //         const idxResult = songInfo.propositions.findIndex(
        //             proposition => {
        //                 return proposition.isResponse;
        //             }
        //         );

        //         const isCorrectChoice = this.resultsMapping[idxResult].includes(
        //             choice
        //         );

        //         if (isCorrectChoice) {
        //             this.updateScore(teamTurn);
        //         }

        //         this.setState(
        //             {
        //                 choice,
        //                 showChoices: false,
        //                 showResults: true,
        //             },
        //             () => {
        //                 resetInputCaptured();
        //             }
        //         );
        //     }
        // }

        requestAnimationFrame(this.checkTeamInputListCaptured);
    }

    reinitTurn() {
        this.props.handleNewTurn();
        this.setState({
            showInputSequence: true,
            showAudioPlayer: false,
            showResults: false,
            showChoices: false,
            showSelectNbChoices: false,
            teamTurn: null,
        });
    }

    updateScore(message) {
        this.setState(prevState => {
            return {
                ...prevState,
                scores: {
                    ...(message.team === 'teamA'
                        ? {
                              teamA:
                                  prevState.scores.teamA +
                                  Number(message.pointsToAdd),
                          }
                        : { teamA: prevState.scores.teamA }),
                    ...(message.team === 'teamB'
                        ? {
                              teamB:
                                  prevState.scores.teamB +
                                  Number(message.pointsToAdd),
                          }
                        : { teamB: prevState.scores.teamB }),
                },
            };
        });
    }

    render() {
        const { permutation, songInfo, inputsCaptured } = this.props;
        const {
            showInputSequence,
            showChoices,
            showResults,
            showSelectNbChoices,
            nbChoices,
            teamTurn,
            choice,
            scores,
        } = this.state;

        // const idxResult = songInfo.propositions.findIndex(proposition => {
        //     return proposition.isResponse;
        // });

        // const teamChoice = this.resultsMapping[idxResult].includes(choice);

        return (
            <Fragment>
                <ScoreHUD scores={scores} />
                {showInputSequence && (
                    <PermutationIndicator
                        songInfo={songInfo}
                        sequence={permutation}
                        isSequenceCanceling={teamTurn}
                        handleSequenceEnded={this.showAudioPlayer}
                    />
                )}

                {teamTurn && <TeamTurn team={teamTurn} />}

                {/* {(showChoices || showSelectNbChoices) && (
                    <ChoicesScreen
                        isSelectNbChoicesStep={showSelectNbChoices}
                        isSelectChoiceStep={showChoices}
                        songInfo={songInfo}
                        inputsCaptured={inputsCaptured}
                        nbChoices={nbChoices}
                    />
                )} */}

                {showResults && (
                    <ResultScreen
                        isRightChoice={true}
                        scores={scores}
                        // handleResultsDisplay={this.reinitTurn}
                    />
                )}
            </Fragment>
        );
    }
}

export default GameScreen;
