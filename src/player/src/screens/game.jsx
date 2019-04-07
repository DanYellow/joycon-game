import React, { Component, Fragment } from 'react';

import WaveWhite from '../images/wave-white.png';

import './game.css';

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
                    <div className="buttons">
                        <div className="circle" />
                        <div className="circle" />
                        <div className="circle" />
                        <div className="circle" />
                    </div>
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
        };
        this.showAudioPlayer = this.showAudioPlayer.bind(this);
    }

    showAudioPlayer() {
        this.setState({
            showAudioPlayer: true,
            showInputSequence: false,
        });
    }

    render() {
        const { permutation, songInfo } = this.props;
        const { showInputSequence, showAudioPlayer, showResults } = this.state;

        return (
            <Fragment>
                {showInputSequence && (
                    <PermutationIndicator
                        sequence={permutation}
                        handleSequenceEnded={this.showAudioPlayer}
                    />
                )}

                {showAudioPlayer && <AudioPlayer songInfo={songInfo} />}
            </Fragment>
        );
    }
}

export default GameScreen;
