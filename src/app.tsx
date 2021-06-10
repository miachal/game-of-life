import React, { useState, useCallback, useRef } from 'react';
import { render } from 'react-dom';
import produce from 'immer';
import styled from 'styled-components';

const MenuButton = styled.div`
  background-color: #4f9ec4;
  border: 0;
  padding: 10px;
  margin-right: 20px;
  color: white;
  text-transform: uppercase;
  font-size: 12px;
  border: 1px solid;
  flex: 1;
  text-align: center;
  &:hover {
    cursor: pointer;
    border: 1px solid black;
  }
  &:active {
    border: 1px solid red;
  }
`;

const ButtonsBar = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

const main = document.createElement('div');
document.body.appendChild(main);

const numRows = 20;
const numCols = 20;

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, -1],
  [1, 1],
  [-1, 0],
  [-1, -1],
  [-1, 1]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; ++i) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows;
}

const App: React.FC = () => {
  const [grid, setGrid] = useState(generateEmptyGrid);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => produce(g, newGrid => {
      for (let i = 0; i < numRows; ++i) {
        for (let k = 0; k < numCols; ++k) {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const new_i = i + x;
            const new_k = k + y;
            if (new_i >= 0 && new_i < numRows && new_k >= 0 && new_k < numCols) {
              neighbors += g[new_i][new_k];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][k] = 0;
          } else if (g[i][k] === 0 && neighbors === 3) {
            newGrid[i][k] = 1;
          }

        }
      }
    }));

    setTimeout(runSimulation, 10);
  }, []);

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) => rows.map((col, k) =>
          <div
            onClick={() => {
              setGrid(grid => produce(grid, newGrid => {
                newGrid[i][k] = grid[i][k] ? 0 : 1;
              }))
            }}
            key={`${i}_${k}`}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: grid[i][k] ? '#fce2c2' : undefined,
              border: 'solid 1px #b3c8c8'
            }} />))}
      </div>
      <ButtonsBar>
        <MenuButton
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}>{running ? 'stop' : 'start'}</MenuButton>
        <MenuButton
          onClick={() => {
            setGrid(generateEmptyGrid);
          }}>clean</MenuButton>

        <MenuButton
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; ++i) {
              rows.push(Array.from(Array(numCols), () => Math.random() > .7 ? 1 : 0))
            }
            setGrid(rows);

          }}>randomize</MenuButton>
      </ButtonsBar>

    </>
  );
};

render(<App />, main);