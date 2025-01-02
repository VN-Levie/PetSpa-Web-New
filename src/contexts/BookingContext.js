import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Khởi tạo context
const BookingContext = createContext();

// 2. Provider quản lý trạng thái
export const BookingProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState(() => {
        const savedData = localStorage.getItem("bookingData");
        return savedData ? JSON.parse(savedData) : {
            selectedServices: [],
            petDetails: {},
            pickupLocation: "",
            paymentInfo: {},
        };
    });

    useEffect(() => {
        localStorage.setItem("bookingData", JSON.stringify(bookingData));
    }, [bookingData]);

    // Hàm thêm dịch vụ vào booking
    const addService = (service) => {
        setBookingData((prev) => ({
            ...prev,
            selectedServices: [...prev.selectedServices, service],
        }));
    };

    // Hàm thêm dịch vụ vào giỏ hàng
    const addServiceToCart = (serviceId, name, price, note) => {
        setBookingData((prev) => ({
            ...prev,
            selectedServices: [...prev.selectedServices, { serviceId, name, price, note }],
        }));
    };

    // Hàm xóa dịch vụ khỏi giỏ hàng
    const removeServiceFromCart = (serviceId) => {
        setBookingData((prev) => ({
            ...prev,
            selectedServices: prev.selectedServices.filter(service => service.serviceId !== serviceId),
        }));
    };

    // Hàm xóa tất cả dịch vụ khỏi giỏ hàng
    const clearAllServices = () => {
        setBookingData((prev) => ({
            ...prev,
            selectedServices: [],
        }));
    };

    // Hàm cập nhật chi tiết thú cưng
    const updatePetDetails = (details) => {
        setBookingData((prev) => ({
            ...prev,
            petDetails: details,
        }));
    };

    // Hàm cập nhật địa điểm đón/trả
    const setPickupLocation = (location) => {
        setBookingData((prev) => ({
            ...prev,
            pickupLocation: location,
        }));
    };

    // Hàm reset trạng thái booking (sau khi hoàn tất)
    const resetBooking = () => {
        setBookingData({
            selectedServices: [],
            petDetails: {},
            pickupLocation: "",
            paymentInfo: {},
        });
    };

    return (
        <BookingContext.Provider
            value={{
                bookingData,
                addService,
                updatePetDetails,
                setPickupLocation,
                resetBooking,
                addServiceToCart,
                removeServiceFromCart,
                clearAllServices,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

// 3. Custom hook để sử dụng context dễ dàng
export const useBooking = () => useContext(BookingContext);
