import React, { Component, Fragment } from 'react';

const colors = ['#FF5678', '#000000', '#FF2100'];

const JoyConMainButtonUi = props => (
    <div className="buttons">
        <div className="circle" style={{ backgroundColor: props.color }} />
        <div className="circle" style={{ backgroundColor: props.color }} />
        <div className="circle" style={{ backgroundColor: props.color }} />
        <div className="circle" style={{ backgroundColor: props.color }} />
    </div>
);

export default class PermutationIndicator extends Component {
    constructor(props) {
        super(props);

        this.i = 0;
        this.nbSeqPlayed = 0;
        this.TIME_SEQ_PLAY = 750;
        this.TIME_BETWEEN_SEQ_PLAY = 1700;
        this.NB_REPLAY_SEQ_MAX = 2;

        this.playSequence = this.playSequence.bind(this);

        this.globalSeq = null;
        this.blinkSeq = null;
        this.restartSeq = null;
        this.endingSeq = null;
    }
    componentDidMount() {
        this.circleList = Array.from(document.getElementsByClassName('circle'));

        this.playSequence();
    }

    componentWillUnmount() {
        this.i = 0;
        this.nbSeqPlayed = 0;
        this.circleList = [];

        clearTimeout(this.globalSeq);
        clearTimeout(this.blinkSeq);
        clearTimeout(this.restartSeq);
        clearTimeout(this.endingSeq);
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
            // console.log('this.i', sequence, seqItem);
            // console.log(circle);
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
                    // this.endingSeq = setTimeout(() => {
                    //     this.props.handleSequenceEnded();
                    // }, this.TIME_SEQ_PLAY);
                }
            }
        }, this.TIME_SEQ_PLAY);
    }

    render() {
        return (
            <Fragment>
                <div className="permutation-indicator">
                    <JoyConMainButtonUi />
                    <p>Mémorisez la permutation pour pouvoir répondre</p>
                </div>
            </Fragment>
        );
    }
}
