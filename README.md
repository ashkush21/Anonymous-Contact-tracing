# CSIproject

Webapp to display all the events, SIGs happening in college
* The site uses heroku for hosting and mLab for the database.
* Please "npm install" all the packages mentioned in the package.json before running the webapp
* How to run this web app locally:-
    1. Fork this repository. Then clone the forked version using "$ git clone <repository url>"
    2. Then "$ cd CSIproject". Install all dependencies using "npm install"
    3. Run "$ node app.js". Now the web app will be deployed at "localhost:5000".
    4. Open browser and type "localhost:5000" in the url bar.

* Here's a link to its deployment in heroku - https://obscure-forest-84435.herokuapp.com/

# Features of the site:

* User can post an event if and only if he is logged in otherwise user will be redirected to login page.
* User can see the comments and posts even he is not logged in but won't be able to write a comment if not logged in.
* The events will be dynamically filtered and displayed on the main page according to their date of occurrence.
* The events thus created can only be modifyied by user who created it and that too before the event's date.
* If the date passes, the only option the user will be left with will be to delete the event.
* The comments in each event can only be deleted and edited by the person who created it.

