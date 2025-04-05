import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Canvas } from '@react-three/fiber/native';
import { useCameraConnection } from '@/hooks/useCameraConnection';
import { fetchImageGroup } from '@/utils/api';
import { Image3DViewer } from '@/components/Image3DViewer';
import { EditControls } from '@/components/EditControls';

export default function EditorScreen() {
  const { id } = useLocalSearchParams();
  const { ipAddress } = useCameraConnection();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const groupImages = await fetchImageGroup(ipAddress, id as string);
        setImages(groupImages);
      } catch (err) {
        setError('Failed to load images');
      }
    };

    loadImages();
  }, [id, ipAddress]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Image3DViewer images={images} />
      </Canvas>
      <EditControls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  canvas: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});