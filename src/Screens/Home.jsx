import { uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../Firebase";
import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();
  const [audio, setAudio] = useState("");

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
        console.log("Upload is " + progress + "% done");
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
    <div>
      <center>
        <form onSubmit={onSubmit}>
          <input
            type="file"
            onChange={(e) => {
              setAudio(e.target.files[0]);
            }}
          />
          <button type="submit">Upload</button>
        </form>
      </center>
    </div>
  );
}

export default Home;