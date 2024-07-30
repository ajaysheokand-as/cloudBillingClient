import React from 'react';
import { CSVLink } from 'react-csv';

const GenerateCSV = () => {
    const items = {
        Beverages: [
            { name: 'Coffee', description: 'Hot / Cold', price: 100 },
            { name: 'Tea', description: 'Hot / Cold', price: 30 },
            { name: 'Juice', description: 'Fresh / Packaged', price: 50 },
            { name: 'Smoothie', description: 'Fruit / Veggie', price: 60 },
            { name: 'Milkshake', description: 'Chocolate / Vanilla', price: 70 },
            { name: 'Soda', description: 'Coke / Pepsi', price: 25 },
        ],
        Desserts: [
            { name: 'Ice Cream', description: 'Vanilla / Chocolate', price: 50 },
            { name: 'Cake', description: 'Slice', price: 500 },
            { name: 'Brownie', description: 'With / Without Nuts', price: 40 },
            { name: 'Pudding', description: 'Chocolate / Vanilla', price: 35 },
            { name: 'Pastry', description: 'Chocolate / Strawberry', price: 45 },
            { name: 'Cookies', description: 'Chocolate Chip / Oatmeal', price: 30 },
        ],
        Snacks: [
            { name: 'French Fries', description: 'Regular / Large', price: 99 },
            { name: 'Nachos', description: 'Cheese / Jalapeno', price: 70 },
            { name: 'Spring Rolls', description: 'Veg / Non-Veg', price: 80 },
            { name: 'Samosa', description: '2 pieces', price: 40 },
        ],
        Sandwiches: [
            { name: 'Veg Sandwich', description: 'Grilled / Plain', price: 60 },
            { name: 'Chicken Sandwich', description: 'Grilled / Plain', price: 80 },
            { name: 'Club Sandwich', description: 'Triple Layer', price: 100 },
            { name: 'Paneer Sandwich', description: 'Grilled / Plain', price: 90 },
        ],
        Pizza: [
            { name: 'Margherita', description: 'Regular / Large', price: 150 },
            { name: 'Pepperoni', description: 'Regular / Large', price: 200 },
            { name: 'Veggie Delight', description: 'Regular / Large', price: 170 },
            { name: 'BBQ Chicken', description: 'Regular / Large', price: 220 },
        ],
        Burgers: [
            { name: 'Veg Burger', description: 'With Cheese / Without Cheese', price: 60 },
            { name: 'Chicken Burger', description: 'With Cheese / Without Cheese', price: 80 },
            { name: 'Cheese Burger', description: 'Double Cheese', price: 100 },
            { name: 'Paneer Burger', description: 'With Cheese / Without Cheese', price: 100 },
        ],
        Rice: [
            { name: 'Fried Rice', description: 'Veg / Non-Veg', price: 90 },
            { name: 'Biryani', description: 'Chicken / Mutton', price: 120 },
            { name: 'Jeera Rice', description: 'With Dal', price: 70 },
            { name: 'Plain Rice', description: 'Steamed', price: 50 },
        ],
        Combos: [
            { name: 'Burger Combo', description: 'Burger + Fries + Drink', price: 150 },
            { name: 'Pizza Combo', description: 'Pizza + Garlic Bread + Drink', price: 200 },
            { name: 'Sandwich Combo', description: 'Sandwich + Chips + Drink', price: 130 },
            { name: 'Rice Combo', description: 'Rice + Curry + Drink', price: 140 },
        ],
    };

    // Convert items to CSV format
    const data = Object.entries(items).reduce((acc, [category, products]) => {
        products.forEach((product, index) => {
            acc.push({
                Category: category,
                'Product Name': product.name,
                Description: product.description,
                Price: product.price,
            });
        });
        return acc;
    }, []);

    const headers = [
        { label: "Category", key: "Category" },
        { label: "Product Name", key: "Product Name" },
        { label: "Description", key: "Description" },
        { label: "Price", key: "Price" },
    ];

    return (
        <div>
            <h1>Generate CSV</h1>
            <CSVLink data={data} headers={headers} filename={"items.csv"}>
                Download CSV
            </CSVLink>
        </div>
    );
};

export default GenerateCSV;
