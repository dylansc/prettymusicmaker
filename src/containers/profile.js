import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import { fetchMusic } from '../actions';
import MusicTile from './profileMusicTile';
// import { stopPlaying } from './musicPortion';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderSongs = this.renderSongs.bind(this);
  }

  // fetch music on page load
  componentDidMount() {
    this.props.fetchMusic();
    Tone.Transport.stop();
  }

  // render the songs
  renderSongs() {
    return this.props.musicObjects.map((music) => {
      return (
        <MusicTile key={music.id} id={music.id} title={music.title} />
      );
    });
  }

  render() {
    if (!this.props.musicObjects) {
      return <div className="profilepage">Loading Music...</div>;
    }
    return (
      <div className="profilepage">
        <div id="profilename">{localStorage.getItem('email')}</div>
        <div id="songlist">
          {this.renderSongs()}
        </div>
      </div>
    );
  }
}

// get access to tiles as tileArray
const mapStateToProps = state => (
  {
    musicObjects: state.music.allMusic,
  }
);

export default connect(mapStateToProps, { fetchMusic })(Profile);
