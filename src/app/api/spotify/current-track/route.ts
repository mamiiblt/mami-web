/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error("Token error");

  return data.access_token;
}

export async function GET() {
  try {
    const token = await getAccessToken();

    const res = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
    );

    if (res.status === 204) {
      return await getRecent(token);
    }

    const data = await res.json();

    if (data?.is_playing === true) {
      return NextResponse.json({
        type: "currently-playing",
        resp: data,
      });
    }

    return await getRecent(token);
  } catch (err) {
    return NextResponse.json(
        { error: "Spotify error" },
        { status: 500 }
    );
  }
}

async function getRecent(token: string) {
  const res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=5",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
  );

  const data = await res.json();

  console.log(data)

  return NextResponse.json({
    type: "recently-played",
    resp: data.items,
  });
}