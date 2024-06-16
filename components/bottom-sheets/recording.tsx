import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, H4, Text, View } from "tamagui";

import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { InteractionManager, TouchableOpacity } from "react-native";

import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { random } from "lodash";
import { usePouchBase64 } from "../../pouchdbs/attachment";
import { useCurrentBridge } from "../../zustand/editor";

const MAX_RECORDING_TIME = 60000; // 60s

export const RecordingSheet = () => {
  const {
    isRecording,
    remainingTime,
    recordingUri,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const { saveBase64 } = usePouchBase64();
  const editor = useCurrentBridge();
  const storeRecording = async () => {
    if (!recordingUri) {
      return;
    }
    const audioData = await FileSystem.readAsStringAsync(recordingUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const _id = `audio:${new Date().toISOString()}-${random(0, 9999)}`;
    await saveBase64(_id, audioData);
    editor?.setAudio(_id);
  };

  return (
    <BottomSheetView style={styles.sheetView}>
      <H4 selectable={false}>Record Audio</H4>
      <View jc="center" ai="center" my="$4" br="$10" gap="$2">
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text theme="red" color="$color10">
            {isRecording ? (
              <MaterialCommunityIcons name="stop-circle" size={48} />
            ) : (
              <MaterialCommunityIcons name="record-circle" size={48} />
            )}
          </Text>
        </TouchableOpacity>
        <Text>{MAX_RECORDING_TIME / 1000 - remainingTime}s/60s</Text>
        <Button
          fg={1}
          bw={0}
          br="$8"
          my="$2"
          disabled={!recordingUri || isRecording}
          animation="quick"
          o={!recordingUri || isRecording ? 0 : 1}
          icon={(props: any) => (
            <Text>
              <MaterialCommunityIcons name="plus" size={props.size} />
            </Text>
          )}
          onPress={() => {
            storeRecording();
            InteractionManager.runAfterInteractions(() => {
              router.back();
            });
          }}
        >
          Insert
        </Button>
      </View>
    </BottomSheetView>
  );
};

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: new_recording } = await Audio.Recording.createAsync();
      setRecording(new_recording);
      setRemainingTime(60);
      setIsRecording(true);

      // set a timer to stop recording after 60s
      timerRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_TIME);

      // set a interval to update remaining time
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    setRecordingUri(uri || null);
    setIsRecording(false);
  };

  return {
    isRecording,
    remainingTime,
    recordingUri,
    startRecording,
    stopRecording,
  };
};
