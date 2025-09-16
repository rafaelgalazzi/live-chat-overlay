import { BaseCheckbox } from './Form/BaseCheckbox';
import BaseText from './Text/BaseText';

interface SettingsTabProps {
  isUsingTwitch: boolean;
  setIsUsingTwitch: (state: boolean) => void;
  isUsingTiktok: boolean;
  setIsUsingTiktok: (state: boolean) => void;
}

export function SettingsTab(props: SettingsTabProps) {
  const { isUsingTwitch, setIsUsingTwitch, isUsingTiktok, setIsUsingTiktok } = props;
  return (
    <>
      <BaseText className="text-2xl">Chats do you want to use:</BaseText>
      <BaseText className="text-sm mb-5">You can select both to merge:</BaseText>
      <div className="flex justify-center">
        <BaseCheckbox className="mx-2" label="Twitch" checked={isUsingTwitch} onChange={setIsUsingTwitch} />
        <BaseCheckbox className="mx-2" label="Tiktok" checked={isUsingTiktok} onChange={setIsUsingTiktok} />
      </div>
    </>
  );
}
