import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { Button } from "@material-ui/core";
import { db } from "../firebase";
import './Post.css'
import firebase from "firebase";

const Post = ({ postId, user,  username, caption, imageUrl }) => {
    const [comments, setComments] = useState([])

    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="img" src="/static/images" />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} />

            <h4 className="post__text"><b>Chintu</b> {caption} </h4>
            <div className="post__comments">
                {comments.map((comment) => (
                    <p className="comment" key={postId}>
                        <strong>{comment.username}</strong> : <p>{comment.text}</p>
                    </p>
                ))}
            </div>
            
            {user && (
                <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Enter a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </Button>
            </form>
            )}

        </div>
    )
}

export default Post
