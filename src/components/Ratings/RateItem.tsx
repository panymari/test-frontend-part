import React from 'react';
import {Comment} from "../../types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import styles from "./RatesItem.module.scss";


interface RateItemProps {
    comment: Comment
}

export const RateItem = ({comment}: RateItemProps) => {
    const {name, email, rating, image, message, date} = comment;
    return (
        <li className={styles.commentContainer}>
            <div className={styles.commentWrapper}>
                <div className={styles.infoWrapper}>
                    <div className={styles.userInfoContainer}>
                        <span className={styles.userName}>{name}</span>
                        <span className={styles.userEmail}>{email}</span>
                    </div>
                    <div>
                        {Array.from({length: rating}).map((_, index) => (
                            <FontAwesomeIcon key={index} icon={faStar} size="2x" color="gold"/>
                        ))}
                    </div>
                    <div>{message}</div>
                </div>
                {image &&
                    <div className={styles.frame}><img className={styles.styledImage} src={image} alt="attachment"/>
                    </div>}
            </div>
            <div className={styles.dateWrapper}>
                <span className={styles.commentText}>{date}</span>
            </div>
        </li>
    )
}

