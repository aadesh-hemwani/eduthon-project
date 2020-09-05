## This is a React and Flask project

**Steps To run React**
1. Navigate to front-end folder.
2. run the command ```npm install```.      //this would install all the dependencies required for the front-end.
3. run the app by the command ```npm start```.


**Stepts to run Flask**
1. Navigate to back-end folder.
2. Install all the dependencies required by the command "pip install -r requirements.txt".
3. run the app by the following 4 commands:
```
	 set FLASK_APP=manage.py
	 
	 set FLASK_DEBUG=1
	 
	 set FLASK_ENV=developement
	 
	 flask run
```
4. After running if it shows some dependencies are missing please install it manually and also add it in the requirements.txt.


**Stepts to migrate database**

1. Install: pip install Flask-Migrate.
2. Import: from flask_migrate import Migrate. (in __init__.py)
3. run 3 commands
	a. flask db init
	b. flask db migrate -m "Initial migration."
	c. flask db upgrade
