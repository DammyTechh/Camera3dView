import axios from 'axios';
import { parse } from 'node-html-parser';

export async function fetchImages(ipAddress: string): Promise<string[]> {
  try {
    const response = await axios.get(`http://${ipAddress}:8080`);
    const root = parse(response.data);
    
    // Find all image elements and extract their sources
    const images = root.querySelectorAll('img')
      .map(img => img.getAttribute('src'))
      .filter((src): src is string => src !== null)
      .map(src => `http://${ipAddress}:8080${src}`);

    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function fetchImageGroup(ipAddress: string, groupId: string): Promise<string[]> {
  const allImages = await fetchImages(ipAddress);
  return allImages.filter(img => img.includes(groupId));
}

export async function downloadImage(ipAddress: string, filename: string): Promise<Blob> {
  const response = await axios.get(`http://${ipAddress}:8080/download/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
}