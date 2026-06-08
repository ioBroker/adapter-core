"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRefresher = void 0;
const node_https_1 = require("node:https");
class TokenRefresher {
  static {
    __name(this, "TokenRefresher");
  }
  adapter;
  stateName;
  refreshTokenTimeout;
  accessToken;
  url;
  readyPromise;
  name;
  /** Threshold in milliseconds before the access token expires to trigger a refresh */
  static TOKEN_REFRESH_THRESHOLD_MS = 18e4;
  // 3 minutes in milliseconds
  /**
   * Creates an instance of TokenRefresher.
   *
   * @param adapter Instance of ioBroker adapter
   * @param serviceName Name of the service for which the tokens are managed, e.g., 'spotify', 'dropbox', etc.
   * @param stateName Optional name of the state where tokens are stored. Defaults to 'oauth2Tokens' and that will store tokens in `ADAPTER.X.oauth2Tokens`.
   */
  constructor(adapter, serviceName, stateName) {
    this.adapter = adapter;
    this.stateName = stateName || "oauth2Tokens";
    this.url = `https://oauth2.iobroker.in/${serviceName}`;
    this.name = serviceName || adapter.name;
    if (this.name === "oauth2") {
      this.name = adapter.name;
    }
    this.readyPromise = this.init();
  }
  httpPost(url, data, timeout = 2e4) {
    return new Promise((resolve, reject) => {
      const req = (0, node_https_1.request)(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(data))
        },
        timeout
      }, (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk;
        });
        res.on("end", () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(JSON.parse(responseData));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        });
        res.on("error", reject);
      });
      req.on("error", (error) => reject(error));
      req.write(JSON.stringify(data));
      req.end();
    });
  }
  async init() {
    const obj = await this.adapter.getObjectAsync(this.stateName);
    if (!obj) {
      await this.adapter.setObjectAsync(this.stateName, {
        type: "state",
        common: {
          name: this.stateName,
          expert: true,
          type: "string",
          role: "json",
          read: true,
          write: true,
          def: ""
        },
        native: {}
      });
      this.adapter.log.debug(`State ${this.stateName} created for ${this.name}`);
    }
    const state = await this.adapter.getStateAsync(this.stateName);
    if (state) {
      try {
        this.accessToken = JSON.parse(state.val);
      } catch (error) {
        this.adapter.log.error(`Cannot parse tokens: ${state.val}: ${error.message}`);
        this.accessToken = void 0;
      }
    } else {
      this.adapter.log.error(`No tokens for ${this.name} found`);
    }
    this.adapter.subscribeStatesAsync(this.stateName).catch((error) => this.adapter.log.error(`Cannot read tokens: ${error}`));
    return this.refreshTokens().catch((error) => this.adapter.log.error(`Cannot refresh tokens: ${error}`));
  }
  /**
   * Destroys the TokenRefresher instance, clearing any timeouts and stopping state subscriptions.
   */
  destroy() {
    if (this.refreshTokenTimeout) {
      this.adapter.clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = void 0;
    }
  }
  /**
   * This method is called when the state changes for the token.
   *
   * @param id ID of the state that changed
   * @param state Value
   */
  onStateChange(id, state) {
    if (state?.ack && id === `${this.adapter.namespace}.${this.stateName}`) {
      if (JSON.stringify(this.accessToken) !== state.val) {
        try {
          this.accessToken = JSON.parse(state.val);
          this.refreshTokens().catch((error) => this.adapter.log.error(`Cannot refresh tokens: ${error}`));
        } catch (error) {
          this.adapter.log.error(`Cannot parse tokens: ${error}`);
          this.accessToken = void 0;
        }
      }
    }
  }
  /** Returns the access token if it is valid and not expired.*/
  async getAccessToken() {
    await this.readyPromise;
    if (!this.accessToken?.access_token) {
      this.adapter.log.error(`No tokens for ${this.name} found`);
      return void 0;
    }
    if (!this.accessToken.access_token_expires_on || new Date(this.accessToken.access_token_expires_on).getTime() < Date.now()) {
      this.adapter.log.error("Access token is expired. Please authorize with your credentials via Admin interface again");
      return void 0;
    }
    return this.accessToken.access_token;
  }
  async refreshTokens() {
    if (this.refreshTokenTimeout) {
      this.adapter.clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = void 0;
    }
    if (!this.accessToken?.refresh_token) {
      this.adapter.log.error(`No tokens for ${this.name} found. Please authorize anew with your credentials via Admin interface.`);
      return;
    }
    if (!this.accessToken.access_token_expires_on || new Date(this.accessToken.access_token_expires_on).getTime() < Date.now()) {
      this.adapter.log.debug("Access token is expired. Retrying to refresh tokens...");
    }
    let expiresIn = new Date(this.accessToken.access_token_expires_on).getTime() - Date.now() - TokenRefresher.TOKEN_REFRESH_THRESHOLD_MS;
    if (expiresIn <= 0) {
      try {
        this.accessToken = await this.httpPost(this.url, this.accessToken);
      } catch (error) {
        this.accessToken = void 0;
        this.adapter.log.error(`Cannot refresh tokens: ${error}`);
      }
      if (this.accessToken) {
        this.accessToken.access_token_expires_on = new Date(Date.now() + this.accessToken.expires_in * 1e3).toISOString();
        expiresIn = new Date(this.accessToken.access_token_expires_on).getTime() - Date.now() - 18e4;
        await this.adapter.setState(this.stateName, JSON.stringify(this.accessToken), true);
        this.adapter.log.debug(`Tokens for ${this.name} updated`);
      } else {
        expiresIn = 6e5;
        this.adapter.log.error(`No tokens for ${this.name} could be refreshed`);
      }
    }
    if (expiresIn > 6e5) {
      expiresIn = 6e5;
    } else if (expiresIn < 6e4) {
      expiresIn = 6e4;
    }
    this.refreshTokenTimeout = this.adapter.setTimeout(() => {
      this.refreshTokenTimeout = void 0;
      this.refreshTokens().catch((error) => this.adapter.log.error(`Cannot refresh tokens: ${error}`));
    }, expiresIn);
  }
}
exports.TokenRefresher = TokenRefresher;
//# sourceMappingURL=TokenRefresher.js.map
