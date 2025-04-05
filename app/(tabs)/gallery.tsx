import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useCameraConnection } from '@/hooks/useCameraConnection';
import { fetchImages } from '@/utils/api';

interface ImageGroup {
  id: string;
  images: string[];
}

export default function GalleryScreen() {
  const router = useRouter();
  const { ipAddress, isConnected } = useCameraConnection();
  const [imageGroups, setImageGroups] = useState<ImageGroup[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    try {
      if (!isConnected) return;
      const images = await fetchImages(ipAddress);
      
      // Group images by their number (1X, 1Y, 1Z belong together)
      const groups = images.reduce((acc: { [key: string]: string[] }, img: string) => {
        const groupId = img.charAt(0); // Get the number part
        if (!acc[groupId]) acc[groupId] = [];
        acc[groupId].push(img);
        return acc;
      }, {});

      const formattedGroups = Object.entries(groups).map(([id, images]) => ({
        id,
        images,
      }));

      setImageGroups(formattedGroups);
      setError(null);
    } catch (err) {
      setError('Failed to load images. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadImages();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isConnected) {
      loadImages();
    }
  }, [isConnected]);

  const renderItem = ({ item }: { item: ImageGroup }) => (
    <TouchableOpacity
      style={styles.groupContainer}
      onPress={() => router.push(`/editor/${item.id}`)}>
      <Image
        source={{ uri: `http://${ipAddress}:8080/${item.images[0]}` }}
        style={styles.thumbnail}
      />
      <Text style={styles.groupTitle}>Group {item.id}</Text>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={imageGroups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  groupContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  groupTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});