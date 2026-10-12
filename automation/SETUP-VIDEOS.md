# Automatic class videos: one-time setup (about 10 minutes)

After this, you only **move a recording into a subject folder in Google Drive**. Within 15 minutes it is shared and appears in the app's Daily Lessons as the next day.

Do every step signed in as **infinitemath@ramanujanclass.org**, the account that owns the Meet recordings.

## 1. Let that account write to the app's database

Do this only if infinitemath@ramanujanclass.org did not create the Firebase project.

1. Open console.firebase.google.com and go to project **ramanujan-class1**.
2. Click the gear, then **Users and permissions**, then **Add member**.
3. Enter `infinitemath@ramanujanclass.org`, choose role **Editor**, and click **Add member**.

## 2. Create the script

1. Go to **script.google.com** and click **New project**. Name it *Ramanujan Class Videos*.
2. Delete everything in `Code.gs`. Paste in all of **ClassVideos.gs** and click **Save**.
3. Click the gear (**Project Settings**) and tick **Show "appsscript.json" manifest file in editor**.
4. Back in the **Editor**, open `appsscript.json`. Replace its contents with **appsscript.json** from this folder, then click **Save**.

## 3. Start it

1. At the top, pick the function **setup** and click **Run**.
2. Google asks for permission. Click **Review permissions** and choose the infinitemath account. If you see "Google hasn't verified this app", click **Advanced**, then **Go to Ramanujan Class Videos**, then **Allow**. This is your own script.
3. The log ends with **Ready** and a link to the new Drive folder **Ramanujan Class Videos**. It has one folder per subject.

## Every day after that

- After class, open **Drive → Meet Recordings**. Rename the recording to its topic, for example *Sylow theorems*. Then drag it into the right subject folder inside **Ramanujan Class Videos**.
- The thumbnail is made automatically: Ramanujan Class, Namakkal, the subject, the date and the topic. It appears the next time you open the app as teacher.
- Every video in the app is shared as "Anyone with the link can view" automatically, including videos you add by hand in Admin with a Drive link (if the video is in this account's Drive). That is what lets it play inside the app.
- **Book Library soft copies:** upload the PDF to this account's Drive, then in the app open **Book Library**, tap **Add from Google Drive** under the book and paste the Drive link. The script shares it as "Anyone with the link" within 15 minutes, so students can download it.
- Recordings with the same class date join the same day, as Part 1, Part 2 and so on. A new date becomes the next day.
- To remove a video, first move it out of the subject folder, then delete it in **Admin → PDFs, videos & notes**. If it stays in the folder, the script adds it again.

## If a video doesn't appear

Open the script, go to **Executions** and read the newest log line.

- **Firestore 403:** step 1 isn't done.
- **"Could not share publicly":** your Google Workspace blocks sharing outside the organization. Allow it in admin.google.com, under Apps, then Drive and Docs, then Sharing settings.
