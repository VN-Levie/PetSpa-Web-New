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
    const addToCart = (product, quantity = 1) => {
        setCart((prev) => {
            const existingProduct = prev.find((item) => item.id === product.id);
            if (existingProduct) {
                // Tăng số lượng nếu sản phẩm đã tồn tại
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: Math.max(item.quantity + quantity, 1) } // Đảm bảo số lượng không nhỏ hơn 1
                        : item
                );
            }

            // Thêm sản phẩm mới vào giỏ hàng, đảm bảo số lượng >= 1
            return [...prev, { ...product, quantity: Math.max(quantity, 1) }];
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
