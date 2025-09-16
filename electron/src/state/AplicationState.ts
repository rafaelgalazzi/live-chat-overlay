type StateData = {
  twitchChannel: string | null;
  tiktokChannel: string | null;
  broadcasterId: string | null;
};

export class ApplicationState {
  private state: StateData = {
    twitchChannel: null,
    tiktokChannel: null,
    broadcasterId: null,
  };

  public getState(): StateData {
    return this.state;
  }

  public setState(newState: Partial<StateData>) {
    this.state = { ...this.state, ...newState };
  }

  public reset() {
    this.state = { twitchChannel: null, tiktokChannel: null, broadcasterId: null };
  }
}

export const appState = new ApplicationState();
