import * as Sentry from '@sentry/nextjs';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { codeReview } from 'services/server/ai/codeReview';
import { response500ServerError } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';

export const config = {
  maxDuration: 120,
};

/**
 * @note jose should work in an edge function, but the private key format is PKCS#1 and jose expects PKCS#8
 */
// import * as jose from 'jose'

const WEBHOOK_SECRET = process.env.GITHUB_APP_WEBHOOK_SECRET;
const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_APP_PRIVATE_KEY = formatPemKey(process.env.GITHUB_APP_PRIVATE_KEY as string);
const ignoredFiles = [
  'yarn.lock',
  'tsconfig.tsbuildinfo',
  'types/generated',
  'functions/package-lock.json',
  'functions/src/services/types/generated.ts',
];

function formatPemKey(singleLinePem: string): string {
  const match = singleLinePem.match(/.{1,64}/g); // Split into 64-char lines
  if (!match) {
    throw new Error('Invalid key format');
  }
  const formattedPem = `-----BEGIN RSA PRIVATE KEY-----\n${match.join(
    '\n',
  )}\n-----END RSA PRIVATE KEY-----`;
  return formattedPem;
}

function verifySignature(payload: string, signature: string, secret: string) {
  const hmac = CryptoJS.HmacSHA1(payload, secret);
  const digest = 'sha1=' + hmac.toString(CryptoJS.enc.Hex);

  return timingSafeEqual(digest, signature);
}

function timingSafeEqual(a: string, b: string) {
  let mismatch = a.length === b.length ? 0 : 1;
  if (mismatch) {
    b = a;
  }

  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
}

async function getInstallationAccessToken(
  installationId: string,
  appId: string,
  privateKey: string,
) {
  // Generate JWT
  const now = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    {
      iat: now,
      exp: now + 10 * 60, // JWT expiration time (10 minutes)
      iss: appId,
    },
    privateKey,
    { algorithm: 'RS256' },
  );

  // Request Access Token
  const url = `https://api.github.com/app/installations/${installationId}/access_tokens`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.json(); // The access token
  } catch (error) {
    console.error('Error requesting access token:', error);
    throw error;
  }
}

function filterFilesFromDiff(diff: string, ignoredFiles: string[]): string {
  return diff
    .split('diff --git')
    .filter((section) => {
      const filePath = section.split('\n')[0];
      return !ignoredFiles.some((ignoredFile) => filePath.includes(ignoredFile));
    })
    .join('diff --git');
}

async function getPrContentAndChanges(payload: any, token: string): Promise<string> {
  // Extract necessary information/repositories for fetching PR details
  const prPatchUrl: string = payload.pull_request.url;

  // Headers for the GitHub API request
  const headers = {
    Accept: 'application/vnd.github.v3.diff',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const response = await fetch(prPatchUrl, { headers: headers });
    let patchContent: string = '';

    if (response.ok) {
      // Convert the content to string
      patchContent = await response.text();
    } else {
      patchContent = `Failed to fetch content, status code: ${response.status}`;
    }

    return patchContent;
  } catch (error) {
    console.error('Error fetching PR patch:', error);
    throw error;
  }
}

async function postGitHubComment(
  owner: string,
  repo: string,
  issueNumber: string,
  comment: string,
  accessToken: string,
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
  const data = { body: comment };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error posting comment to GitHub:', error);
    throw error;
  }
}

const POST = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    // console.log('headers:', request.headers);
    const signature = request.headers['x-hub-signature'];
    const event = request.headers['x-github-event'];
    const payload = request.body;

    if (!WEBHOOK_SECRET || !GITHUB_APP_ID || !GITHUB_APP_PRIVATE_KEY) {
      console.log('---- MISSING ENVIRONMENT VARIABLES ----');
      Sentry.captureException(new Error('Missing environment variables'));
      return response.status(500).send('Missing environment variables');
    }

    if (!verifySignature(JSON.stringify(payload), signature as string, WEBHOOK_SECRET)) {
      console.log('---- INCORRECT SIGNATURE ----');
      return response.status(401).send('Signature mismatch');
    }

    const installationId = payload.installation.id;

    const accessTokenResponse = await getInstallationAccessToken(
      installationId,
      GITHUB_APP_ID,
      GITHUB_APP_PRIVATE_KEY,
    );
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) {
      console.log('---- NO ACCESS TOKEN ----');
      return response.status(403).send('No access token available');
    }

    if (event === 'installation') {
      console.log('installation event');
      console.log('installation action:', payload.action);
      console.log('installation ID:', payload.installation.id);
    } else if (event === 'installation_repositories') {
      console.log('installation_repositories event');
      console.log('installation_repositories action:', payload.action);
      console.log('installation_repositories installation ID:', payload.installation.id);
    } else if (event === 'pull_request') {
      const action = payload.action;
      const pullRequest = payload.pull_request;
      const repository = payload.repository;

      console.log('pull_request event');
      console.log('pull_request action:', payload.action);
      console.log('pull_request installation ID:', payload.installation.id);

      if (action === 'synchronize' || action === 'opened') {
        console.log(
          'ABOUT TO COMMENT:',
          repository.owner.login,
          repository.name,
          pullRequest.number,
        );

        let prDetails: string = `PR Title: ${payload.pull_request.title}\n`;
        prDetails += `PR Body: ${payload.pull_request.body}\n`;
        prDetails += `PR URL: ${payload.pull_request.html_url}\n`;

        console.log(prDetails);

        const patchContent = await getPrContentAndChanges(payload, accessToken);
        const prChanges = filterFilesFromDiff(patchContent, ignoredFiles);
        const commentBody = await codeReview(prChanges);

        await postGitHubComment(
          repository.owner.login,
          repository.name,
          pullRequest.number,
          commentBody,
          accessToken,
        );
      }
    } else {
      console.log('unhandled event');
      console.log('event:', event);
    }

    return response.status(200).send('OK');
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return response500ServerError(response, error);
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
