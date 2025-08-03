# EduResource - Departmental Resource Checkout System

A full-stack web application for managing departmental resource checkout and monitoring at university/department level.

## 🚀 Features

### For Users (Students/Faculty)
- **Resource Browsing**: Browse available departmental resources with search and filtering
- **Request Management**: Submit checkout requests with purpose and duration
- **Request Tracking**: View status of submitted requests (pending, approved, rejected)
- **Resource Return**: Mark resources as returned when done

### For Administrators
- **Request Approval**: Review and approve/reject user requests
- **Resource Management**: Add, edit, and manage departmental resources
- **Analytics Dashboard**: View comprehensive analytics and usage statistics
- **User Management**: Monitor user activity and resource utilization

### Core Features
- **Role-based Authentication**: Different access levels for students, faculty, and admins
- **Real-time Updates**: Live status updates and notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS and DaisyUI

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Authentication
- **Firebase Authentication** - Secure user authentication and authorization

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eduresource-instrument-checkout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Get your Firebase configuration
   - Update `src/firebase/config.js` with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── Resources/
│   │   └── ResourceList.jsx
│   ├── Requests/
│   │   └── RequestList.jsx
│   ├── Admin/
│   │   ├── AdminRequests.jsx
│   │   └── AdminAnalytics.jsx
│   └── Layout/
│       ├── Navbar.jsx
│       └── Footer.jsx
├── contexts/
│   └── AuthContext.jsx
├── firebase/
│   └── config.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🔐 Authentication & Roles

The system supports three user roles:

1. **Student** - Can browse resources and submit requests
2. **Faculty** - Same as students but may have priority access
3. **Admin** - Can approve/reject requests, manage resources, and view analytics

Role detection is based on email patterns:
- Emails containing "admin" → Admin role
- Emails containing "faculty" → Faculty role
- All others → Student role

## 🎨 UI Components

The application uses DaisyUI components for a consistent and modern look:

- **Cards** - For resource display and statistics
- **Tables** - For request management and analytics
- **Modals** - For detailed views and forms
- **Badges** - For status indicators
- **Buttons** - For actions and navigation
- **Forms** - For user input and data entry

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Email notifications
- [ ] Resource reservation system
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support

---

**Built with ❤️ for educational institutions**
