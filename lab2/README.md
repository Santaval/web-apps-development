# Student Management System

A simple web application for managing student records built with Node.js, Express.js, and vanilla JavaScript.

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Santaval/web-apps-development.git
cd web-apps-development/lab2
```

2. Install dependencies:
```bash
npm install
```

3. Create an environment file:
   - Copy the example environment file:
   ```bash
   cp example.env .env
   ```
   - Update the environment variables in `.env` if needed

## Running the Server

1. Start the development server:
```bash
npm run dev
```

2. The server will start running at `http://localhost:3000` (or the port specified in your .env file)

## Features

- View list of students
- Add new students
- Update existing student information
- Delete students
- Form validation
- Responsive design

## Project Structure

```
lab2/
├── src/
│   ├── controllers/       # Request handlers
│   ├── data/             # JSON data storage
│   ├── models/           # Data models
│   ├── public/           # Static files (HTML, CSS, JS)
│   ├── repositories/     # Data access layer
│   ├── routes/           # API routes
│   ├── schemas/          # Validation schemas
│   └── utils/            # Utility functions
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## API Endpoints

- `GET /students` - Get all students
- `GET /students/:id` - Get a specific student
- `POST /students` - Create a new student
- `PUT /students/:id` - Update a student
- `DELETE /students/:id` - Delete a student

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.