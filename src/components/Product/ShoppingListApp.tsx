import React, {useState, useCallback, useEffect} from 'react';
import {useQuery, useMutation, gql} from '@apollo/client';
import styles from './ShoppingListApp.module.scss';
import {Product} from "../../types";
import {ShoppingListItem} from "./ShoppingListItem";
import {AddProduct} from "./AddProduct";

const GET_PRODUCTS_QUERY = gql`
  query {
    products(sortBy: DESC) {
      id
      name
      quantity
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
    mutation UpdateProduct($id: Int!, $quantity: Int!) {
      updateProduct(id: $id, quantity: $quantity) {
        quantity
      }
    }
`;

const DELETE_PRODUCT_MUTATION = gql`
    mutation DeleteProduct($id: Int!) {
      deleteProduct(id: $id)
    }
`;

export const ShippingListApp = () => {
    const {data} = useQuery(GET_PRODUCTS_QUERY);


    const [products, setProducts] = useState<Product[]>([]);

    const [updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION);
    const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION);


    useEffect(() => {
        if (data?.products) {
            setProducts(data.products);
        }
    }, [data]);

    const increase = useCallback((product: Product) => {
            const allProducts = [...products];
            const selectedProductIndex = allProducts.findIndex(({id}) => id === product.id);
            if (selectedProductIndex !== -1) {
                const selectedProduct = {...allProducts[selectedProductIndex]};
                ++selectedProduct.quantity;
                allProducts[selectedProductIndex] = selectedProduct;
                updateProduct({variables: {id: selectedProduct.id, quantity: selectedProduct.quantity}});
            }
            setProducts(allProducts);
        },
        [products, updateProduct]
    );

    const decrease = useCallback((product: Product) => {
            const allProducts = [...products];
            const selectedProductIndex = allProducts.findIndex(({id}) => id === product.id);
            if (selectedProductIndex !== -1) {
                const selectedProduct = {...allProducts[selectedProductIndex]};
                --selectedProduct.quantity;
                allProducts[selectedProductIndex] = selectedProduct;
                updateProduct({variables: {id: selectedProduct.id, quantity: selectedProduct.quantity}});
                if (selectedProduct.quantity <= 0) {
                    deleteProduct({variables: {id: selectedProduct.id}});
                    setProducts(allProducts.filter(({id}) => id !== product.id));
                    return;
                }
            }
        },
        [deleteProduct, products, updateProduct]
    );

    const handleSubmit = (product: Product) => {
        setProducts([...products, product]);
    };

    return (
        <div className={styles.mainWrapper}>
            <ul className={styles.productsContainer}>
                {products?.map((product: Product) => (
                    <ShoppingListItem
                        key={product.id}
                        product={product}
                        increase={increase}
                        decrease={decrease}
                    />
                ))}
            </ul>
            <AddProduct handleSubmit={handleSubmit}/>
        </div>
    );
};
