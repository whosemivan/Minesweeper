import React, { useEffect } from "react";
import "./style.css";

function Sekundomer({ time, setTime, isRunning, intervalRef }) {

  useEffect(() => {
    if (isRunning) intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  }, [intervalRef, isRunning, setTime])


  return (
    <div className="sekundomer">
      {time}
    </div>
  );
}

export default Sekundomer;