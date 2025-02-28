const sqlite3 = require('sqlite3').verbose();

// Open database connection
const db = new sqlite3.Database('cafe.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Insert dummy data
db.serialize(() => {
    db.run(`INSERT INTO User (name, email, phone_number, password_hash, address, payment_method) 
            VALUES ('John Doe', 'john@example.com', '1234567890', 'hashed_password', '123 Coffee Street', 'Credit Card')`);

    db.run(`INSERT INTO Cafe (name, location, opening_hours, contact_number) 
            VALUES ('Central Perk', 'Downtown', '8 AM - 10 PM', '9876543210')`);

    db.run(`INSERT INTO Coffee (name, price, description, cafe_id) 
            VALUES ('Espresso', 2.50, 'Strong black coffee', 1)`);

    db.run(`INSERT INTO Menu (cafe_id, availability_status) 
            VALUES (1, 'Available')`);

    console.log('Dummy data inserted successfully!');
});

// Close database connection
db.close();
