import { useEffect, useState } from 'react';
import BaseButton from '../components/Button/BaseButton';
import { BaseCard } from '../components/Card/BaseCard';
import { BaseForm } from '../components/Form/BaseForm';
import { BaseInput } from '../components/Form/BaseInput';
import { BaseLayout } from '../components/Layout/BaseLayout';
import BaseText from '../components/Text/BaseText';
import { useElectron } from '../hooks/useElectron';
import { useAuth } from '../hooks/useAuth';
import { BaseTabs } from '../components/Tab/BaseTab';
import { BaseCheckbox } from '../components/Form/BaseCheckbox';

export function Dashboard() {
  const [loginBtnLoading, setLoginBtnLoading] = useState(false);

  const [twitchUserName, setTwitchUsername] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');

  const [isUsingTwitch, setIsUsingTwitch] = useState(true);
  const [isUsingTiktok, setIsUsingTiktok] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const { invoke } = useElectron();
  const { verifyAuth, isAuthenticated } = useAuth();

  const twitchNameInputHandler = (name: string) => {
    setTwitchUsername(name);
  };

  const tiktokNameInputHandler = (name: string) => {
    setTiktokUsername(name);
  };

  const handleStartOverlay = async () => {
    try {
      await invoke('start-chat', {
        twitchUserName: twitchUserName ?? undefined,
        tiktokUsername: tiktokUsername ?? undefined,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsRunning(true);
    }
  };

  const handleStopOverlay = async () => {
    try {
      await invoke('stop-chat');
    } catch (e) {
      console.log(e);
    } finally {
      setIsRunning(false);
    }
  };

  async function handleAuthentication() {
    setLoginBtnLoading(true);
    try {
      await invoke('oauth');
      await verifyAuth();
    } catch (e) {
      console.log(e);
    } finally {
      setLoginBtnLoading(false);
    }
  }

  useEffect(() => {
    verifyAuth();
  });

  const twitchTab = (
    <>
      {isAuthenticated ? (
        <div className="mb-5">
          <BaseText className="text-2xl mb-5">Enter the Twitch Username:</BaseText>
          <BaseText className="text-sm mb-5">
            The usernames are used to find whose chat you want to put in your overlay!
          </BaseText>
          <BaseForm>
            <BaseInput
              value={twitchUserName}
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
            <BaseButton onClick={handleAuthentication} loading={loginBtnLoading}>
              Login on Twitch
            </BaseButton>
          </div>
        </div>
      )}
    </>
  );

  const tiktokTab = (
    <>
      <BaseText className="text-2xl mb-5">Enter the Tiktok username:</BaseText>
      <BaseText className="text-sm mb-5">
        The usernames are used to find whose chat you want to put in your overlay!
      </BaseText>
      <BaseForm>
        <BaseInput
          value={tiktokUsername}
          onChange={tiktokNameInputHandler}
          placeholder="Enter the Tiktok username"
          disabled={!isUsingTiktok}
        ></BaseInput>
      </BaseForm>
    </>
  );

  const settingsTab = (
    <>
      <BaseText className="text-2xl">Chats do you want to use:</BaseText>
      <BaseText className="text-sm mb-5">You can select both to merge:</BaseText>
      <div className="flex justify-center">
        <BaseCheckbox className="mx-2" label="Twitch" checked={isUsingTwitch} onChange={setIsUsingTwitch} />
        <BaseCheckbox className="mx-2" label="Tiktok" checked={isUsingTiktok} onChange={setIsUsingTiktok} />
      </div>
    </>
  );

  const tabs = [
    { label: 'Twitch', content: twitchTab },
    { label: 'Tiktok', content: tiktokTab },
    { label: 'Settings', content: settingsTab },
  ];

  return (
    <BaseLayout>
      <BaseCard className="min-h-[400px] flex flex-col justify-between">
        <div className="flex justify-center">
          <BaseTabs tabs={tabs} />
        </div>
        <div className="flex justify-center my-1">
          <BaseButton className="m-2" onClick={handleStartOverlay} disabled={!twitchUserName.length || isRunning}>
            Start Overlay
          </BaseButton>
          <BaseButton className="m-2" onClick={handleStopOverlay} disabled={!isRunning}>
            Stop Overlay
          </BaseButton>
        </div>
      </BaseCard>
    </BaseLayout>
  );
}
