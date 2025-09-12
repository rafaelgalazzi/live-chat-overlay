

export class TwitchHandler {
    private AuthToken: string  = '';
    constructor(readonly clientId: string, readonly clientSecret: string) {}

    async getOAuthToken() {

        this.AuthToken = 'Test'
        return 'teste'
    }


}