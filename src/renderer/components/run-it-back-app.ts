import {customElement, property, html, css, LitElement} from "lit-element";
import {Client} from "../../main/models/league-client";
import {PropertyValues} from "lit-element/lib/updating-element";
import '@material/mwc-button/mwc-button';
import '@material/mwc-textfield/mwc-textfield';
import {getStatic} from "../static";

@customElement("run-it-back-app")
export class RunItBackApp extends LitElement {
  @property({type: Object})
  client: Client = null;

  @property({type: String})
  clientStatus: string;

  @property({type: String})
  replayStatus: 'success' | 'error';

  @property({type: String})
  replayStatusMessage: string;

  @property({type: Number})
  gameId: number;

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      }

      #container {
        width: 200px;
      }

      .status-closed, .status-error {
        color: red;
      }

      .status-connected, .status-success {
        color: green;
      }

      #watchReplayContainer {
        display: flex;
        flex-direction: column;
      }
      
      mwc-button {
        margin-top: 12px;
      }
    `
  }

  render() {
    return html`
      <img src="${getStatic('logo.png')}" />

      <div id="container">
        <h3>Client status: <span class="status-${this.clientStatus}">${this.clientStatus}</span></h3>

        <a href="javascript:void(null);" @click="${this.connect}" .hidden=${this.clientStatus === 'connected'}>Reconnect to client</a>

        <div id="watchReplayContainer">
          <mwc-textfield outlined placeholder="Game ID" type="text" name="gameId" @input="${e => this.gameId = e.target.value}"></mwc-textfield>
          <mwc-button outlined @click="${this.watchReplay}">Watch replay!</mwc-button>

          <span id="replayStatus" class="status-${this.replayStatus}">${this.replayStatusMessage}</span>
        </div>
      </div>
    `;
  }

  protected updated(props: PropertyValues): void {
    super.updated(props);

    if (props.has('client') && this.client) {
      this.client.on('status-changed', status => {
        this.clientStatus = status;
      });
    }
  }

  connect() {
    return this.client.connect();
  }

  async watchReplay() {
    // Validate Game ID
    const gameIdRegex = /^\d+$/;
    if (!this.gameId || !gameIdRegex.test(this.gameId.toString())) {
      this.replayStatus = 'error';
      return this.replayStatusMessage = 'Please enter a valid Game ID, e.g. 294820618';
    }

    try {
      this.replayStatus = 'success';
      this.replayStatusMessage = 'Downloading replay... please wait';
      await this.client.watchReplay(this.gameId);
      this.replayStatusMessage = 'Replay launched! Your replay should open any second'
    } catch (e) {
      this.replayStatus = 'error';
      return this.replayStatusMessage = `Error downloading replay: ${e.message}`;
    }
  }
}
