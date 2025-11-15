# Firebase Google Authentication Setup

This guide will help you set up Firebase Google Authentication for the EduEqui project.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Enable Google Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"** if this is your first time
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"** in the providers list
5. Toggle **"Enable"**
6. Add a project support email
7. Click **"Save"**

## Step 3: Register Your Web App

1. In the Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click the **"Web"** icon (`</>`)
4. Register your app with a nickname (e.g., "EduEqui Web")
5. You don't need to set up Firebase Hosting for now
6. Click **"Register app"**

## Step 4: Get Your Firebase Configuration

After registering, you'll see your Firebase config. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 5: Configure Environment Variables

1. In the `frontend` directory, create a `.env` file
2. Add your Firebase configuration:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit your `.env` file to version control! It's already in `.gitignore`.

## Step 6: Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (should already be there for development)
   - Your production domain when you deploy

## Step 7: Test the Authentication

1. Start your development servers:
   ```bash
   cd frontend
   npm run dev:all
   ```

2. Open your browser and go to the login page
3. Click "Sign in with Google"
4. You should see the Google sign-in popup
5. Select your Google account
6. You'll be redirected to the dashboard

## Troubleshooting

### "This app is not verified" Warning

During development, you might see a warning that your app isn't verified. This is normal for development. Click "Advanced" → "Go to [your app] (unsafe)" to proceed.

For production, you'll need to verify your app through Google.

### CORS Errors

Make sure your backend server is running and the CORS settings allow requests from your frontend domain.

### Firebase Errors

- `auth/invalid-api-key`: Check that your API key is correct in `.env`
- `auth/popup-blocked`: Make sure popups are not blocked in your browser
- `auth/popup-closed-by-user`: The user closed the popup before completing authentication

## Security Best Practices

1. **Never expose Firebase Admin SDK credentials** in your frontend code
2. **Use environment variables** for all sensitive configuration
3. **Enable App Check** in production to prevent abuse
4. **Set up Firebase Security Rules** if using Firestore or Storage
5. **Monitor authentication events** in the Firebase Console

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In for Web](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

