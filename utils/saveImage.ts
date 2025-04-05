import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export async function saveImage(imageUrl: string): Promise<string> {
  try {
    // Request permissions first
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    // Download the image
    const filename = imageUrl.split('/').pop() || 'image.jpg';
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (Platform.OS === 'web') {
      // For web, create a download link
      const link = document.createElement('a');
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return uri;
    } else {
      // Save to device's media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Camera3DViewer', asset, false);
      return asset.uri;
    }
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}