import { connect } from 'react-redux';
import React, { Component } from 'react';
import update from 'react-addons-update'; // ES6

import { addTile } from '../actions';


// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
class Column extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      tiles: {
        1: false,
        2: true,
        3: false,
      },
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
  }

  onTileClick(event) {
    // this.setState({ tiles: event.target.value });
    console.log('in addNoteClick props is');
    console.log(this.props);
    console.log('e.t is :');
    console.log(event.target);
    // const newState = this.state.tiles;
    // newState.[event.target.value]=true;
    // const tilenum = event.target.title;
    // const checked = this.state.tiles[event.target.title];
    // update(this.state.tiles, { [event.target.title]: false });

    this.setState({ tiles: update(this.state.tiles, { [event.target.title]: false }),
    });


    // eslint-disable-next-line no-unused-vars
    // const noteToAdd = <Note id={100} note={noteInfo} />;
    // console.log('printing noteToAdd');
    // console.log(noteToAdd);
    // this.props.addTile({ tiles[] });
  }

  renderTiles() {
    // if (this.state.1) {
    console.log('this.props.posts in renderposts');
    console.log(this.state.tiles);
    return this.state.tiles.map((tile, i) => {
      return (
        <input type="checkbox" title={i} className="tile" onChange={this.onTileClick} checked={tile} />
      );
    });
    // } else {
    //   return 'loading';
    // }
  }


  render() {
    return (
      <div id="inputwindow">
        <div id="inputdiv">
          <h1> Notes below here </h1>
          {this.renderTiles()}
        </div>
      </div>

    );
  }
}

export default (connect(null, { addTile })(Column));

// export default NoteInput;
