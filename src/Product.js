import React, { useState, useEffect } from 'react';
import axios from "axios";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleAddProduct = () => {
        axios.post('http://localhost:5000/products', {
            name: newProductName,
            price: newProductPrice
        })
        .then(response => {
            setProducts(response.data);
            setNewProductName('');
            setNewProductPrice('');
        })
        .catch(error => {
            console.error('Error adding product:', error);
        });
    };

    const handleDeleteProduct = (id) => {
        axios.delete(`http://localhost:5000/products/${id}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    };

    const handleUpdateProduct = (id) => {
        const newName = prompt('Enter new name');
        const newPrice = prompt('Enter new price');
        
        if (newName !== null && newPrice !== null) {
            axios.put(`http://localhost:5000/products/${id}`, {
                name: newName,
                price: parseFloat(newPrice)
            })
            .then(response => {
                setProducts(prevProducts => {
                    return prevProducts.map(product => {
                        if (product._id === id) {
                            return {
                                ...product,
                                name: newName,
                                price: parseFloat(newPrice)
                            };
                        }
                        return product;
                    });
                });
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
        }
    };

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        {product.name} - ${product.price}
                        <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                        <button onClick={() => {
                            setSelectedProductId(product._id);
                            handleUpdateProduct(product._id);
                        }}>Update</button>
                    </li>
                ))}
            </ul>
            <input type="text" placeholder="Product Name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
            <input type="number" placeholder="Product Price" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} />
            <button onClick={handleAddProduct}>Add Product</button>
        </div>
    );
};

export default Product;
