
import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Timer from './components/Timer';
import Sekundomer from './components/Sekundomer';

const mine = -1;

const timerSeconds = 40 * 60;

function createField(size) {
  const field = new Array(size * size).fill(0);

  function inc(x, y) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === mine) return;

      field[y * size + x] += 1;
    }
  }

  for (let i = 0; i < size;) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (field[y * size + x] === mine) continue;

    field[y * size + x] = mine;

    i += 1;

    inc(x + 1, y);
    inc(x - 1, y);
    inc(x, y + 1);
    inc(x, y - 1);
    inc(x + 1, y - 1);
    inc(x - 1, y - 1);
    inc(x + 1, y + 1);
    inc(x - 1, y + 1);
  }

  return field;
}


const statusItem = {
  transparent: null,
  fill: 'fill',
  flag: 'flag',
  question: 'question'
}

export default function App() {

  const size = 16;
  const dimension = new Array(size).fill(null);
  const intervalRef = useRef(null);

  // timer
  const [seconds, setSeconds] = useState(timerSeconds);
  const [isActive, setIsActive] = useState(true);

  // sekundomer
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const [death, setDeath] = useState(false);
  const [field, setField] = useState(() => createField(size));
  const [mask, setMask] = useState(() => new Array(size * size).fill(statusItem.fill));

  const [isFirstClick, setFirstClick] = useState(true);

  // status smile
  const [isScary, setScary] = useState(false);
  const [isSad, setSad] = useState(false);

  const win = React.useMemo(() => !field.some(
    (f, i) =>
      f === mine && mask[i] !== statusItem.flag
      && mask[i] !== statusItem.transparent
  ),
    [field, mask],
  );

  useEffect(() => {
    if (seconds === 0) {
      mask.forEach((_, i) => mask[i] = statusItem.transparent);

      setDeath(true);
      setIsActive(false);

      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
  }, [seconds, mask])


  const chooseClassCss = (x, y) => {
    if (mask[y * size + x] !== statusItem.transparent) {
      return `item item--${mask[y * size + x]}`
    } else if (field[y * size + x] === mine) {
      return `item item--tnt`;
    } else {
      return `item`;
    }
  };


  const chooseStatusClass = () => {
    if (isScary) {
      return 'status status--scary';
    } else if (isSad) {
      return `status status--sad`
    } else if (win) {
      return `status status--win`
    } else {
      return `status`
    }
  }


  return (
    <div className='game'>
      <div className='top-panel'>
        <Timer seconds={seconds} setSeconds={setSeconds} isActive={isActive} setIsActive={setIsActive} setDeath={setDeath} />
        <button className={chooseStatusClass()} onClick={() => {
          mask.forEach((_, i) => mask[i] = statusItem.fill);
          setDeath(false);
          setField(() => createField(size));
          setIsActive(true);
          setSeconds(40 * 60);

          setTime(0);
          clearInterval(intervalRef.current);
          setIsRunning(true);
          intervalRef.current = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
          }, 1000);

          setMask((prev) => [...prev]);
        }}>

        </button>

        <Sekundomer time={time} setTime={setTime} isRunning={isRunning} setIsRunning={setIsRunning} intervalRef={intervalRef} />
      </div>
      {dimension.map((_, y) => {
        return (<div key={y} className="row">
          {dimension.map((_, x) => {
            return (<div
              key={x}
              className={chooseClassCss(x, y)}
              onMouseDown={() => setScary(true)}
              onMouseUp={() => setScary(false)}
              onClick={() => {
                if (win || death) return;

                if (mask[y * size + x] === statusItem.transparent) return;

                const clearing = [];

                function clear(x, y) {
                  if (x >= 0 && x < size && y >= 0 && y < size) {
                    if (mask[y * size + x] === statusItem.transparent) return;

                    clearing.push([x, y]);
                  }
                }

                clear(x, y);

                while (clearing.length) {
                  const [x, y] = clearing.pop();

                  mask[y * size + x] = statusItem.transparent;

                  if (field[y * size + x] !== 0) continue;

                  clear(x + 1, y);
                  clear(x - 1, y);
                  clear(x, y + 1);
                  clear(x, y - 1);
                }

                if (isFirstClick && field[y * size + x] === mine) {
                  setField(() => createField(size));
                  mask.forEach((_, i) => mask[i] = statusItem.fill);
                } else {
                  setFirstClick(false);
                }

                if (!isFirstClick && field[y * size + x] === mine) {
                  mask.forEach((_, i) => mask[i] = statusItem.transparent);

                  setDeath(true);
                  setIsActive(false);
                  setSad(true);
                  setIsRunning(false);
                  clearInterval(intervalRef.current);
                }

                setMask((prev) => [...prev]);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (win || death) return;

                if (mask[y * size + x] === statusItem.transparent) return;

                if (mask[y * size + x] === statusItem.fill) {
                  mask[y * size + x] = statusItem.flag;
                } else if (mask[y * size + x] === statusItem.flag) {
                  mask[y * size + x] = statusItem.question;
                } else if (mask[y * size + x] === statusItem.question) {
                  mask[y * size + x] = statusItem.fill;
                }

                setMask((prev) => [...prev]);
              }}
            >{
                mask[y * size + x] === statusItem.transparent && field[y * size + x]
              }</div>);
          })}
        </div>);
      })}
    </div>
  )
}
