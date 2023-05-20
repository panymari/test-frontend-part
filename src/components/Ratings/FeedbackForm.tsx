import React, {ChangeEvent, useState} from 'react';
import { useMutation, gql } from '@apollo/client';
import styles from './FeedbackForm.module.scss';
import {Comment} from "../../types";

const ADD_COMMENT_MUTATION = gql`
  mutation CreateComment(
    $name: String!
    $email: String!
    $rating: Int!
    $image: String!
    $message: String!
    $date: String!
  ) {
    createComment(
      name: $name
      email: $email
      rating: $rating
      image: $image
      message: $message
      date: $date
    ) {
      id
      name
      email
      rating
      image
      message
      date
    }
  }
`;

interface FeedbackFormProps {
    comments: Comment[],
    setComments: (val: Comment[]) => void;
}

export const FeedbackForm = ({comments, setComments}: FeedbackFormProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(0);
    const [image, setImage] = useState('');
    const [message, setMessage] = useState('');

    const [addComment] = useMutation(ADD_COMMENT_MUTATION);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        try {
            const { data } = await addComment({
                variables: {
                    name,
                    email,
                    rating,
                    image,
                    message,
                    date: currentDate,
                },
            });

            const newComment = data.createComment;

            setComments([newComment, ...comments]);

            setName('');
            setEmail('');
            setRating(0);
            setImage('');
            setMessage('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const convertBase64 = (file: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                if (fileReader.result) {
                    resolve(fileReader.result.toString());
                }
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (file) {
            const base64 = await convertBase64(file);
            setImage(base64);
        }
    };

    return (
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.inputName}>Name</label>
                <input
                    required
                    type="text"
                    className={styles.formControl}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.inputName}>Email</label>
                <input
                    required
                    type="email"
                    className={styles.formControl}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <select
                    required
                    className={styles.formControl}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                >
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                </select>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.inputName}>Attachments</label>
                <div className={styles.fileUploadWrapper}>
                    <input
                        type="file"
                        name="attachments"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.inputName}>Message</label>
                <textarea
                    className={`${styles.formControl} ${styles.styledTextArea}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>
            <input type="submit" name="send" value="Add comment" className={styles.submitButton} />
        </form>
    );
};