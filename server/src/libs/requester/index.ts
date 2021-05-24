import fetch from 'node-fetch';

export class Requester {
  private sessionId: Promise<string>;

  constructor(sessionId?: string) {
    this.sessionId = sessionId
      ? new Promise((res) => res(sessionId))
      : this.getNewSessionId();
  }

  private async fetch(payload: unknown): Promise<any> {
    return fetch(
      `http://${process.env.FLARESOLVERR_HOST || 'localhost'}:8191/v1`,
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
    return this.fetch({
      cmd: 'sessions.create',
    }).then((r) => r.session);
  }

  async get(url: string): Promise<string> {
    return this.fetch({
      cmd: 'request.get',
      url: url,
      maxTimeout: 120000,
      session: await this.sessionId,
    }).then((r) => r.solution.response);
  }
}
