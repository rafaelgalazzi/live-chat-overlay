import { BaseForm } from './Form/BaseForm';
import { BaseInput } from './Form/BaseInput';
import BaseText from './Text/BaseText';

interface TiktokTabProps {
  tiktokUsername: string;
  tiktokNameInputHandler: (name: string) => void;
  isUsingTiktok: boolean;
}

export function TiktokTab(props: TiktokTabProps) {
  const { tiktokUsername, tiktokNameInputHandler, isUsingTiktok } = props;

  return (
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
}
