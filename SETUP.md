# Ramanujan Class website: Firebase setup

The site is ready. It needs a free Firebase project for login and the student list.

## 1. Create the Firebase project (about 5 minutes)
1. Go to https://console.firebase.google.com and click **Create a project**. Name it `ramanujan-class`. Google Analytics is not needed.
2. **Build > Authentication > Get started**. Under *Sign-in method*, enable **Email/Password** and **Google**.
3. **Build > Firestore Database > Create database**. Choose the region **asia-south1 (Mumbai)** and start in **production mode**.
4. Open the **Rules** tab, paste in everything from `firestore.rules`, put your teacher email in place of `teacher@example.com`, and click **Publish**.
5. **Project settings (gear icon) > General > Your apps > Web (</>)**. Register an app called `class-site`. Copy the `firebaseConfig` values it shows you.

## 2. Send Claude
- The `firebaseConfig` values (apiKey, authDomain, projectId, appId). These are safe to share; they are not passwords.
- The email you will use to sign in as the teacher.

## 3. After it's online
In Firebase, go to **Authentication > Settings > Authorized domains** and add the website's address (for example `yourname.github.io`). Google sign-in works only from domains on this list.
