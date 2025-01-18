# Ticket Management System

## Overview
The Ticket Management System is a web application that allows users to raise support tickets, view their status, and enables administrators to manage these tickets (assign, resolve, etc.). This project consists of a Django backend and a React frontend.

## Features
- **User Authentication**: Basic user authentication using Django's built-in authentication system.
- **Ticket Management**: Users can create, view, update, and delete their own tickets. Administrators have full access to all tickets.
- **Filtering**: Users can filter tickets by status and priority.
- **Responsive Design**: The application is designed to be user-friendly and responsive.

## Technologies Used
- **Backend**: Django, Django REST Framework
- **Frontend**: React, Axios 
- **Database**: postgresql
- **Authentication**: Django's built-in authentication system

## API Endpoints
### Tickets
- **GET /tickets/**: Returns a list of all tickets. Include filters for status, priority, and user.
- **GET /tickets/{id}/**: Returns the details of a specific ticket.
- **PUT /tickets/{id}/**: Allows updating a ticket’s details (e.g., updating the status or reassigning the ticket).
- **DELETE /tickets/{id}/**: Allows deleting a ticket.

## Local Setup

### Prerequisites
- Python 3.x
- Node.js and npm
- Django
- Django REST Framework

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ticket-management-system.git
   cd ticket-management-system/backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser** (for admin access):
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the server**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

### Accessing the Application
- The backend will be running at `http://127.0.0.1:8000/`
- The frontend will be running at `http://localhost:5173/`

### Testing the Application
- You can test the API endpoints using tools like Postman or directly from the frontend application.

## Documentation
- Ensure to check the code comments for detailed explanations of the implementation.
- For any issues or feature requests, please open an issue in the GitHub repository.
