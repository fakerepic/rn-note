import { useEffect, useLayoutEffect, useState } from "react";
import { useVoice } from "../../zustand/voice";
import { useCurrentBridge } from "../../zustand/editor";
import { usePouchBase64 } from "../../pouchdbs/attachment";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

type Props = {
  children: React.ReactNode;
};

export const VoiceProvider = (props: Props) => {
  const voiceID = useVoice((s) => s.voiceID);
  const setVoice = useVoice((s) => s.setVoice);
  const editor = useCurrentBridge();

  const { getBase64 } = usePouchBase64();

  useLayoutEffect(() => setVoice(undefined), [setVoice]);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!voiceID || isPlaying) {
      return;
    }
    const playVoice = async (vID: string) => {
      try {
        const audioData: string = await getBase64(vID);

        // Write the audio data to a temporary file
        const audioPath = `${FileSystem.documentDirectory}temp_audio.mp3`;
        await FileSystem.writeAsStringAsync(audioPath, audioData, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Load and play the audio file using expo-av
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioPath },
          { shouldPlay: true },
        );
        setIsPlaying(true);
        await sound.playAsync();
        setVoice(undefined);
        setIsPlaying(false);
      } catch (e) {
        console.log(e);
      }
    };
    playVoice(voiceID);
    return () => {
      setVoice(undefined);
    };
  }, [editor?.webviewRef, getBase64, isPlaying, setVoice, voiceID]);

  return <>{props.children}</>;
};
