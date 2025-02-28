const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbFile = 'cafe.db';


if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log('Deleted existing cafe.db file.');
} else {
    console.log('No existing cafe.db file found.');
}


const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

db.serialize(() => {  //Table for users database
    db.run(`CREATE TABLE IF NOT EXISTS User (          
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT,
        password_hash TEXT NOT NULL,
        address TEXT,
        payment_method TEXT
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Cafe (
        cafe_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        opening_hours TEXT,
        contact_number TEXT
    );`);    //Table for Cafes database

    db.run(`CREATE TABLE IF NOT EXISTS Menu (
        menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cafe_id INTEGER UNIQUE NOT NULL,
        availability_status TEXT,
        FOREIGN KEY (cafe_id) REFERENCES Cafe(cafe_id)
    );`);  //Table for Menus availability status

    db.run(`CREATE TABLE IF NOT EXISTS Coffee (
        coffee_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        cafe_id INTEGER NOT NULL,
        FOREIGN KEY (cafe_id) REFERENCES Cafe(cafe_id)
    );`);  //Table for entering Coffees

    db.run(`CREATE TABLE IF NOT EXISTS Menu_Coffee (
        menu_id INTEGER NOT NULL,
        coffee_id INTEGER NOT NULL,
        PRIMARY KEY (menu_id, coffee_id),
        FOREIGN KEY (menu_id) REFERENCES Menu(menu_id),
        FOREIGN KEY (coffee_id) REFERENCES Coffee(coffee_id)
    );`); //Table for coffee menu // allow flexibility in managing which coffees are available on the menu at a given time, without modifying the Coffees table directly.

    db.run(`CREATE TABLE IF NOT EXISTS Ingredient (
        ingredient_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Coffee_Ingredient (
        coffee_id INTEGER NOT NULL,
        ingredient_id INTEGER NOT NULL,
        PRIMARY KEY (coffee_id, ingredient_id),
        FOREIGN KEY (coffee_id) REFERENCES Coffee(coffee_id),
        FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        cafe_id INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT NOT NULL,
        order_date TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (cafe_id) REFERENCES Cafe(cafe_id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Order_Item (
        order_id INTEGER NOT NULL,
        coffee_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal REAL NOT NULL,
        PRIMARY KEY (order_id, coffee_id),
        FOREIGN KEY (order_id) REFERENCES Orders(order_id),
        FOREIGN KEY (coffee_id) REFERENCES Coffee(coffee_id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Custom_Coffee (
        custom_coffee_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        cafe_id INTEGER NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (cafe_id) REFERENCES Cafe(cafe_id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS Custom_Coffee_Ingredient (
        custom_coffee_id INTEGER NOT NULL,
        ingredient_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (custom_coffee_id, ingredient_id),
        FOREIGN KEY (custom_coffee_id) REFERENCES Custom_Coffee(custom_coffee_id),
        FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
    );`);

    console.log("Tables created successfully.");
});

// Close the database
db.close();