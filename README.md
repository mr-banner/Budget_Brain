🧠 Budget Brain

Budget Brain is an AI-powered personal finance tracking application that helps users manage their expenses, automate recurring transactions, and gain personalized AI insights through intelligent reports.

This project integrates Next.js, Prisma, Supabase, Clerk, Inngest, and Gemini AI to deliver a seamless and automated financial management experience.

Live Demo:- https://budget-brain-mauve.vercel.app/

🚀 Tech Stack

Frontend: Next.js 15, Tailwind CSS, Recharts, Framer Motion

Backend: Prisma ORM, Supabase

Authentication: Clerk

Email & Automation: Inngest + Resend

AI Integration: Gemini (for receipt scanning and AI-generated insights)

UI Components: Radix UI, Lucide Icons

Form Handling: React Hook Form + Zod

Others: Next Themes, Sonner (toast notifications)

✨ Key Features

✅ Create and manage multiple accounts with initial balance setup
✅ Dashboard showing recent transactions and category-wise spending pie chart
✅ Add transactions manually or by scanning receipts using Gemini AI
✅ Automatic creation of recurring transactions
✅ Monthly budget tracker with email alerts when expenses exceed 80%
✅ Inngest cron jobs trigger automated email reports and AI insights
✅ Fully responsive and modern UI with smooth animations
✅ Secure authentication powered by Clerk

⚙️ Getting Started

1️⃣ Clone the Repository
git clone https://github.com/mr-banner/Budget_Brain.git

cd Budget_Brain

2️⃣ Install Dependencies
npm install
# or
yarn install
3️⃣ Setup Environment Variables
Create a .env file in the root directory (see example below 👇).

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_FRONTEND_API=
budget-brain-mauve.vercel.app
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase Database Connection
# Used for Prisma + connection pooling
DATABASE_URL=
DIRECT_URL=

# Arcjet (for security or analytics)
ARCJET_KEY=

# Gemini AI (for receipt scanning and AI insights)
GEMINI_API_KEY=

4️⃣ Generate Prisma Client
npx prisma generate

5️⃣ Run the Development Server
npm run dev

Then open http://localhost:3000 in your browser 🚀

🧠 AI & Automation

Gemini AI: Extracts transaction data from scanned receipts and generates personalized financial insights.

Inngest: Triggers cron jobs for monthly report generation and email notifications.

Resend: Sends budget alerts and monthly summary emails to users.

🧾 Scripts
| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Run the app in development mode      |
| `npm run build` | Build for production                 |
| `npm start`     | Start the production server          |
| `npm run lint`  | Lint your code for errors            |
| `npm run email` | Run email preview server             |
| `postinstall`   | Generate Prisma client after install |

🚀 Deployment

You can deploy Budget Brain easily using Vercel
.
Make sure to add all environment variables from .env in your Vercel project settings.

👨‍💻 Author

Kamal Sahu
Frontend Developer | AI-Driven Web Applications
🔗 Live Demo :- https://budget-brain-mauve.vercel.app/



