import fetch from 'node-fetch';

import { CONFIG } from '../config';

export class Requester {
  private sessionId: Promise<string>;

  constructor(sessionId?: string) {
    this.sessionId = sessionId
      ? new Promise((res) => res(sessionId))
      : this.getNewSessionId();
  }

  private async fetch<T>(payload: unknown): Promise<T> {
    return fetch(
      `http://${CONFIG.FLARESOLVERR_HOST}:${CONFIG.FLARESOLVERR_PORT}/v1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    ).then((r) => r.json());
  }

  private async getNewSessionId(): Promise<string> {
    return this.fetch<{ session: string }>({
      cmd: 'sessions.create',
    }).then((r) => r.session);
  }

  async get(url: string): Promise<string> {
    return this.fetch<{ solution: { response: string } }>({
      cmd: 'request.get',
      url: url,
      maxTimeout: 120000,
      session: await this.sessionId,
    }).then((r) => r.solution.response);
  }
}
