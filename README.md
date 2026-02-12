# Chongkran Frontend (Nuxt 4)

This is the frontend of the Chongkran recipe web application built using **Nuxt 4**. It allows users to browse, create, and manage recipes while integrating with a NestJS backend API.

## 🚀 Features

- 🏠 Home Page: View featured and popular recipes
- 🔍 Search & Filters: Search recipes by name, category, and ingredients
- 📜 Recipe Details: View detailed recipe information with steps, ingredients, and reviews
- 📝 Create & Manage Recipes: Authenticated users can add, edit, and delete their own recipes
- ❤️ Favorites: Save recipes for easy access
- 🛒 Shopping List: Generate shopping lists based on selected recipes
- 📅 Meal Planner: Plan meals for the week
- 🔑 Authentication: User registration, login, and profile management
- 📢 Notifications: Receive updates when recipes are approved or commented on
- 🎨 Rich Text Editor: TipTap integration for recipe creation
- 📱 Responsive Design: Mobile-first approach with dark mode support

---

## 🏗️ Tech Stack

- **Nuxt 4** - Vue.js framework with hybrid rendering
- **Vue 3** - Progressive JavaScript framework
- **Tailwind CSS v4** - Utility-first CSS framework
- **Nuxt UI v4** - UI component library built on Tailwind
- **@nuxt/image** - Image optimization
- **@vueuse/motion** - Motion animations
- **@vueuse/nuxt** - Vue utility functions
- **@tiptap** - Rich text editor
- **Sentry** - Error monitoring
- **TypeScript** - Full TypeScript support

---

## 📦 Installation

### Prerequisites

- **Node.js** (v22 or later)
- **pnpm** (recommended) or npm/yarn
- **Backend API** running (see Backend Setup section)

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/SethyRung/Chongkran-Frontend.git
cd Chongkran-Frontend
```

### 2️⃣ Install Dependencies

```sh
pnpm install
# or
npm install
# or
yarn install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the project root and configure it:

```env
# Environment
ENV="dev" # or "production"

# Backend API Configuration
NUXT_API_BASE_URL="http://localhost:8080" # Your backend API URL

# Authentication Tokens
NUXT_AT_MAX_AGE=15  # Access token max age in minutes
NUXT_RT_MAX_AGE=7   # Refresh token max age in days

# Sentry (Optional)
NUXT_PUBLIC_SENTRY_DSN=Your-Sentry-DSN
SENTRY_AUTH_TOKEN=Your-Sentry-Auth-Token
```

### 4️⃣ Backend Setup (Required)

Before running the frontend, ensure the backend is running:

#### Option A: Docker (Recommended)

```sh
cd ../Chongkran-Backend
docker-compose up -d
```

#### Option B: Local Development

```sh
cd ../Chongkran-Backend
pnpm install
pnpm start:dev
```

### 5️⃣ Run the Development Server

```sh
pnpm dev
# or
npm run dev
# or
yarn dev
```

The app will be available at **`http://localhost:3000`**.

## 🛠️ Development Commands

```sh
# Start development server
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Run ESLint checks
pnpm lint

# Run ESLint with auto-fix
pnpm lint:fix
```

## 🏗️ Project Structure

```
Chongkran-Frontend/
├── app/
│   ├── app.vue              # Root application component
│   ├── layouts/             # Layout components
│   ├── pages/               # Page components
│   ├── components/         # Global components
│   ├── composables/         # Vue composables
│   ├── middleware/         # Route middleware
│   ├── plugins/             # Nuxt plugins
│   ├── assets/              # Static assets
│   │   └── css/             # CSS files
│   └── server/              # Server-side utilities
├── nuxt.config.ts           # Nuxt configuration
├── package.json             # Frontend dependencies
└── .env                     # Environment variables
```

## 🎨 Styling & Design

- **Tailwind CSS v4** for utility-first styling
- **Nuxt UI v4** components for consistent design system
- **Dark Mode** support through Nuxt UI
- **Responsive Design** with mobile-first approach
- **Motion Animations** using @vueuse/motion
- **Image Optimization** with @nuxt/image

## 🔐 Authentication & Authorization

- **JWT Authentication** with access and refresh tokens
- **Role-Based Access Control** for different user levels
- Users must log in to create, edit, or delete their recipes
- Admins have additional privileges to approve recipes
- Token management with automatic refresh

## 🚀 Deployment

### Production Build

```sh
pnpm build
pnpm start
```

### Environment Variables for Production

Make sure to configure these environment variables in your production environment:

- `ENV=production`
- `NUXT_API_BASE_URL` - Production backend API URL
- `NUXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error monitoring
- `NUXT_AT_MAX_AGE` & `NUXT_RT_MAX_AGE` - Token expiration settings

## 📜 License

This project is licensed under the **MIT License**.

## 🎉 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

### Development Guidelines

- Follow the existing code style and conventions
- Use TypeScript for type safety
- Use Nuxt UI components for consistent design
- Test your changes before submitting
- Update documentation as needed

## 📬 Contact

For any inquiries, reach out to **rungsethyhk@gmail.com** or open an issue on GitHub.

Happy Coding! 🚀
