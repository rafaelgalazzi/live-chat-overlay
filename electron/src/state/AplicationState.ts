type StateData = {
  channel: string | null;
  broadcasterId: string | null;
};

export class ApplicationState {
  private state: StateData = {
    channel: null,
    broadcasterId: null,
  };

  public getState(): StateData {
    return this.state;
  }

  public setState(newState: Partial<StateData>) {
    this.state = { ...this.state, ...newState };
  }

  public reset() {
    this.state = { channel: null, broadcasterId: null };
  }
}

export const appState = new ApplicationState();
