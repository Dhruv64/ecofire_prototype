import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


const clientId = process.env.GOOGLE_CLIENT_ID!;

const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

const redirectUri = process.env.GOOGLE_CLIENT_URI!;

// async function loadSavedCredentials(): Promise<OAuth2Client | null> {
//   try {
//     const content = await fs.readFile(TOKEN_PATH, 'utf8');
//     const credentials = JSON.parse(content);
//     const client = google.auth.fromJSON(credentials);
//     if (client instanceof OAuth2Client) {
//       return client;
//     }
//     return null;
//   } catch (error) {
//     return null;
//   }
// }


// export async function saveCredentials(client: any) {
//   const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }


export async function generateAuthUrl() {

  try {
      const scopes = [

      'https://www.googleapis.com/auth/calendar',

      'https://www.googleapis.com/auth/calendar.events',

      ];
      let oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      
      return oauth2Client.generateAuthUrl({
      
      access_type: 'offline',

      scope: scopes,

      });
  }catch(error){
      console.log("Error in generateUrl" + error);
  }
}



// export async function authorize() {
//   try {
//     client = await loadSavedCredentials();
//     if (client) return client;

//     let client = await authenticate({
//       scopes: SCOPES,
//       keyfilePath: CREDENTIALS_PATH,
//     });

//     if (client.credentials) {
//       await saveCredentials(client);
//     }
//     return client;
//   } catch (error) {
//     console.error('Authorization error:', error);
//     throw error; // Re-throw to be caught by the API route
//   }
// }


// export async function getCalendars() {
//   const auth = await authorize();
//   const calendar = google.calendar({ version: 'v3', auth });
//   const res = await calendar.calendarList.list();
//   return res.data.items;
// }

// export async function getCalendarEvents(calendarIds: string[]) {
//   const auth = await authorize();
//   const calendar = google.calendar({ version: 'v3', auth });
//   const allEvents = [];

//   for (const calendarId of calendarIds) {
//     const res = await calendar.events.list({
//       calendarId,
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     });
//     allEvents.push(...(res.data.items || []));
//   }

//   return allEvents;
// }
