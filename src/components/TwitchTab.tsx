import BaseButton from './Button/BaseButton';
import { BaseForm } from './Form/BaseForm';
import { BaseInput } from './Form/BaseInput';
import BaseText from './Text/BaseText';

interface TwitchTabProps {
  isAuthenticated: boolean;
  twitchNameInputHandler: (name: string) => void;
  twitchUsername: string;
  isUsingTwitch: boolean;
  handleAuthentication: () => void;
  loading: boolean;
}

export function TwithTab(props: TwitchTabProps) {
  const { twitchNameInputHandler, twitchUsername, isUsingTwitch, isAuthenticated, handleAuthentication, loading } =
    props;

  return (
    <>
      {isAuthenticated ? (
        <div className="mb-5">
          <BaseText className="text-2xl mb-5">Enter the Twitch Username:</BaseText>
          <BaseText className="text-sm mb-5">
            The usernames are used to find whose chat you want to put in your overlay!
          </BaseText>
          <BaseForm>
            <BaseInput
              value={twitchUsername}
              onChange={twitchNameInputHandler}
              placeholder="Enter the Twitch username"
              disabled={!isUsingTwitch}
            ></BaseInput>
          </BaseForm>
        </div>
      ) : (
        <div className="m-2">
          <BaseText className="text-2xl mb-5">Authenticate on twitch:</BaseText>
          <BaseText className="text-sm mb-5">
            You need to be Authenticated on Twitch to have access to the chat!
          </BaseText>
          <div className="flex justify-center mb-5">
            <BaseButton onClick={handleAuthentication} loading={loading}>
              Login on Twitch
            </BaseButton>
          </div>
        </div>
      )}
    </>
  );
}
