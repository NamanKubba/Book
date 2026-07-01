# BookStack

BookStack is a React-based online bookstore frontend with product browsing, cart, wishlist, authentication, orders, Razorpay checkout integration, and OTP-based signup support.

## Features

- Modern responsive bookstore UI
- Product catalog with search, genre filters, price filters, rating filters, and sorting
- Product detail pages
- Guest cart and wishlist using local storage
- Login-protected checkout and order placement
- Wishlist and cart animations
- Razorpay checkout flow
- OTP email verification during signup
- Separate local OTP server using Gmail SMTP

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

## Getting Started

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the React app:

```bash
npm start
```

The app runs at:

```text
http://localhost:3000
```

## OTP Email Setup

OTP email sending is handled by a small local Express server in `server/otp-server.js`.

Create a `.env` file in the project root:

```env
OTP_EMAIL_USER=your_gmail_address@gmail.com
OTP_EMAIL_APP_PASSWORD=your_gmail_app_password_here
OTP_PORT=4000
OTP_ALLOWED_ORIGIN=http://localhost:3000
REACT_APP_OTP_API_BASE_URL=http://localhost:4000
```

Use a Gmail App Password, not the normal Gmail account password.

Start the OTP server:

```bash
npm run otp-server
```

For signup OTP to work, run both servers:

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

## Backend API

The app currently uses the deployed backend:

```text
https://bookztron-server.vercel.app
```

Most API flows are working:

- Products
- New arrivals
- Signup
- Valid login
- User profile
- Wishlist
- Cart
- Orders
- Razorpay order creation

Known backend issue:

- Invalid login credentials currently return `504 Gateway Timeout` from the deployed backend. The frontend handles this with a timeout and user-friendly error message.

## Security Notes

- Do not commit `.env`.
- Do not put Gmail passwords or app passwords in frontend code.
- The OTP server must run on the server side because email credentials must remain private.

## Deployment Notes

This is a Create React App project. For most hosting providers, use:

```bash
npm run build
```

Then deploy the generated `build` output.

If deploying OTP email functionality, deploy `server/otp-server.js` separately as a backend service and set the same environment variables there.
