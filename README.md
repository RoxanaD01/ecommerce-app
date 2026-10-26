# Demure
 
Demure is an online clothing store. I built this project to practice full-stack development and bring together the concepts I learned while working with React, Node.js, Express, and MongoDB. I wanted it to feel simple and a bit timeless, like a real small brand: you look around, pick something you like, choose your size and check out.
 
There are three apps in this repo, because a shop needs more than just the shop:
 
- **frontend**: the store, where customers shop
- **admin**: a separate panel where the owner adds products and manages orders
- **backend**: the API behind both of them

## Live demo
 
- Shop: https://demure-frontend.vercel.app/
- Admin panel: https://demure-admin.vercel.app/ (you need the admin login to get in)
  
## What you can do with it
 
If you're a customer, you can look through the collection and filter or search for what you want, open a product to see the photos and reviews, and add it to your cart in your size. Your cart stays saved to your account, so it's still there next time you log in. At checkout you pay by card with Stripe or pick cash on delivery. Prices are in RON. After that you can check your orders and see where each one is at.

You can also make an account, edit your profile and change your password. If you forget it, there's a "forgot password" link that sends you an email so you can set a new one.

If you're the admin, you log in on the admin panel, add new products (up to 4 photos each), edit or delete the old ones, and update the status of orders as they go out.
 
## What it's made with
 
React, Vite and Tailwind on the frontend. Node, Express and MongoDB on the backend. Stripe for payments, Cloudinary for photos, Nodemailer for emails. Hosted on Vercel.
 
## Running it on your computer
 
You need Node.js (20.19 or newer is safest) and free accounts on MongoDB Atlas, Cloudinary and Stripe (test mode is enough). For the password emails you also need a Gmail account with an [app password](https://support.google.com/accounts/answer/185833).
 
```bash
git clone https://github.com/RoxanaD01/ecommerce-app.git
cd ecommerce-app
```
 
### Backend
 
```bash
cd backend
npm install
```
 
Create a `.env` file inside `backend` with your own values:
 
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
 
# login for the admin panel
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_strong_one
 
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
 
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
 
# Gmail, for the password reset emails
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
 
# where your frontend and admin run locally
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```
 
Then run `npm run server`. If you get a CORS error, check `FRONTEND_URL` and `ADMIN_URL` first: in `server.js` the localhost addresses are commented out, so those two lines are what let your local apps in.
 
### Shop and admin panel
 
Do this in both `frontend` and `admin`:
 
```bash
npm install
```
 
Add a `.env` file in each folder with one line:
 
```env
VITE_BACKEND_URL=http://localhost:4000
```
 
Then `npm run dev`. The shop opens on http://localhost:5173 and the admin on http://localhost:5174. Log in to the admin with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the backend `.env`.
 
### Testing Stripe (optional)
 
Stripe confirms payments by calling a webhook, which can't reach your computer on its own. The [Stripe CLI](https://stripe.com/docs/stripe-cli) fixes that:
 
```bash
stripe listen --forward-to localhost:4000/api/order/webhook
```
It prints a secret that starts with `whsec_`. Copy it into `STRIPE_WEBHOOK_SECRET` and restart the backend.
 
## A note about the API
 
All routes start with `/api` (`user`, `product`, `cart`, `order`, `review`). 
Logged-in routes expect an `Authorization: Bearer <token>` header, and admin routes need the token from the admin login. 
Login, register and password reset are limited to 10 tries every 15 minutes, so if you get locked out while testing, just wait a bit.
 
## Deploy
 
I deployed each part as its own Vercel project (every folder has a `vercel.json`). Add the environment variables in each one, change `FRONTEND_URL` and `ADMIN_URL` in the backend to your real addresses, and point your Stripe webhook to `https://your-api-domain/api/order/webhook`.
 
## What I want to do next
 
There's still stuff I'd like to fix. I haven't written any tests yet. In `backend/config/nodemailer.js` I turned off TLS certificate checking, and I want to turn it back on. A lot of my read routes use `POST` when they should probably use `GET`. The READMEs inside `frontend` and `admin` are still the default Vite ones. And I need to add a `LICENSE` file (for now it just says ISC in the backend `package.json`)
