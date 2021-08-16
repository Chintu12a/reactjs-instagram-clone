import React, { Component, useState, useEffect } from "react";
import './App.css';
import Post from './componants/Post';
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { auth, db } from './firebase';
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./ImageUpload";


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const isSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in...
        console.log(authUser)
        setUser(authUser);

      }
      else {
        // user logged out...
        setUser(null)
      }
    });
    return () => (
      isSub()
    )
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })))
    })
  }, [posts])

  const signUp = (e) => {
    e.preventDefault()

    auth.
      createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message))
    // setOpen(false)
  }

  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }



  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <form className="app__signup">
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
              />
              <br />
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </center>
        </div>
      </Modal>


      {/* Sign In Modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <form className="app__signin">
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
              />
              <br />

              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </center>
        </div>
      </Modal>


      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ) : (
          <div className="login__container">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app__posts">
        {
          posts.map(({ id, post }) => {
            return <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          })
        }
      </div>
      {user?.displayName ? (
      <ImageUpload username={user.displayName} />) : (
        <h3>Login To</h3>
      )
    }
    </div>
  );
}

export default App;
