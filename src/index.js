import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.isClicked ? 'current square' : 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function CalculateRowCol(props){
  if(isNaN(props.index))
     return (<div></div>);

    //  props.index = props.index ? props.index+1 : props.index;
  const row = Math.ceil(props.index/3);
  const column = props.index - (row-1)*3;
  return (
    <div>row: {row}, columns: {column}</div>
  );
}

class Board extends React.Component {
  setHighLight(i){
    if(this.props.winsquares)
     return( this.props.lastIndex === i || (this.props.winsquares && this.props.winsquares.includes(i)))
  };

  renderSquare(i) {
    return (
      <Square
        winsquares = {this.props.winsquares}
        value={this.props.squares[i]}
        isClicked={this.setHighLight(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  //based on this article: https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778
  createBoard(){
    let board=[];

    for(let i=0; i<3; i++){
      let children=[];
      for(let j=0; j<3; j++){
        children.push(this.renderSquare(3*i + j))
      }
      board.push(<div className="board-row">{children}</div>)
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      clickedIndex: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const clickedIndex = this.state.clickedIndex.slice(0, this.state.stepNumber);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      clickedIndex: clickedIndex.concat(i)
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      return (
        <div key={move}>
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
        <CalculateRowCol index={this.state.clickedIndex[move]+1}/>
        </div>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    }else if(this.state.stepNumber === 9){
      status = "No one win."
    }
     else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winsquares = {winner ? winner.squares : []}
            squares={current.squares}
            lastIndex={this.state.clickedIndex[this.state.stepNumber-1]}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        squares:lines[i]
      }
    }
  }
  return null;
}
