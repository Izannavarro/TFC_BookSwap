import * as FileSystem from 'expo-file-system';

export default convertImageToBase64 = async (imageUri) => {
  try {
    const base64String = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64String;
  } catch (error) {
    console.error('Error convirtiendo imagen a Base64:', error);
  }
};