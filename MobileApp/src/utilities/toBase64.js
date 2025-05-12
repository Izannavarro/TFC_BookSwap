import * as FileSystem from 'expo-file-system';

export default imageToBase64 = async (uri) => {
  try {
    const base64String = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64String;
  } catch (error) {
    console.error('Error al convertir la imagen a Base64:', error);
    throw error;
  }
};