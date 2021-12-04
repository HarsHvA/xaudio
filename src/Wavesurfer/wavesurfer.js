import React, { useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#eee",
  progressColor: "Red",
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
  const [playing, setPlay] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [note, addNote] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    setPlay(true);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(
      "https://guarded-scrubland-88732.herokuapp.com/" + url
    );

    wavesurfer.current.on("ready", () => {
      setPlayerReady(true);
      wavesurfer.current.play();
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });
    wavesurfer.current.on("finish", () => {
      wavesurfer.current.play();
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
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-300">
      <div id="waveform" ref={waveformRef} />
      <div className="flex flex-col h-screen">
        <div className="flex flex-col justify-content items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-300">
          <h1>{playerReady ? "" : "Audio player is loading..."}</h1>
          <div className="controls flex flex-col items-center p-4 w-1/2 sm:w-full h-full">
            <button
              onClick={handlePlayPause}
              className="
            bg-red-500
            hover:bg-red-700
            text-white
            font-bold
            py-6
            border-solid
            border-4 border-light-blue-500
            my-4
            px-4
            rounded-full"
            >
              {!playing ? "Play" : "Pause"}
            </button>
            <div className="flex items-center">
              <input
                type="range"
                id="volume"
                name="volume"
                min="0.01"
                max="1"
                step=".025"
                onChange={onVolumeChange}
                defaultValue={volume}
                className="my-2 mx-3 p-2"
              />
              <label
                htmlFor="volume"
                className="mt-2 text-base p-2 my-2 text-white text-center leading-normal"
              >
                Volume
              </label>
            </div>

            <div className="addNotesSection w-screen sm:w-1/2 h-auto flex flex-col items-center">
              <div className="flex flex-col w-screen sm:w-full h-full">
                <h1 className="p-3">Add notes here:</h1>
                <div className="flex">
                <textarea
                  type="text"
                  value={noteText}
                  placeholder="Write a note..."
                  className="p-3 m-2 placeholder-blueGray-300 w-screen sm:w-full text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                  onChange={(e) => {
                    setNoteText(e.target.value);
                  }}
                ></textarea>
                </div>
              </div>
              <br />
              <button
                className="bg-red-500 max-w-5xl hover:bg-red-700 p-3 mx-2 border-solid
                border-4 border-light-blue-500 text-white font-bold  border border-red-700 rounded"
                onClick={() => {
                  wavesurfer.current.play();
                  setPlay(true);
                  addNote((notes) => [
                    ...notes,
                    {
                      text: noteText,
                      timeStamp: wavesurfer.current.getCurrentTime(),
                    },
                  ]);
                }}
              >
                Add notes
              </button>
            </div>
          </div>

          <div className="NotesSection w-full sm:w-1/2  h-auto p-1 flex flex-col items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-300">
            <div className="flex flex-col h-full w-screen sm:w-full">
              <h1 className="px-3">Notes:</h1>
              {!note.length > 0 ? (
                <h1 className="px-3">No notes available</h1>
              ) : (
                note.map((items) => {
                  return (
                    <div
                      className="bg-white rounded p-3 m-3"
                      key={items.timeStamp}
                      onClick={() => {
                        wavesurfer.current.play(items.timeStamp);
                        setPlay(true);
                      }}
                    >
                      <p className="break-all">Notes : {items.text}</p>
                      <h2>
                        at timestamp : {items.timeStamp.toFixed(2)} seconds
                      </h2>
                      <h3>Click to play from the timestamp</h3>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
