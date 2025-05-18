# FitnessForge Firebase Deployment Guide

## Overview
This document provides instructions for deploying the FitnessForge application to Firebase using GitHub integration. The application has been fully configured with Firebase Authentication, Firestore, and Storage, and includes GitHub Actions for continuous deployment.

## Prerequisites
- A Firebase account
- GitHub account with access to the FitnessForge repository
- OpenAI API key (if using the training plan generation feature)

## Firebase Configuration
The application has been configured to use the following Firebase project:
- Project ID: `fitnessforgeai`
- Web App: FitnessForge Web

## Deployment Steps

### 1. Set up GitHub Secrets
To enable secure CI/CD deployment, add the following secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `REACT_APP_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `REACT_APP_FIREBASE_APP_ID`: Your Firebase app ID
   - `REACT_APP_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
   - `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key
   - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON (for deployment)

### 2. Generate a Firebase Service Account
1. Go to Firebase Console → Project Settings → Service accounts
2. Click "Generate new private key"
3. Save the JSON file
4. Add the entire JSON content as the `FIREBASE_SERVICE_ACCOUNT` secret in GitHub

### 3. Deploy Using GitHub Actions
The repository is configured with GitHub Actions for automatic deployment:

1. Any push to the `main` branch will trigger a deployment
2. You can also manually trigger a deployment from the Actions tab in GitHub

### 4. Manual Deployment (Alternative)
If you prefer to deploy manually:

1. Clone the repository:
   ```bash
   git clone https://github.com/Shaneos44/FitnessForgeAI.git
   cd FitnessForgeAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ```

4. Build and deploy:
   ```bash
   npm run build
   npm run firebase:deploy
   ```

## Application Features

### Authentication
- Email/password authentication
- Password reset functionality
- Protected routes for authenticated users

### Firestore Database
- User profiles storage
- Training plans persistence
- Workout tracking and history

### Training Plan Generation
- Support for multiple event types:
  - Marathon and Half Marathon
  - 10K and 5K races
  - Hyrox competitions
  - Ironman and Half Ironman triathlons
  - Mini Triathlons

## Project Structure
- `/src/firebase`: Firebase configuration
- `/src/services`: Service modules for authentication, Firestore, etc.
- `/src/contexts`: Context providers for state management
- `/src/components`: UI components
- `/src/pages`: Application pages and routes

## Troubleshooting
- If deployment fails, check the GitHub Actions logs for details
- Ensure all environment variables and secrets are correctly set
- Verify Firebase project permissions and settings

## Next Steps
After deployment, you can:
1. Access your application at `https://fitnessforgeai.web.app`
2. Set up custom domains in Firebase Hosting settings
3. Configure Firebase Authentication providers as needed
4. Set up Firebase Analytics for usage tracking
