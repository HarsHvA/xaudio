import React from "react";
import Waveform from "../../Wavesurfer/wavesurfer";
import { useLocation } from "react-router-dom";

function Player() {
  let location = useLocation();
  const audioUrl = location.state;
  return (
    <div className="">
      <Waveform url={audioUrl} />
    </div>
  );
}

export default Player;