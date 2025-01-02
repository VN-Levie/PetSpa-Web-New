import React, { createContext, useState, useContext } from "react";

// 1. Khởi tạo context
const BookingContext = createContext();

// 2. Provider quản lý trạng thái
export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    selectedServices: [],
    petDetails: {},
    pickupLocation: "",
    paymentInfo: {},
  });

  // Hàm thêm dịch vụ vào booking
  const addService = (service) => {
    setBookingData((prev) => ({
      ...prev,
      selectedServices: [...prev.selectedServices, service],
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
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// 3. Custom hook để sử dụng context dễ dàng
export const useBooking = () => useContext(BookingContext);
