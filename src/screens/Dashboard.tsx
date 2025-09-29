import { useEffect, useState } from 'react';
import BaseButton from '../components/Button/BaseButton';
import { BaseCard } from '../components/Card/BaseCard';
import { BaseLayout } from '../components/Layout/BaseLayout';
import { useElectron } from '../hooks/useElectron';
import { BaseTabs } from '../components/Tab/BaseTab';
import { TwithTab } from '../components/TwitchTab';
import { TiktokTab } from '../components/TiktokTab';
import { SettingsTab } from '../components/SettingsTab';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const [loginBtnLoading, setLoginBtnLoading] = useState(false);
  const [twitchUsername, setTwitchUsername] = useState('');
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

  const handleSetIsUsingTwitch = (state: boolean) => {
    if (!state) setTwitchUsername('');
    setIsUsingTwitch(state);
  };

  const handleSetIsUsingTiktok = (state: boolean) => {
    if (!state) setTiktokUsername('');
    setIsUsingTiktok(state);
  };

  const handleStartOverlay = async () => {
    try {
      await invoke('start-chat', {
        twitchUsername: twitchUsername ?? undefined,
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
  }, [verifyAuth]);

  const tabs = [
    {
      label: 'Twitch',
      content: (
        <TwithTab
          twitchNameInputHandler={twitchNameInputHandler}
          twitchUsername={twitchUsername}
          isUsingTwitch={isUsingTwitch}
          isAuthenticated={isAuthenticated}
          handleAuthentication={handleAuthentication}
          loading={loginBtnLoading}
        />
      ),
    },
    {
      label: 'Tiktok',
      content: (
        <TiktokTab
          tiktokNameInputHandler={tiktokNameInputHandler}
          tiktokUsername={tiktokUsername}
          isUsingTiktok={isUsingTiktok}
        />
      ),
    },
    {
      label: 'Settings',
      content: (
        <SettingsTab
          isUsingTwitch={isUsingTwitch}
          isUsingTiktok={isUsingTiktok}
          setIsUsingTwitch={handleSetIsUsingTwitch}
          setIsUsingTiktok={handleSetIsUsingTiktok}
        />
      ),
    },
  ];

  return (
    <BaseLayout>
      <BaseCard className="min-h-[400px] flex flex-col justify-between">
        <div className="flex justify-center">
          <BaseTabs tabs={tabs} />
        </div>
        <div className="flex justify-center my-1">
          <BaseButton
            className="m-2"
            onClick={handleStartOverlay}
            disabled={(!twitchUsername.length && !tiktokUsername.length) || isRunning}
          >
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
