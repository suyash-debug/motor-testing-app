# Firebase Setup Guide

This guide will help you set up Firebase for the Motor Testing App.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Enable Google Analytics (optional)

## Step 2: Create a Firestore Database

1. In the Firebase Console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode"
   - **Production mode**: Requires security rules (more secure)
   - **Test mode**: Open for 30 days (good for development)
4. Select a Cloud Firestore location (choose closest to your users)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click on the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app with a nickname (e.g., "Motor Testing App")
6. Copy the Firebase configuration object

## Step 4: Configure Your App

1. In your project root, create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Save the file

## Step 5: Set Up Firestore Security Rules (Recommended)

In the Firebase Console:
1. Go to Firestore Database
2. Click on the "Rules" tab
3. Add the following rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to motors collection
    match /motors/{motorId} {
      allow read, write: if true; // Change this for production!
    }
  }
}
```

**For production**, use more restrictive rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /motors/{motorId} {
      allow read: if true;
      allow create: if request.auth != null; // Requires authentication
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

4. Click "Publish"

## Step 6: Deploy to Vercel

Your `.env.local` file is already in `.gitignore`, so it won't be committed to GitHub.

To configure environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable from your `.env.local` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Save and redeploy

## Step 7: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Try creating a new motor
4. Check the Firestore Database in Firebase Console to see if the data appears

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that all environment variables are correctly set in `.env.local`
- Restart your development server after changing `.env.local`

### "Missing or insufficient permissions"
- Check your Firestore security rules
- For development, temporarily use permissive rules

### Data not appearing in Firestore
- Open browser console (F12) to check for errors
- Verify your Firebase configuration is correct
- Check that Firestore is enabled in Firebase Console

## Features

✅ Real-time updates - Changes sync automatically across all clients
✅ Persistent storage - Data is stored in the cloud
✅ Scalable - Firebase handles all the infrastructure
✅ Offline support - Firebase SDK caches data locally

## Data Structure

```
motors (collection)
  └── {motorId} (document)
      ├── createdAt: timestamp
      ├── motorName: string
      ├── motorModel: string
      ├── manufacturer: string
      ├── specifications: object
      └── testData: array
          └── {
              id: string,
              timestamp: timestamp,
              voltage: number,
              current: number,
              rpm: number,
              temperature: number,
              notes: string
            }
```
