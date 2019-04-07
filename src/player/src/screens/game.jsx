import React, { Component, Fragment } from 'react';

import ChoicesScreen from './choices';

import WaveWhite from '../images/wave-white.png';

import './game.css';

const JoyConMainButtonUi = () => (
    <div className="buttons">
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
    </div>
);

// Div index
// value button
const positionMappingButtonList = {
    0: 1,
    1: 0,
    2: 2,
    3: 3,
};

class PermutationIndicator extends Component {
    componentDidMount() {
        this.circleList = Array.from(document.getElementsByClassName('circle'));

        this.i = 0;
        this.nbSeqPlayed = 0;
        this.TIME_SEQ_PLAY = 750;
        this.TIME_BETWEEN_SEQ_PLAY = 1700;
        this.NB_REPLAY_SEQ_MAX = 0;

        this.playSequence = this.playSequence.bind(this);

        this.playSequence();
    }

    playSequence() {
        const { sequence } = this.props;
        setTimeout(() => {
            this.circleList.forEach(circle => {
                circle.classList.remove('is-active');
            });
            const seqItem = sequence[this.i];

            const circle = this.circleList[seqItem];
            circle.classList.add('is-active');
            this.i++;
            if (this.i < this.circleList.length) {
                this.playSequence();
            } else {
                this.i = 0;
                setTimeout(() => {
                    this.circleList.forEach(circle => {
                        circle.classList.remove('is-active');
                    });
                }, this.TIME_SEQ_PLAY);

                if (this.nbSeqPlayed < this.NB_REPLAY_SEQ_MAX) {
                    this.nbSeqPlayed = this.nbSeqPlayed + 1;
                    setTimeout(() => {
                        this.playSequence();
                    }, this.TIME_BETWEEN_SEQ_PLAY);
                } else {
                    setTimeout(() => {
                        this.props.handleSequenceEnded();
                    }, this.TIME_SEQ_PLAY);
                }
            }
        }, this.TIME_SEQ_PLAY);
    }

    render() {
        return (
            <Fragment>
                <div className="permutation-indicator">
                    <JoyConMainButtonUi />
                    <p>Mémorisez la permutation </p>
                </div>
            </Fragment>
        );
    }
}

class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.audioPlayer = React.createRef();
    }
    render() {
        const { songInfo } = this.props;
        return (
            <div className="audio-player">
                <div className="illustration">
                    <img src={WaveWhite} alt="" />
                </div>
                <audio
                    ref={this.audioPlayer}
                    src={`songs/${songInfo.src}`}
                    controls
                    autoPlay
                    muted={true}
                />
            </div>
        );
    }
}

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
        };
        this.showAudioPlayer = this.showAudioPlayer.bind(this);
        this.checkTeamInputListCaptured = this.checkTeamInputListCaptured.bind(
            this
        );
    }

    componentDidMount() {
        this.raf = requestAnimationFrame(this.checkTeamInputListCaptured);
    }

    showAudioPlayer() {
        this.setState({
            showAudioPlayer: true,
            showInputSequence: false,
        });
    }

    checkTeamInputListCaptured() {
        const { showAudioPlayer, showSelectNbChoices, teamTurn } = this.state;

        const {
            permutation,
            inputsCaptured,
            handlePermutationTriggered,
        } = this.props;
        if (!teamTurn || showAudioPlayer) {
            const inputListTeamA = inputsCaptured.teamA;
            const inputListTeamB = inputsCaptured.teamB;

            if (
                JSON.stringify(inputListTeamA) === JSON.stringify(permutation)
            ) {
                this.setState(
                    {
                        teamTurn: 'teamA',
                        showSelectNbChoices: true,
                        showAudioPlayer: false,
                        showInputSequence: false,
                    },
                    () => {
                        handlePermutationTriggered();
                    }
                );
            }

            if (
                JSON.stringify(inputListTeamB) === JSON.stringify(permutation)
            ) {
                this.setState(
                    {
                        teamTurn: 'teamB',
                        showSelectNbChoices: true,
                        showAudioPlayer: false,
                        showInputSequence: false,
                    },
                    () => {
                        handlePermutationTriggered();
                    }
                );
            }
        }

        if (!showAudioPlayer && teamTurn && showSelectNbChoices) {
            const choice = inputsCaptured[teamTurn];
            if (choice) {
                console.log('inputsCaptured', choice);
            }
            // this.setState({
            //     showSelectNbChoices: false,
            //     showChoices: true,
            // });
        }

        requestAnimationFrame(this.checkTeamInputListCaptured);
    }

    render() {
        const { permutation, songInfo, inputsCaptured } = this.props;
        const {
            showInputSequence,
            showAudioPlayer,
            showChoices,
            showSelectNbChoices,
            teamTurn,
        } = this.state;

        const choice = teamTurn ? inputsCaptured[teamTurn] : null;

        return (
            <Fragment>
                {showInputSequence && (
                    <PermutationIndicator
                        sequence={permutation}
                        handleSequenceEnded={this.showAudioPlayer}
                    />
                )}

                {showAudioPlayer && <AudioPlayer songInfo={songInfo} />}
                {(showChoices || showSelectNbChoices) && (
                    <ChoicesScreen
                        isSelectNbChoicesStep={showSelectNbChoices}
                        isSelectChoiceStep={showChoices}
                        songInfo={songInfo}
                        inputsCaptured={inputsCaptured}
                        choice={choice}
                    />
                )}
            </Fragment>
        );
    }
}

export default GameScreen;
