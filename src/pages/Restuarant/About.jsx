import React from "react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 rounded-tl-3xl rounded-tr-3xl">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-[#37A9C8] mb-6">About Food Heaven</h1>
        <p className="text-gray-700 text-lg mb-4">
          Welcome to <span className="font-semibold">Food Heaven</span>! We believe great food brings people together. 
          Our passion is to serve delicious meals made with the freshest ingredients and a touch of love in every bite.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          From sizzling burgers, cheesy pizzas, and crispy fries to savory wraps and flavorful pastas, our menu is designed to satisfy every craving.
          Whether you’re here for a quick snack or a hearty meal, <span className="font-semibold">Food Heaven</span> promises a delightful dining experience for everyone.
        </p>
        <p className="text-gray-700 text-lg">
          Come and taste the magic! Your satisfaction is our top priority.
        </p>
      </div>
    </div>
  );
}
