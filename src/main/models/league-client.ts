import fetch, {RequestInit} from 'node-fetch';
import https from "https";
import LCUConnector from "lcu-connector";
import {sleep} from "../utility/sleep";
import cp from "child_process";
import {EventEmitter} from 'events';

const agent = new https.Agent({
  rejectUnauthorized: false
});

const IS_MAC = process.platform === 'darwin';

type RequestMethod = 'GET' | 'POST'

export class Client extends EventEmitter {
  private url: string;
  private connectPromise;
  private _status: 'closed' | 'connecting' | 'opening' | 'connected' = 'closed';

  constructor() {
    super();

    this.connect();
  }

  async connect() {
    if (this.status === 'closed') {
      try {
        await this.openClient();
      }catch (e) {
        alert("Could not automatically open your client, please open the LoL Client manually");
      }
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    return this.connectPromise = new Promise((res, rej) => {
      const connector = new LCUConnector;

      connector.on('connect', data => {
        this.status = 'connected';
        res(data);
      });

      connector.on('disconnect', () => this.status = 'closed');

      connector.start();
    });
  }

  async getUrl() {
    if (this.url) {
      return this.url;
    }

    const credentials = await this.connect();

    return this.url = `${credentials.protocol}://${credentials.username}:${credentials.password}@${credentials.address}:${credentials.port}`;
  }

  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;

    this.emit('status-changed', this.status);
  }

  openClient() {
    this.status = 'opening';

    return new Promise((res, rej) => {
      let cmd;

      if (IS_MAC) {
        cmd = "open '/Applications/League of Legends.app'";
      } else {
        cmd = '"C:\\Riot Games\\League of Legends\\LeagueClient.exe"';
      }

      cp.exec(cmd, (err) => {
        if (err) {
          this.status = 'closed';
          rej('Error opening client from default path');
        } else {
          this.status = 'connecting';
          res();
        }
      })
    });
  }

  async isClientRunning() {
    return await LCUConnector.getLCUPathFromProcess() !== undefined;
  }

  async getRoflsFolder() {
    const path = await this.makeRequest('/lol-replays/v1/rofls/path')
      .then(res => res.text());

    // Strip quotes
    return path.replace(/"/g, '');
  }

  getReplayMetadata(gameId: number) {
    return this.makeRequest(`/lol-replays/v1/metadata/${gameId}`);
  }

  async downloadReplay(gameId: number) {
    await this.makeRequest(`/lol-replays/v1/rofls/${gameId}/download`, {}, 'POST');

    return this.waitForReplayDownload(gameId);
  }

  async watchReplay(gameId: number) {
    await this.downloadReplay(gameId);

    return this.makeRequest(`/lol-replays/v1/rofls/${gameId}/watch`, {}, 'POST');
  }

  private async waitForReplayDownload(gameId: number) {
    const validStates = ['checking', 'downloading'];
    const finishedState = 'watch';

    const recursive = async gameId => {
      await sleep(200);

      const metadata = await this.getReplayMetadata(gameId).then(res => res.json());
      if (metadata.state === finishedState) {
        // finished!
        return true;
      } else {
        if (validStates.indexOf(metadata.state) === -1) {
          throw new Error(`Could not download replay, state is ${metadata.state}`);
        }

        return recursive(gameId);
      }
    };

    return recursive(gameId);
  }

  private get jsonHeaders() {
    return {
      accept: 'application/json',
      ['Content-Type']: 'application/json'
    }
  }

  private async makeRequest(endpoint, body = {}, method: RequestMethod = 'GET', timeoutMs: number = 0) {
    const url = `${await this.getUrl()}${endpoint}`;

    let opts: RequestInit = {agent, method};
    if (method === 'POST') {
      opts.body = JSON.stringify(body);
      opts.headers = this.jsonHeaders;
    }

    const response = await fetch(url, opts);

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Client response error: ${response.status} ${response.statusText} - ${await response.text()}`);
    }

    return response;
  }
}
