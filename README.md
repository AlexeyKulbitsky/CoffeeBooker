User Guide
Coffee Booker allows you to pre-order and book coffees of your choice from a cafe you choose.
It allows you to view your products nutritional values, how long it'll take for the coffee
to brew and how far away the cafe is from your GPS location. Its not only a coffee booking app
It also allows you to browse cafes based on your liking by giving you a selection of filters
you can apply to refine your search for a cafe.

The app uses HTML, CSS and Javascript for its front end. This will later be adapted to work
on React framework for iOS and Android alike. The login and registration page have user authentication built into them. This uses flask to achieve this functionality. Its a framework
where we used python to implement it. Javascript is used to populate databases for the product
These databases are dummy databases as in they don't hold any meaningful data, they hold
placeholder values for the application to use. Functionality regarding the use of these is
to be done. 

The app has a responsive UI that works well with iOS view. To achieve this, open the application
on your browser and from Developer Tools (F12 to open them), switch the view from the top to
iPhone 11 or later models to view the app as intended. 

For installation
1. git clone https://github.com/AlexeyKulbitsky/CoffeeBooker
2. Open a browser of your choice
3. Navigate to the CoffeeBooker repo, choose any .html page that is not
login, registration or start and then from your choice and open it in any browser
4. For complete view, open developer tools (F12) and change the view to iPhone 11 or later models

If using VSCode,
1. git clone https://github.com/AlexeyKulbitsky/CoffeeBooker
2. Open the folder in VSCode
3. Head to any .html page that that is not
login, registration or start and then from your choice and open it in any browser
4. Install the Live Server extension.
5. Right-click any html page, right click, select Open with Live Server

For Authentication
1. git clone https://github.com/AlexeyKulbitsky/CoffeeBooker
2. Open the login or registration html pages.
3. Register yourself
4. Open the login page, enter your details to login

Navigation through the application should be straight forward and intuitive. Should be easily
navigable.

Technologies Used
Python and Flask
Visily
Figma
HTML
CSS
Javascript
SQLite


Folder Structure
/project-folder
|-/assets
|  |--/account settings
|  |--/cafeinfo
|  |--/..(other assets)
|-/registration_page
|  |--/index.css
|  |--/registration.html
|-/login_page
|  |--/index.css
|  |--/login.html
|-/mapview(tbd)
|  |--/mapview.html
|  |--/index.css
|-universalcss.css
|-/other folders(long list)
|-/applist
|  |--/assets
|  |--/list_page
|     |--/index.css
|     |--/listview.html
|  |--/other folders(long list)