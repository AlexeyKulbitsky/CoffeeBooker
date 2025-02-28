const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('cafe.db');
const menus = JSON.parse(fs.readFileSync('menus.json', 'utf8'));

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO Menu (cafe_id, availability_status) VALUES (?, ?)");
    
    let pendingChecks = menus.length;

    menus.forEach(menu => {
        db.get("SELECT cafe_id FROM Cafe WHERE cafe_id = ?", [menu.cafe_id], (err, cafeRow) => {
            if (err) {
                console.error("Error checking cafe existence:", err);
            } else if (!cafeRow) {
                console.log(`Skipping menu insertion: No cafe found with ID ${menu.cafe_id}`);
            } else {
                db.get("SELECT menu_id FROM Menu WHERE cafe_id = ?", [menu.cafe_id], (err, menuRow) => {
                    if (err) {
                        console.error("Error checking existing menu:", err);
                    } else if (!menuRow) {
                        stmt.run(menu.cafe_id, menu.availability_status);
                    } else {
                        console.log(`Skipping existing menu for cafe ID: ${menu.cafe_id}`);
                    }

                    pendingChecks--;
                    if (pendingChecks === 0) {
                        stmt.finalize(() => {
                            console.log("Menus inserted successfully!");
                            db.close();
                        });
                    }
                });
            }
        });
    });
});