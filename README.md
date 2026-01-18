# T Perry Portfolio

A creative portfolio website with a folder-based work gallery and admin dashboard for managing projects.

## ✨ Features

- 📁 **Folder-Based Gallery** - Projects organized by category with smooth animations
- 🎬 **Media Uploads** - Support for images and videos via Cloudinary
- 🔐 **Admin Dashboard** - Secure login, project management, and settings
- 📱 **Fully Responsive** - Optimized for all devices
- ⚡ **Fast & Modern** - Built with Next.js 16 and React 19

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Storage:** Cloudinary
- **Styling:** CSS Modules
- **Animations:** Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) account)
- [Cloudinary](https://cloudinary.com) account

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/tperry.git
   cd tperry
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   ```

   Then fill in your database and Cloudinary credentials.

4. Run database migrations

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the development server

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   ├── work/           # Work/portfolio page
│   └── page.tsx        # Homepage
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeding
└── public/             # Static assets
```

## 🔑 Admin Access

Default credentials after seeding:

- **Email:** oyewusitemitayoxyz@gmail.com
- **Password:** admin123

_Remember to change the password after first login!_

## 📄 License

MIT License - feel free to use this project for your own portfolio!

---

Made with ❤️ by T Perry
