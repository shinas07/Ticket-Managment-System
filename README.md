# Ticket Management System

A full-stack ticket management solution built with Django REST Framework and React. This system allows users to create, manage and track support tickets while providing administrators with comprehensive ticket management capabilities.

## Overview

The Ticket Management System provides a streamlined interface for:
- Users to create and track support tickets
- Administrators to manage and resolve tickets
- Real-time status updates and priority management
- Secure authentication and authorization
- User management with blocking capabilities

## Features

### User Features
- Secure authentication system with JWT
- Create and manage support tickets
- Track ticket status and updates
- Filter and sort tickets
- Update ticket information
- Personal profile management

### Admin Features
- Comprehensive dashboard for ticket management
- User creation and management
- Block/unblock users
- Assign tickets to users
- Update ticket status and priority
- Access to all tickets in the system
- User listing and management capabilities

## Tech Stack

### Backend
- Django REST Framework
- PostgreSQL
- Simple JWT for authentication
- Django CORS headers

### Frontend
- React (Vite)
- Tailwind CSS for styling
- Axios for API integration
- React Router for navigation
- Context API for state management

## Project Structure

### Backend Structure
```
tickets_system/
├── accounts/              # User authentication and management
├── tickets/              # Ticket management application
└── tickets_system/       # Main project directory
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

### Frontend Structure
```
src/
├── components/           # Reusable UI components
├── context/             # Context providers and hooks
├── pages/               # Page components
│   ├── public/          # Public pages (login, landing)
│   ├── user/            # User dashboard and features
│   └── admin/           # Admin dashboard and management
├── routes/              # Route configurations
├── services/            # API service integrations
└── utils/               # Utility functions and helpers
```

## API Endpoints

### Authentication Endpoints (`/auth/`)
- `POST /auth/login/` - User login
- `POST /auth/refresh/` - Refresh access token
- `POST /auth/logout/` - User logout
- `GET /auth/profile/` - Get user profile
- `POST /auth/users/create/` - Create new user (admin only)
- `GET /auth/users/list/` - List all users (admin only)
- `POST /auth/users/block/` - Block/unblock user (admin only)

### Ticket Endpoints (`/api/tickets/`)
- `GET /api/tickets/` - List all tickets (filterable)
- `POST /api/tickets/` - Create new ticket
- `GET /api/tickets/<id>/` - Get specific ticket
- `PUT /api/tickets/<id>/` - Update ticket
- `DELETE /api/tickets/<id>/` - Delete ticket
- `PATCH /api/tickets/<id>/status/` - Update ticket status
- `PATCH /api/tickets/<id>/assign/` - Assign ticket to user

## Pages and Navigation

### Public Pages
- `/` - Landing page with system overview
- `/login` - User authentication page

### User Pages
- `/dashboard` - User dashboard showing their tickets
- `/tickets/new` - Create new ticket
- `/tickets/:id` - View ticket details
- `/profile` - User profile management

### Admin Pages
- `/admin/dashboard` - Admin dashboard with analytics
- `/admin/tickets` - All tickets management
- `/admin/users` - User management
- `/admin/reports` - System reports and statistics

## Setup Instructions

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/shinas07/Ticket-Managment-System.git
cd Ticket-Managment-System
```

2. Create and activate virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file with the following configuration:
```env
# General Settings
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CORS_ALLOW_CREDENTIALS=True

# Django Secret Key (replace with a unique one in production)
SECRET_KEY=your_unique_secret_key_here

# Database Configuration 
DB_NAME=ticket_system_db
DB_USER=your_db_user_here
DB_PASSWORD=your_db_password_here
DB_HOST=localhost
DB_PORT=5432

```

5. Setup database:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Run the server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_APP_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

## URL Configuration

### Backend URLs
```python
# Main URLs (urls.py)
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('api/', include(router.urls)),
]

# Auth URLs (accounts/urls.py)
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/create/', UserCreateView.as_view(), name='user-create'),
    path('users/list/', UserListView.as_view(), name='user-list'),
    path('users/block/', BlockUserView.as_view(), name='block-user'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
]
```
## Deployment

The application is designed to be deployed on any hosting platform that supports Django and React applications. Make sure to:

1. Set appropriate environment variables
2. Configure CORS settings
3. Setup database connections
4. Configure static file serving
5. Enable HTTPS
6. Set up proper security headers
7. Configure domain settings

## Security Considerations

- All endpoints except login and refresh are protected with JWT authentication
- Admin endpoints require specific permissions
- Password hashing is handled by Django's authentication system
- CORS is configured to allow only specific origins
- Debug mode should be disabled in production
- Database credentials should be properly secured
- API rate limiting should be implemented

---

Built with Django REST Framework and React. For additional help or contributions, please open an issue or submit a pull request.