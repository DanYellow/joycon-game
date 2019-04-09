import React, { Component } from 'react';

import WaveWhite from '../images/wave-white.png';

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.audioPlayer = React.createRef();
        this.handleLooping = this.handleLooping.bind(this);
    }

    handleLooping(e) {
        const { maxTime = 3 } = this.props;
        if (e.currentTarget.currentTime > maxTime) {
            e.currentTarget.currentTime = 0;
        }
    }

    render() {
        const { songInfo } = this.props;
        return (
            <div
                className="audio-player"
                style={{
                    display: 'none',
                }}
            >
                <div className="illustration">
                    <img src={WaveWhite} alt="" />
                </div>
                <audio
                    ref={this.audioPlayer}
                    src={`songs/${songInfo.src}`}
                    controls
                    autoPlay
                    loop
                    onTimeUpdate={this.handleLooping}
                    style={{
                        display: 'none',
                    }}
                />
            </div>
        );
    }
}
