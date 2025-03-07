const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('cafe.db');
const coffees = JSON.parse(fs.readFileSync('coffees.json', 'utf8'));

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO Coffee (name, price, description, cafe_id) VALUES (?, ?, ?, ?)");
    
    let pendingChecks = coffees.length;

    coffees.forEach(coffee => {
        db.get("SELECT coffee_id FROM Coffee WHERE name = ? AND cafe_id = ?", [coffee.name, coffee.cafe_id], (err, row) => {
            if (err) {
                console.error("Error checking coffee:", err);
            } else if (!row) { 
                stmt.run(coffee.name, coffee.price, coffee.description, coffee.cafe_id);
            } else {
                console.log(`Skipping existing coffee: ${coffee.name} at Cafe ID: ${coffee.cafe_id}`);
            }

            pendingChecks--;
            if (pendingChecks === 0) {
                stmt.finalize(() => {
                    console.log("Coffees inserted successfully!");
                    db.close();
                });
            }
        });
    });
});
