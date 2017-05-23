import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';

import { ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, DEFAULT_TILE_STATE } from '../actions';

import Nav from '../components/nav';

let intervalID = null; //eslint-disable-line
// const noteArray = [];
// const playing = false;

class MusicPortionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: DEFAULT_TILE_STATE,
      tempo: 350,
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
      bass: new Tone.MembraneSynth().toMaster(),
      firstSave: true,
      playing: false,
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playGrid = this.playGrid.bind(this);
    this.createNoteArrayAndMakeGlow = this.createNoteArrayAndMakeGlow.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  componentWillMount() {
    const tempState = [
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
    ];

    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles = tempState;
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
  }

  // reset the notes to false when cancel is clicked
  onCancelClick(e) {
    // reset the clicked tiles
    const tempState = [
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
    ];
    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles = tempState;
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
  }

  onSaveClick(e) {
    // save the clicked tiles to server if it's the first save
    this.props.saveMusic(this.state, this.props.mid.history);
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  onTileClick(event) {
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (!stateCopy.tiles[event.target.name][event.target.title]) {
      if (event.target.title === NUMROWS - 1) { // if its in the bass row
        this.state.bass.triggerAttackRelease('C1', '8n');
      } else {
        this.state.synth.triggerAttackRelease(ToneTypes[event.target.title], '8n');
      }
      stateCopy.tiles[event.target.name][event.target.title] = true;
    } else {
      stateCopy.tiles[event.target.name][event.target.title] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);

    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  stopPlaying() { //eslint-disable-line
    Tone.Transport.stop();
    const element = document.getElementsByClassName('tileLabel');
    for (let i = 0; i < element.length; i += 1) {
      element[i].classList.remove('glow');
    }
    console.log('stopped tone');
  }


  createNoteArrayAndMakeGlow() {
    let bass = null;
    const melody = [];
    for (let colIndex = 0; colIndex < NUMCOLS; colIndex += 1) {
      for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
        const note = {};
        if (this.state.tiles[colIndex][rowIndex]) { // if the tile at [col][row] is active
          if (rowIndex === NUMROWS - 1) {
            bass = 'C1';
          } else {
            note.time = `${colIndex}*4n`;
            note.note = `${ToneTypes[rowIndex]}`;
            note.dur = '8n';
            melody.push(note); // add the tile corresponding to rowindex to Array
          }
          document.getElementById(`label${colIndex}_${rowIndex}`).classList.add('glow');
        }
      }
    }
    return { melody, bass };
  }


  playGrid() { //eslint-disable-line
    // console.log('b4 part');
    const noteArray = this.createNoteArrayAndMakeGlow();
    console.log(noteArray);
    const part = new Tone.Part((time, event) => {
      // console.log(event);
      // the events will be given to the callback with the time they occur
      this.state.polySynth.triggerAttackRelease(event.note, event.dur, time);
      // console.log('in callback');
    }, noteArray.melody);
    part.start(0);
    part.loop = 500;
    part.loopEnd = '5m';
    Tone.Transport.start('+0.1');
  }

  renderGrid() {
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
    return (
      <div id="inputwindow">
        <Nav />
        <div className="saveBar">
          <input id="title" onChange={this.onTitleChange} value={this.state.title} placeholder={this.state.title} />
          <button onClick={this.onSaveClick}>Save</button>
          <button onClick={this.onCancelClick}>Clear</button>
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
  }
);

export default (connect(mapStateToProps, { toggleTile, saveMusic, updateMusic })(MusicPortionContainer));
