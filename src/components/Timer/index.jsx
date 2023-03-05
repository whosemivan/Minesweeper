import React, { useEffect } from 'react';
import "./style.css";

function MinuteTimer({ seconds, isActive, setSeconds }) {
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, setSeconds]);

  return (
    <div className='timer'>
      {Math.floor(seconds / 60)}
    </div>
  );
}

export default MinuteTimer;