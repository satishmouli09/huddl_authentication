# HUDDL Authentication

Authentication Service using Google OAuth2

## Quick Start

``` bash
# Install dependencies
npm install

# Source environment varibales
source keys.sh

# Serve on localhost:3000
npm start
```

### Getting started using dockerfile

``` bash
# Build dockerfile
docker build -t <any_container_name> .

# Run docker
docker run -p 3000:3000 -d <your_container_name>

Server will be running on localhost:3000

```

### How the application works

The following is the flow for the application

#### Welcome page
```
The Welcome page will give you an option to Login
When Login button is clicked, you will be redirected to login page
If the user is already logged in, he will be redirected to home page
```

#### Login page
```
The Login page gives an option to Login with google
When clicked, you will be redirected to Google Auth page
```

* If the user exists and is whitelisted, they will be redirected to home page.
* If the user exists but is not whitelisted, they will be redirected to the error page.
* If the user doesn't exist, a record will be created storing email(the user will not be whitelisted by default) and then they will be redirected to the error page.


#### Home page
```
The Home page gives a short description and has an option to go to Users tab
When users tab is clicked, you will redirected to Users page
When Logout is clicked, you will be redirected to Welcome page
```

#### Users page
```
The Users page displays the list of all users in a table form
You can whitelist and blacklist users based on their current status
You cannot blacklist yourself
```

## Authors

*  [Satish Mouli](https://github.com/satishmouli09)

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
