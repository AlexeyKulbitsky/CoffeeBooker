const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('cafe.db');
const cafes = JSON.parse(fs.readFileSync('cafes.json', 'utf8'));

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO Cafe (cafe_id, name, location, opening_hours, contact_number) VALUES (?, ?, ?, ?, ?)");
    
    let pendingChecks = cafes.length; 

    cafes.forEach(cafe => {
        db.get("SELECT cafe_id FROM Cafe WHERE cafe_id = ?", [cafe.cafe_id], (err, row) => {
            if (err) {
                console.error("Error checking cafe:", err);
            } else if (!row) { 
                stmt.run(cafe.cafe_id, cafe.name, cafe.location, cafe.opening_hours, cafe.contact_number);
            } else {
                console.log(`Skipping existing cafe with ID: ${cafe.cafe_id}`);
            }

            
            pendingChecks--;
            if (pendingChecks === 0) {
                stmt.finalize(() => {
                    console.log("Cafes inserted successfully!");
                    db.close();
                });
            }
        });
    });
});
