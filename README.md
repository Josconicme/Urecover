# U-Recover Mental Health Platform

A comprehensive mental health platform built with React, TypeScript, Node.js, and Supabase. U-Recover connects users with licensed mental health professionals and provides tools for wellness tracking, goal setting, and mental health resources.

## 🏗️ Project Structure

This project is organized into separate frontend and backend applications for better scalability and maintainability:

```
u-recover-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── contexts/        # React Context providers
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── routes/          # API route definitions
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── config/          # Configuration files
│   └── package.json
├── supabase/                 # Database migrations and functions
│   ├── migrations/          # Database schema migrations
│   └── functions/           # Edge functions
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api/v1
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

### Database Setup

1. **Set up Supabase**
   
   The database schema is included in the `supabase/migrations` folder. Run the migrations in your Supabase project:
   
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration files in order

2. **Create Demo Users in Supabase Auth**
   
   After running the migrations, create demo users in Supabase Auth:
   
   **Demo User:**
   - Email: `demo@u-recover.com`
   - Password: `demo123`
   
   **Counsellor Accounts:**
   - Email: `sarah.johnson@u-recover.com`, Password: `counsellor123`
   - Email: `michael.chen@u-recover.com`, Password: `counsellor123`
   - Email: `emily.davis@u-recover.com`, Password: `counsellor123`
   - Email: `james.wilson@u-recover.com`, Password: `counsellor123`

## 🏛️ Architecture

### Frontend Architecture

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** for form handling
- **Axios** for API communication

### Backend Architecture

- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **Winston** for logging
- **Helmet** for security
- **Rate limiting** for API protection
- **JWT** for authentication

### Database Architecture

- **PostgreSQL** (via Supabase)
- **Row Level Security** (RLS) enabled
- **Real-time subscriptions** for live updates
- **Edge functions** for serverless operations

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/signout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Resource Endpoints

- `GET /api/v1/counsellors` - Get all counsellors
- `GET /api/v1/appointments` - Get user appointments
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/wellness` - Get wellness entries
- `POST /api/v1/wellness` - Create wellness entry
- `GET /api/v1/blogs` - Get blog posts
- `GET /api/v1/articles` - Get articles
- `GET /api/v1/resources` - Get resources

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Rate limiting** to prevent abuse
- **CORS protection** with configurable origins
- **Helmet.js** for security headers
- **Input validation** with Joi
- **SQL injection protection** via Supabase
- **Row Level Security** for data access control

## 🚀 Deployment

### Backend Deployment

1. **Build the application**
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Heroku
   - Railway
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk

### Frontend Deployment

1. **Build the application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Monitoring and Logging

- **Winston** for structured logging
- **Morgan** for HTTP request logging
- **Health check** endpoint at `/health`
- **Error tracking** with detailed stack traces

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

1. Check the [documentation](docs/)
2. Open an [issue](issues/)
3. Contact support at support@u-recover.com

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- UI components inspired by modern design systems
- Icons by [Lucide](https://lucide.dev)
- Stock photos from [Pexels](https://pexels.com)

---

**Note**: This is a mental health platform. If you're experiencing a mental health emergency, please contact your local emergency services or a mental health crisis hotline immediately.