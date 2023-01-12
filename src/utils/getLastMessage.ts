import path from 'node:path';
import fs from 'node:fs/promises';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = (await fs.readFile(TOKEN_PATH)).toString();
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = (await fs.readFile(CREDENTIALS_PATH)).toString();
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorize() {
  let client: any = await loadSavedCredentialsIfExist();

  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

export const getCodeFromEmail = () =>
  authorize().then(async (auth) => {
    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.messages.list({
      userId: 'me',
    });

    const messages = res.data.messages;

    if (!messages || messages.length === 0) {
      console.log('No Messages found.');

      throw new Error('No messages');
    }

    const lastMessage = await gmail.users.messages.get({
      userId: 'me',
      id: messages[0].id,
      prettyPrint: true,
    });

    return Buffer.from(lastMessage.data.payload.body.data, 'base64')
      .toString('utf-8')
      .match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)[0];
  });
