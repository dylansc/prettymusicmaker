import React from 'react';
// import React, { Component } from 'react';

import MusicPortionContainer from '../containers/musicPortion';

// eslint-disable-next-line react/prefer-stateless-function
const MusicPortion = (props) => {
  // console.log(props);
  return (
    <div>
      <MusicPortionContainer />
    </div>
  );
};

export default MusicPortion;


// class MusicPortion extends Component {
//   constructor(props) {
//     // console.log('in constructor');
//     super(props);
//     this.state = {};
//   }
//
//   render() {
//     return (
//       <div>
//         <MusicPortionContainer mid={this.props.match.params.musicID} />
//       </div>
//     );
//   }
// }
//
// export default MusicPortion;
