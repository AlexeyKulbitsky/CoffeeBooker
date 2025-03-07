const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('cafe.db');
const menuCoffees = JSON.parse(fs.readFileSync('menu_coffees.json', 'utf8'));

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO Menu_Coffee (menu_id, coffee_id) VALUES (?, ?)");

    let pendingChecks = menuCoffees.length;

    menuCoffees.forEach(menuCoffee => {
        db.get("SELECT * FROM Menu_Coffee WHERE menu_id = ? AND coffee_id = ?", 
        [menuCoffee.menu_id, menuCoffee.coffee_id], (err, row) => {
            if (err) {
                console.error("Error checking Menu_Coffee:", err);
            } else if (!row) { 
                stmt.run(menuCoffee.menu_id, menuCoffee.coffee_id);
            } else {
                console.log(`Skipping existing Menu-Coffee relation: Menu ID ${menuCoffee.menu_id}, Coffee ID ${menuCoffee.coffee_id}`);
            }

            pendingChecks--;
            if (pendingChecks === 0) {
                stmt.finalize(() => {
                    console.log("Menu-Coffee relationships inserted successfully!");
                    db.close();
                });
            }
        });
    });
});