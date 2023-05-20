import React from 'react';
import {Product} from "../../types";
import styles from './ShoppingListItem.module.scss';

interface ShoppingListItemProps {
    product: Product,
    increase: (val: Product) => void;
    decrease: (val: Product) => void;
}
export const ShoppingListItem = ({product, increase, decrease}: ShoppingListItemProps) => {
    const {name, quantity} = product;
    return (
        <li className={styles.productsItemWrapper}>
            <div className={styles.columnContainer}>
                <span>name: {name}</span>
                <span>quantity: {quantity}</span>
            </div>
            <div className={styles.columnContainer}>
                <button className={styles.styledButton} onClick={() => increase(product)}>+</button>
                <button className={styles.styledButton} onClick={() => decrease(product)}>-</button>
            </div>
        </li>
    )
}

