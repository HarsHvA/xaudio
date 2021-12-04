import { uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import Img from "../../asset/images/home-image.svg";

function Home() {
  let navigate = useNavigate();
  const [audio, setAudio] = useState("");
  const [fileName, setFileName] = useState("No file selected");
  const [progress, setProgress] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const audioStorage = storage.getStorage();
    const fileRef = storage.ref(audioStorage, audio.name);

    const uploadTask = uploadBytesResumable(fileRef, audio);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress("Upload is " + progress + "% done");
        if (progress === 100) {
          setProgress("Loading audio player...");
        }
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          navigate("/audioplayer", { state: downloadURL });
        });
      }
    );
  }

  return (
    <div className="flex items-center p-4 justify-center h-screen">
      <div className="flex items-center p-4 justify-center">
        <img src={Img} alt="HomePageImage" className="h-1/4" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col p-6 m-6 items-center justify-center bg-black bg-opacity-30 rounded-md">
            <div className="flex items-center justify-center bg-grey-lighter">
              <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  Select an audio file
                </span>
                <span className="mt-2 text-xs leading-normal">{fileName}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    let audioFile = e.target.files[0];
                    setAudio(audioFile);
                    setFileName(audioFile.name);
                  }}
                />
              </label>
            </div>
            <div className="flex items-center p-4 justify-center bg-grey-lighter">
              <button
                type="submit"
                className="bg-red-500 h-full w-64 hover:bg-red-700 px-4 py-6 text-white font-bold  border border-red-700 rounded"
              >
                Upload
              </button>
            </div>
            <span className="mt-2 text-s leading-normal text-white">
              {progress}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
