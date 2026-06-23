# Mental Health Tracker 🧠💚

A comprehensive mental health tracking application that helps users monitor their mood, maintain a personal journal, and receive AI-powered insights for better mental wellness.

## ✨ Features

- **Mood Tracking**: Log daily moods with visual analytics and trends
- **Personal Journal**: Secure journaling with sentiment analysis
- **AI Assistant**: Get personalized mental health insights powered by Google Gemini AI
- **User Authentication**: Secure login/registration with JWT tokens
- **Email Notifications**: Automated wellness reminders and updates
- **Data Visualization**: Interactive charts and mood analytics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Gemini AI** for intelligent insights
- **Nodemailer** for email functionality
- **bcryptjs** for password hashing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Axios** for API communication
- **React Hook Form** for form handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Edit `backend/.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   
   # Email Configuration (choose one method)
   ETHEREAL_EMAIL=true  # For testing
   # OR configure Gmail/SMTP
   
   # AI Configuration
   GEMINI_API_KEY=your-gemini-api-key
   
   # Frontend URL
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the Application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
mental-health-tracker/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Application pages
│   │   └── assets/      # Static assets
│   └── public/          # Public files
└── README.md
```

## 🔧 Configuration Options

### Email Setup
Choose one of three email methods:

1. **Ethereal Email** (Testing - No setup required)
   ```env
   ETHEREAL_EMAIL=true
   ```

2. **Gmail with OAuth2** (Recommended for production)
   ```env
   GMAIL_CLIENT_ID=your-client-id
   GMAIL_CLIENT_SECRET=your-client-secret
   GMAIL_REFRESH_TOKEN=your-refresh-token
   EMAIL_USER=your-email@gmail.com
   ```

3. **SMTP Provider** (e.g., Mailtrap for testing)
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-username
   EMAIL_PASS=your-password
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Mood Tracking
- `GET /api/mood` - Get user moods
- `POST /api/mood` - Create mood entry
- `PUT /api/mood/:id` - Update mood entry
- `DELETE /api/mood/:id` - Delete mood entry

### Journal
- `GET /api/journal` - Get journal entries
- `POST /api/journal` - Create journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/insights` - Get personalized insights

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers

## 🧪 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new models in `backend/models/`
2. Add controllers in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Create frontend components in `frontend/src/components/`
5. Add pages in `frontend/src/pages/`

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, Railway, etc.)
3. Ensure MongoDB connection is configured for production

### Frontend Deployment
1. Run `npm run build` in the frontend directory
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Update `CLIENT_URL` in backend environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- Google Gemini AI for intelligent insights
- Chart.js for beautiful data visualizations
- Tailwind CSS for responsive design
- The open-source community for amazing tools and libraries

---

**Made with ❤️ for better mental health awareness and support**