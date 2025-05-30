/**
 * This file implements a TokenRefresher class that manages OAuth2 access tokens for an ioBroker adapter.
 *
 * Instructions: https://github.com/ioBroker/ioBroker.admin/blob/master/packages/jsonConfig/OAUTH2.md
 */
import axios from 'axios';

export interface AccessTokens {
    /** The access token used for authentication */
    access_token: string;
    /** Interval in seconds, when access token will expire */
    expires_in: number;
    /** The date and time when the access token expires, in ISO format */
    access_token_expires_on: string;
    ext_expires_in: number;
    token_type: 'Bearer';
    scope: string;
    /** The refresh token used to obtain a new access token */
    refresh_token: string;
}

export class TokenRefresher {
    private readonly adapter: ioBroker.Adapter;
    private readonly stateName: string;
    private refreshTokenTimeout: ioBroker.Timeout | undefined;
    private accessToken: AccessTokens | undefined;
    private readonly url: string;
    private readonly readyPromise: Promise<void>;
    private readonly name: string;

    /**
     * Creates an instance of TokenRefresher.
     * @param adapter Instance of ioBroker adapter
     * @param serviceName Name of the service for which the tokens are managed, e.g., 'spotify', 'dropbox', etc.
     * @param stateName Optional name of the state where tokens are stored. Defaults to 'oauth2Tokens' and that will store tokens in `ADAPTER.X.oauth2Tokens`.
     */
    constructor(adapter: ioBroker.Adapter, serviceName: string, stateName?: string) {
        this.adapter = adapter;
        this.stateName = stateName || 'oauth2Tokens';
        this.url = `https://oauth2.iobroker.in/${serviceName}`;
        this.name = this.stateName.replace('info.', '').replace('Tokens', '').replace('tokens', '');
        if (this.name === 'oauth2') {
            this.name = adapter.name;
        }

        this.readyPromise = this.adapter.getForeignStateAsync(`${adapter.namespace}.${this.stateName}`).then(state => {
            if (state) {
                this.accessToken = JSON.parse(state.val as string);
                if (
                    this.accessToken?.access_token_expires_on &&
                    new Date(this.accessToken.access_token_expires_on).getTime() < Date.now()
                ) {
                    this.adapter.log.error('Access token is expired. Please make a authorization again');
                } else {
                    this.adapter.log.debug(`Access token for ${this.name} found`);
                }
            } else {
                this.adapter.log.error(`No tokens for ${this.name} found`);
            }
            this.adapter
                .subscribeStatesAsync(this.stateName)
                .catch(error => this.adapter.log.error(`Cannot read tokens: ${error}`));

            return this.refreshTokens().catch(error => this.adapter.log.error(`Cannot refresh tokens: ${error}`));
        });
    }

    /**
     * Destroys the TokenRefresher instance, clearing any timeouts and stopping state subscriptions.
     */
    destroy(): void {
        if (this.refreshTokenTimeout) {
            this.adapter.clearTimeout(this.refreshTokenTimeout);
            this.refreshTokenTimeout = undefined;
        }
    }

    /** This method is called when the state changes for the token.
     *
     * @param id ID of the state that changed
     * @param state Value
     */
    onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state?.ack && id.endsWith(`.${this.stateName}`)) {
            if (JSON.stringify(this.accessToken) !== state.val) {
                try {
                    this.accessToken = JSON.parse(state.val as string);
                    this.refreshTokens().catch(error => this.adapter.log.error(`Cannot refresh tokens: ${error}`));
                } catch (error) {
                    this.adapter.log.error(`Cannot parse tokens: ${error}`);
                    this.accessToken = undefined;
                }
            }
        }
    }

    /** Returns the access token if it is valid and not expired.*/
    async getAccessToken(): Promise<string | undefined> {
        await this.readyPromise;
        if (!this.accessToken?.access_token) {
            this.adapter.log.error(`No tokens for ${this.name} found`);
            return undefined;
        }
        if (
            !this.accessToken.access_token_expires_on ||
            new Date(this.accessToken.access_token_expires_on).getTime() < Date.now()
        ) {
            this.adapter.log.error('Access token is expired. Please make a authorization again');
            return undefined;
        }
        return this.accessToken.access_token;
    }

    private async refreshTokens(): Promise<void> {
        if (this.refreshTokenTimeout) {
            this.adapter.clearTimeout(this.refreshTokenTimeout);
            this.refreshTokenTimeout = undefined;
        }

        if (!this.accessToken?.refresh_token) {
            this.adapter.log.error(`No tokens for ${this.name} found`);
            return;
        }

        if (
            !this.accessToken.access_token_expires_on ||
            new Date(this.accessToken.access_token_expires_on).getTime() < Date.now()
        ) {
            this.adapter.log.debug('Access token is expired. Retrying to refresh tokens...');
        }

        let expiresIn = new Date(this.accessToken.access_token_expires_on).getTime() - Date.now() - 180_000;

        // If expiration is in less than 3 minutes, refresh the token
        if (expiresIn <= 0) {
            // Refresh token
            try {
                const response = await axios.post(this.url, this.accessToken);
                if (response.status !== 200) {
                    this.adapter.log.error(`Cannot refresh tokens: ${response.statusText}`);
                    return;
                }
                this.accessToken = response.data;
            } catch (error) {
                this.adapter.log.error(`Cannot refresh tokens: ${error}`);
            }

            if (this.accessToken) {
                this.accessToken.access_token_expires_on = new Date(
                    Date.now() + this.accessToken.expires_in * 1_000,
                ).toISOString();
                expiresIn = new Date(this.accessToken.access_token_expires_on).getTime() - Date.now() - 180_000;
                await this.adapter.setState(this.stateName, JSON.stringify(this.accessToken), true);
                this.adapter.log.debug(`Tokens for ${this.name} updated`);
            } else {
                // Try again in 10 minutes
                expiresIn = 600_000; // 10 minutes
                this.adapter.log.error(`No tokens for ${this.name} could be refreshed`);
            }
        }

        // no longer than 10 minutes, as longer timer could be not reliable
        if (expiresIn > 600_000) {
            expiresIn = 600_000;
        } else if (expiresIn < 60_000) {
            expiresIn = 60_000;
        }

        this.refreshTokenTimeout = this.adapter.setTimeout(() => {
            this.refreshTokenTimeout = undefined;
            this.refreshTokens().catch(error => this.adapter.log.error(`Cannot refresh tokens: ${error}`));
        }, expiresIn);
    }
}
