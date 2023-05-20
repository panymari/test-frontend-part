import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {Product} from "../../types";
import styles from './AddProduct.module.scss';
import { useMutation, gql } from '@apollo/client';

interface AddProductProps {
    handleSubmit: (val: Product) => void;
}

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($name: String!, $quantity: Int!) {
    createProduct(name: $name, quantity: $quantity) {
      id
      name
      quantity
    }
  }
`;


export const AddProduct = ({handleSubmit}: AddProductProps) => {
    const [inputName, setInputName] = useState(localStorage.getItem("name") || "");
    const [inputQuantity, setInputQuantity] = useState(Number(localStorage.getItem("quantity")) || 0);

    const [createProduct, { error }] = useMutation(CREATE_PRODUCT_MUTATION);

    useEffect(() => {
        localStorage.setItem("name", inputName);
        localStorage.setItem("quantity", `${inputQuantity}`);
    }, [inputName, inputQuantity]);

    const convertToASCII = (inputString: string) => {
        return inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputName(convertToASCII(value));
    }

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputName.trim() === '') {
            return;
        }

        try {
            const { data } = await createProduct({
                variables: { name: inputName, quantity: inputQuantity },
            });

            const createdProduct = data.createProduct;

            handleSubmit(createdProduct);

            setInputName('');
            setInputQuantity(0);
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    return (
        <form onSubmit={submit} className={styles.formContainer}>
            <div className={styles.inputContainer}>
                <label htmlFor="name">Enter product name:</label>
                <input
                    type="text"
                    name="name"
                    value={inputName || ""}
                    onChange={handleNameChange}
                />
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor="quantity">Enter product quantity:</label>
                <input
                    type="number"
                    name="quantity"
                    value={inputQuantity || 0}
                    onChange={(e) => setInputQuantity(Number(e.target.value))}
                />
            </div>
            <button className={styles.addButton} type="submit">Add</button>
        </form>
    )
}

