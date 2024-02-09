# Twitter API (Node JS version)

## Prerequisites
### Download XAMPP
1. If you do not have it installed already, please install XAMPP. You can do so by going to by clicking this link https://www.apachefriends.org/
2. Follow the onscreen directions to install the program.
3. Once it is installed, run the XAMPP application. (It is recommended that you are an administrator)

### Creating the Facebook database
1. Click the "Start" button beside "Apache" and "MySQL".
2. Click the "Admin" button beside "MySQL", it will take you to the phpMyAdmin website.
3. Click the "New" link  on the left sidebar
4. Type "twitter" (not case-sensitive) in the "Database name" textbox.
5. Click the "Create" button
6. Copy contents from "twitter.sql" file and paste into the "SQL" tab.
7. Click the "Go" button.

### Download the source code
1. Either download or clone the git repository to the local machine.

### Additional files
1. You will need to create a file called ".env" (case-sensitive) in the root directory.
2. Copy the following code and place it in the newly created file.

#### .env
```.env

DEV_PORT = your port(number)
DEV_DB_HOST = 'your host'
DEV_DB_USER_NAME = 'your username'
DEV_DB_PASSWORD = 'your password'
DEV_DATABASE = 'twitter'

SECRET_KEY = 'Your secret key'
REFRESH_KEY = 'Your secret key for refresh token'

```

### Usage
In a terminal of some kind.
1. Go the root directory.
2. Type "npm start"