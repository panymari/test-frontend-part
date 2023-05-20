import React, {useEffect, useState} from 'react';
import {FeedbackForm} from './FeedbackForm';
import styles from './RatesApp.module.scss';
import {gql, useQuery} from '@apollo/client';
import {Comment, Product} from '../../types';
import {RateItem} from "./RateItem";


const GET_COMMENTS_QUERY = gql`
  query GetComments($sortBy: SortingEnumComment) {
    comments(sortBy: $sortBy) {
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

export const RatesApp = () => {
    const [sortBy, setSortBy] = useState('date');

    const {data, refetch} = useQuery(GET_COMMENTS_QUERY, {
        variables: {sortBy},
    });

    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
      refetch({sortBy})
    }, [refetch, sortBy]);


    useEffect(() => {
        if (data?.comments ) {
            setComments(data.comments);
        }
    }, [data]);


    const handleChangeSort = (sortType: string) => {
        setSortBy(sortType);
    };

    return (
        <div className={styles.mainWrapper}>
            <FeedbackForm comments={comments} setComments={setComments} />
            <div>
                <div className={styles.buttonsContainer}>
                    <button className={`${styles.sortButton} ${sortBy === 'rating' ? styles.activeButton : ''}`}
                            onClick={() => handleChangeSort('rating')}>Sort by rate
                    </button>
                    <button className={`${styles.sortButton} ${sortBy === 'date' ? styles.activeButton : ''}`}
                            onClick={() => handleChangeSort('date')}>Sort by date
                    </button>
                </div>
                <ul className={styles.commentsWrapper}>
                    {comments.map((comment: Comment) => (
                        <RateItem comment={comment} key={comment.id}/>
                    ))}
                </ul>
            </div>
        </div>
    );
};
