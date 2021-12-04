import React, { useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#eee",
  progressColor: "Blue",
  cursorColor: "OrangeRed",
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 150,
  normalize: true,
  partialRender: true,
});

export default function Waveform({ url }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [note, addNote] = useState([]);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load("https://safe-chamber-04303.herokuapp.com/" + url);

    wavesurfer.current.on("ready", function () {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });
    return () => wavesurfer.current.destroy();
    // eslint-disable-next-line
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = (e) => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  return (
    <div>
      <div id="waveform" ref={waveformRef} />
      <div className="controls">
        <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button>
        <input
          type="range"
          id="volume"
          name="volume"
          min="0.01"
          max="1"
          step=".025"
          onChange={onVolumeChange}
          defaultValue={volume}
        />
        <label htmlFor="volume">Volume</label>
      </div>
      <div className="addNotesSection">
        <input
          type="text"
          value={noteText}
          onChange={(e) => {
            setNoteText(e.target.value);
          }}
        ></input>
        <br />
        <button
          onClick={() => {
            console.log(wavesurfer.current.getCurrentTime());
            wavesurfer.current.play();
            addNote((notes) => [
              ...notes,
              {
                text: noteText,
                timeStamp: wavesurfer.current.getCurrentTime(),
              },
            ]);

            console.log(note);
          }}
        >
          Add notes
        </button>
      </div>
      <div className="NotesSection">
        {note === null ? (
          <h1>no notes available</h1>
        ) : (
          note.map((items) => {
            return (
              <div
                key={items.timeStamp}
                onClick={() => {
                  wavesurfer.current.play(items.timeStamp);
                }}
              >
                <h1>{items.text}</h1>
                <h2>{items.timeStamp}</h2>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
