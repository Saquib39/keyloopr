# KeyLoopr 🔐

A modern, secure API key management platform built with Next.js 15. KeyLoopr provides a beautiful dark-themed interface for managing, organizing, and securing your API keys across multiple projects with team collaboration features.

## 🚀 Tech Stack

**Frontend:** Next.js 15 (App Router), React 18, Tailwind CSS v4, Framer Motion  
**UI Components:** shadcn/ui, Lucide React  
**Fonts:** Geist Sans & Geist Mono  
**Deployment:** Vercel  

## ✨ Features

🔑 **Secure API Key Management**
- Store and manage API keys with encryption
- Organize keys by projects
- Quick search and filter across all keys
- Track key usage and statistics

👥 **Team Collaboration**
- Invite team members to projects
- Role-based access control (Owner, Admin, Editor, Viewer)
- Manage member permissions
- Accept/decline project invitations

📊 **Dashboard & Analytics**
- Overview of all projects at a glance
- Track recent activities
- View project statistics (keys, members, status)
- Advanced search and filtering

🎨 **Beautiful Dark UI**
- Stunning dark theme with blue-to-purple gradients
- Smooth Framer Motion animations
- Fully responsive design
- Glass morphism effects
- Toast notifications
- Parallax scrolling effects

🔐 **Secure Authentication**
- User login and registration
- Protected dashboard routes
- Session management

## 🌐 Live Demo


🔗 [keyloopr-three.vercel.app](https://keyloopr.vercel.app/)

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Saquib39/keyloopr.git
cd keyloopr
```

### 2. Install Dependencies

Use the following command to install all necessary packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory of the project and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jsonwebtoken_secret_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

🔐 **Note:** Never commit this file to GitHub. It contains sensitive data and should be listed in `.gitignore`.

### 4. Run the Application Locally

Once everything is set up, run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## ✅ You're All Set!

You're now ready to explore, develop, and test KeyLoopr locally. For any contribution, feature request, or issue — feel free to fork and submit a pull request!
