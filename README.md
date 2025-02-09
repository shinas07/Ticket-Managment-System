# Career Path Recommendation System

A full-stack application that helps students identify optimal career paths based on their academic performance and certifications. The system analyzes grade cards and certifications to provide personalized career recommendations and upskilling suggestions.

## System Overview

The Career Path Recommendation System provides:
- Secure user authentication and profile management
- Grade card and certification upload functionality
- Academic performance analysis
- AI-powered career recommendations
- Course suggestions for skill enhancement
- Data visualization of student strengths

## Tech Stack

### Backend
- Django REST Framework
- PostgreSQL Database
- Google Gemini API for AI recommendations
- YouTube API for course suggestions
- JWT Authentication
- Pandas for processing CSV and JSON data

### Frontend
- React with Vite
- Tailwind CSS
- React Router for navigation
- Sonner for notifications
- Context API for state management

## Project Structure

### Backend Structure
```
backend/
├── careerpath/           # Main application
│   ├── views/
│   ├── models/
│   └── urls.py
├── users/               # Authentication and user management
│   ├── views.py
│   ├── models.py
│   └── urls.py
└── config/             # Project configuration
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # Application state management
│   ├── pages/         # Page components
│   │   ├── auth/     # Login and registration
│   │   ├── dashboard/ # User dashboard
│   │   └── recommendations/ # Career recommendations
│   ├── services/     # API integration
│   └── utils/        # Helper functions
├── public/           # Static assets
└── index.html
```

## API Endpoints

### Authentication Endpoints (`/auth/`)
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/logout/` - User logout
- `GET /auth/profile/` - Get user profile

### Career Path Endpoints (`/api/`)
- `POST /api/upload/` - Upload grade cards and certifications
- `GET /api/recommendations/` - Get career recommendations
- `GET /api/courses/` - Get recommended courses
- `GET /api/analysis/` - Get academic performance analysis

## Features

### User Authentication
- Secure registration and login system
- JWT-based authentication
- Protected routes for authenticated users

### File Upload
- Support for CSV/JSON file formats
- Grade card data validation
- Certification verification
- Progress tracking during upload

## Environment Configuration

### Backend (.env)
```env
# Database Configuration
DB_NAME=career_recommendation
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# API Keys
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key

# Django Settings
DEBUG=True
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1
```


## Setup Instructions

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Security Considerations

- Secure file upload validation
- JWT token expiration and refresh
- CORS configuration
- Input sanitization
- Secure storage of API keys
- Data encryption


## 📂 Sample Data

The `sample_data/` directory contains test data used for evaluating the career recommendation system.

### 📁 Structure

### Grade Card Format (CSV)
```csv
subject,score,semester
Mathematics,95,1
Computer Science,88,1
Physics,92,1
```

### Certification Format (JSON)
```json
{
  "certifications": [
    {
      "name": "Python Programming",
      "issuer": "Coursera",
      "date": "2024-01-15"
    }
  ]
}
```

## Future Enhancements

- Machine learning model integration

---

For additional support or contributions, please create an issue or submit a pull request.
