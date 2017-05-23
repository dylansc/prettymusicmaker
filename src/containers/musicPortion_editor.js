import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';

import { fetchOneMusic, ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, DEFAULT_TILE_STATE } from '../actions';

import Nav from '../components/nav';

let intervalID = null; //eslint-disable-line
let noteArray = [];
let playing = false;

class MusicPortionEditorContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.mid.location.pathname.split('/')[2],
      title: '',
      tiles: DEFAULT_TILE_STATE,
      tempo: 350,
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
      firstSave: true,
      playing: false,
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playGrid = this.playGrid.bind(this);
    this.createNoteArray = this.createNoteArray.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchOneMusic(this.props.mid.location.pathname.split('/')[2]);
  }

  // get the props immediately
  componentWillReceiveProps(nextprops) {
    console.log('nextprops');
    console.log(nextprops);
    // this.setState({ title: this.props.oneMusic.title });

    if (nextprops.oneMusic) {
      this.setState({
        title: nextprops.oneMusic.title,
        tiles: nextprops.oneMusic.music,
      });
    }
  }

  // reset the notes to false when cancel is clicked
  onResetClick(e) {
    // reset the clicked tiles to the saved music
    this.props.fetchOneMusic(this.props.mid.location.pathname.split('/')[2]);
  }

  onUpdateClick(e) {
    // save the clicked tiles to server if it's the first save
    this.props.updateMusic(this.state.id, this.state, this.props.history);
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  onTileClick(event) {
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (this.props.oneMusic) {
      // set the state to the original state returned from the DB
      stateCopy.tiles = this.props.oneMusic.music;
    }
    if (!stateCopy.tiles[event.target.name][event.target.title]) {
      this.state.synth.triggerAttackRelease(ToneTypes[event.target.title], '8n');
      stateCopy.tiles[event.target.name][event.target.title] = true;
    } else {
      stateCopy.tiles[event.target.name][event.target.title] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);

    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  createNoteArray(colIndex) {
    const tmpNoteArray = [];
    for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
      if (this.state.tiles[colIndex][rowIndex]) { // if the tile at [col][row] is active
        tmpNoteArray.push(ToneTypes[rowIndex]); // add the tile corresponding to rowindex to Array
        document.getElementById(`label${colIndex}_${rowIndex}`).classList.add('glow');
      }
    }
    return tmpNoteArray;
  }

  stopPlaying() { //eslint-disable-line
    if (intervalID) {
      clearInterval(intervalID);
      this.state.polySynth.triggerRelease(noteArray);
      const element = document.getElementsByClassName('tileLabel');
      for (let i = 0; i < element.length; i += 1) {
        element[i].classList.remove('glow');
      }
      playing = false;
    } else {
      console.log('no song is playing');
    }
  }

  playGrid(play) {
    if (playing === false) {
      playing = true;
      let col = 0;
      noteArray = []; // declared in constants up top
      let prevArray = [];
      intervalID = setInterval(() => {
        if (col !== 0) {
          this.state.polySynth.triggerRelease(prevArray);
          const prevCol = col - 1;
          const element = document.getElementsByClassName(`col${prevCol}`);
          for (let i = 0; i < element.length; i += 1) {
            element[i].classList.remove('glow');
          }
        }
        if (col >= NUMCOLS) {
          col = 0;
        }
        noteArray = this.createNoteArray(col);
        this.state.polySynth.triggerAttack(noteArray);
        prevArray = noteArray;
        col += 1;
      }, this.state.tempo);
    }
  }


  renderGrid() {
    if (!this.props.oneMusic && !this.props.tileArray) {
      return <div>Loading Music...</div>;
    } else if (this.props.oneMusic) {
      return this.props.oneMusic.music.map((col, colIndex) => {
        return (
          <div className="column">
            {this.renderColumn(col, colIndex)}
          </div>
        );
      });
    }
    return this.state.tiles.map((col, colIndex) => {
      return (
        <div className="column">
          {this.renderColumn(col, colIndex)}
        </div>
      );
    });
  }


  renderColumn(col, colIndex) {
    return col.map((tile, rowIndex) => {
      return (
        <div className="checkbox_and_label">
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex}`} id={`label${colIndex}_${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  render() {
    // console.log('in render');
    // console.log(this.props.music);
    return (
      <div id="inputwindow">
        <Nav />
        <div className="saveBar">
          <input id="title" onChange={this.onTitleChange} value={this.state.title} placeholder={this.state.title} />
          <button onClick={this.onUpdateClick}>Update</button>
          <button onClick={this.onResetClick}>Reset</button>
        </div>
        <div className="grid">
          {this.renderGrid()}
          <button type="button" onClick={this.playGrid}>Play</button>
          <button type="button" onClick={this.stopPlaying}>Pause</button>
        </div>
      </div>
    );
  }
}

// get access to tiles as tileArray
const mapStateToProps = state => (
  {
    tileArray: state.music.tiles,
    oneMusic: state.music.oneMusic,
  }
);

export default (connect(mapStateToProps, { fetchOneMusic, toggleTile, saveMusic, updateMusic })(MusicPortionEditorContainer));
