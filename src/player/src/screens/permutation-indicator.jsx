import React, { Component, Fragment } from 'react';

const JoyConMainButtonUi = () => (
    <div className="buttons">
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
    </div>
);

export default class PermutationIndicator extends Component {
    componentDidMount() {
        this.circleList = Array.from(document.getElementsByClassName('circle'));

        this.i = 0;
        this.nbSeqPlayed = 0;
        this.TIME_SEQ_PLAY = 750;
        this.TIME_BETWEEN_SEQ_PLAY = 1700;
        this.NB_REPLAY_SEQ_MAX = 0;

        this.playSequence = this.playSequence.bind(this);

        this.playSequence();

        this.globalSeq = null;
        this.blinkSeq = null;
        this.restartSeq = null;
        this.endingSeq = null;
    }

    playSequence() {
        const { sequence, isSequenceCanceling } = this.props;

        if (isSequenceCanceling) {
            clearTimeout(this.globalSeq);
            clearTimeout(this.blinkSeq);
            clearTimeout(this.restartSeq);
            clearTimeout(this.endingSeq);
            return;
        }

        this.globalSeq = setTimeout(() => {
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
                this.blinkSeq = setTimeout(() => {
                    this.circleList.forEach(circle => {
                        circle.classList.remove('is-active');
                    });
                }, this.TIME_SEQ_PLAY);

                if (this.nbSeqPlayed < this.NB_REPLAY_SEQ_MAX) {
                    this.nbSeqPlayed = this.nbSeqPlayed + 1;
                    this.restartSeq = setTimeout(() => {
                        this.playSequence();
                    }, this.TIME_BETWEEN_SEQ_PLAY);
                } else {
                    this.endingSeq = setTimeout(() => {
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
