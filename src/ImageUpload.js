import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { db, storage } from "./firebase";

function ImageUpload({ username }) {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // add the image to db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              imageUrl: url,
              caption: caption,
              username: username,
            });

            setCaption("");
            setProgress(0);
            setImage(null);
          });
        console.log("hello");
      }
    );
  };

  return (
    <div className="image__upload">
      {/* I want to have */}
      {/* Caption input */}
      {/* File picker */}
      {/* Post button */}

      <input
        type="text"
        value={caption}
        placeholder="Enter a caption"
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
      <progress value={progress} max="100" />
    </div>
  );
}

export default ImageUpload;