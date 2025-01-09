import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Khởi tạo context
const CartContext = createContext();

// 2. Provider quản lý trạng thái
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = (product) => {
        setCart((prev) => {
            const existingProduct = prev.find((item) => item.id === product.id);
            if (existingProduct) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
                );
            }
            return [...prev, product];
        });
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    const updateQuantity = (productId, quantity) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((product) => product.id !== productId));
    };

    // Hàm xóa tất cả sản phẩm khỏi giỏ hàng
    const clearCart = () => {
        setCart([]);
    };

    //đếm số lượng sản phẩm trong giỏ hàng
    const countCartItems = () => {
        return cart.reduce((count, product) => count + product.quantity, 0);
    };


    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, countCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Custom hook để sử dụng context dễ dàng
export const useCart = () => useContext(CartContext);
