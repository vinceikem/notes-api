# Notes API

A simple and secure RESTful API for managing notes with authentication and authorization using **Node.js, Express, MongoDB, and JWT**.  
This API allows users to register, log in, manage access/refresh tokens, and perform CRUD operations on notes.

---

## Features

- 🔑 User authentication (Register, Login, Refresh Token, Logout)
- 🔒 JWT-based authentication with token versioning
- 📝 Full CRUD support for notes (Create, Read, Update, Delete)
- 👤 User-specific note ownership
- ⏳ Refresh token storage with automatic expiration
- 🛡️ Middleware for validation and security
- 📊 User dashboard with total notes count
- 🗑️ Delete all notes in bulk
- 📦 Rate limiting for authentication routes

---

## Installation

Clone the repository:

```bash
git clone https://github.com/vinceikem/notes-api.git
cd notes-api
```

### Install dependencies:

```bash
npm install
```

### Set up environment variables by creating a .env file in the root:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_JWT_KEY=your_secret_key
```

### Start the server:

```bash
npm start
```


---

## Usage

### The API runs on:

`http://localhost:PORT`

### Default routes:

`/auth` → authentication routes

`/notes` → notes routes

`/me` → get current user info

`/` → test home route (protected)



---

## API Documentation

### Authentication Routes

#### Register

``POST`` `/auth/register`

Body:

```
{
  "username": "john",
  "password": "123456"
}
```

---

### Login

``POST``  `/auth/login`

Body:

```
{
  "username": "john",
  "password": "123456"
}
```

### Response:

```
{
  "success": true,
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```


---

### Refresh Token

``POST`` `/auth/refresh`

Body:

```
{
  "refreshToken": "jwt_refresh_token"
}
```


---

### Logout

``POST`` `/auth/logout`
```
Authorization: Bearer <access_token>
```


---

## User Route

### Get Current User

``GET`` `/me`
```
Authorization: Bearer <access_token>
```

Response:

```
{
  "success": true,
  "id": "userId",
  "username": "john",
  "notesCount": 5
}
```


---

## Notes Routes

`> All routes require authentication.`



### Create Note

``POST`` `/notes`
```
Authorization: Bearer <access_token>
```

Body:

```
{
  "title": "My first note",
  "content": "This is the content of my note."
}
```


---

### Get All Notes

``GET`` `/notes`
```
Authorization: Bearer <access_token>
```


---

### Get Note by ID

``GET`` `/notes/:id`
```
Authorization: Bearer <access_token>
```


---

### Update Note

``PUT`` `/notes/:id`
```
Authorization: Bearer <access_token>
```

Body:

```
{
  "title": "Updated title",
  "content": "Updated content"
}
```


---

### Delete Note

``DELETE`` `/notes/:id`
```
Authorization: Bearer <access_token>
```


---

### Delete All Notes

``DELETE`` `/notes`
```
Authorization: Bearer <access_token>
```


---

## Project Structure
```
notes-api/
│── server.js
│── .env
│── package.json
│
├── controllers/
│   ├── authControllers.js
│   └── notesController.js
│
├── models/
│   ├── user.js
│   ├── note.js
│   └── refreshToken.js
│
├── routes/
│   ├── authRoutes.js
│   └── notesRoutes.js
│
├── middleware/
│   ├── auth.js
│   ├── noteValidator.js
│   └── noteIdValidator.js
│
└── database/
    └── db.js
```

---

## License

##### This project is licensed under the MIT License.
##### Feel free to use and modify it for your own projects.


---

## Author

Developed by **VinceIkem**

## Contact

If you have any questions, suggestions, or issues, feel free to reach out:

- **Author**: Vince Ikem  
- **GitHub**: [@vinceikem](https://github.com/vinceikem)  
- **Email**: vince.ikem@gmail.com  

