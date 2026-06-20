// Expo SDK 54'da klassik API (documentDirectory, createDownloadResumable...)
// '/legacy' entrypoint'ga ko'chirilgan. Yangi File/Directory API hozircha kerak emas.
import * as FileSystem from 'expo-file-system/legacy';

export const downloadVideo = async (url: string, videoId: string, onProgress: (progress: number) => void) => {
  const fileUri = `${FileSystem.documentDirectory}${videoId}.mp4`;
  
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      onProgress(progress);
    }
  );

  try {
    const result = await downloadResumable.downloadAsync();
    console.log('Finished downloading to ', result?.uri);
    return result?.uri;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getLocalVideoUri = async (videoId: string) => {
  const fileUri = `${FileSystem.documentDirectory}${videoId}.mp4`;
  const info = await FileSystem.getInfoAsync(fileUri);
  return info.exists ? fileUri : null;
};
