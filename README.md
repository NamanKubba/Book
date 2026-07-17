# BookStack

BookStack is a React-based online bookstore with product browsing, cart, wishlist, authentication, orders, Razorpay checkout integration, and OTP-based signup support.

## Live Deployment

Website:

```text
https://bookstack-frontend.vercel.app
```

## Features

- Responsive bookstore UI
- Product catalog with search, genre filters, price filters, rating filters, and sorting
- Product detail pages
- Guest cart and wishlist using local storage
- Login-protected checkout and order placement
- Wishlist and cart animations
- Razorpay checkout flow
- OTP email verification during signup
- Separate Express OTP email server using Gmail SMTP

## Tech Stack

- React 17
- React Router
- Context API
- Axios
- Framer Motion
- Lucide React
- Express
- Nodemailer
- Razorpay Checkout
- Vercel

## Local Setup

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Create a `.env.local` file in the project root:

```env
REACT_APP_API_BASE_URL=your_main_backend_url
REACT_APP_OTP_API_BASE_URL=your_otp_backend_url
```

Start the React app:

```bash
npm start
```

The app runs at:

```text
local development port 3000
```

## OTP Server Setup

OTP email sending is handled by `server/otp-server.js`.

Create a `.env` file in the project root:

```env
OTP_EMAIL_USER=your_gmail_address@gmail.com
OTP_EMAIL_APP_PASSWORD=your_gmail_app_password_here
OTP_PORT=4000
OTP_ALLOWED_ORIGIN=your_frontend_origin
```

Use a Gmail App Password, not the normal Gmail account password.

Start the OTP server:

```bash
npm run otp-server
```

For local signup OTP to work, run both:

```bash
npm run otp-server
npm start
```

## Available Scripts

```bash
npm start
```

Runs the React development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run otp-server
```

Starts the OTP email server.

```bash
npm test
```

Runs the test runner.

## Deployment

The frontend is deployed on Vercel as:

```text
bookstack-frontend
```

The deployed frontend uses these production environment variables:

```env
REACT_APP_API_BASE_URL=your_main_backend_url
REACT_APP_OTP_API_BASE_URL=your_otp_backend_url
```

The OTP backend is deployed on Vercel as:

```text
server
```

The OTP backend needs these production environment variables:

```env
OTP_EMAIL_USER=your_gmail_address@gmail.com
OTP_EMAIL_APP_PASSWORD=your_gmail_app_password_here
OTP_ALLOWED_ORIGIN=*
```

The frontend Vercel config uses:

```json
{
  "installCommand": "npm install --legacy-peer-deps",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Security Notes

- Do not commit `.env` or `.env.local`.
- Do not put Gmail passwords or app passwords in frontend code.
- Gmail credentials must stay only on the backend/server environment.
