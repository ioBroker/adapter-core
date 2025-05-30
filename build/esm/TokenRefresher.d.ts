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
export declare class TokenRefresher {
    private readonly adapter;
    private readonly stateName;
    private refreshTokenTimeout;
    private accessToken;
    private readonly url;
    private readonly readyPromise;
    private readonly name;
    /**
     * Creates an instance of TokenRefresher.
     * @param adapter Instance of ioBroker adapter
     * @param serviceName Name of the service for which the tokens are managed, e.g., 'spotify', 'dropbox', etc.
     * @param stateName Optional name of the state where tokens are stored. Defaults to 'oauth2Tokens' and that will store tokens in `ADAPTER.X.oauth2Tokens`.
     */
    constructor(adapter: ioBroker.Adapter, serviceName: string, stateName?: string);
    /**
     * Destroys the TokenRefresher instance, clearing any timeouts and stopping state subscriptions.
     */
    destroy(): void;
    /** This method is called when the state changes for the token.
     *
     * @param id ID of the state that changed
     * @param state Value
     */
    onStateChange(id: string, state: ioBroker.State | null | undefined): void;
    /** Returns the access token if it is valid and not expired.*/
    getAccessToken(): Promise<string | undefined>;
    private refreshTokens;
}
