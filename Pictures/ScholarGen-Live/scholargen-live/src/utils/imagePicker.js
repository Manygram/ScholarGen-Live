// Thin wrapper around expo-image-picker.
//
// The module is lazily `require`d so the app still bundles and runs even if the
// native package has not been installed yet (e.g. on web preview). Callers get
// back a local image URI, or null if the user cancels / the picker is missing.
import { Alert } from 'react-native';

export async function pickProfileImage() {
  let ImagePicker;
  try {
    ImagePicker = require('expo-image-picker');
  } catch {
    Alert.alert(
      'Image picker unavailable',
      'Run "npx expo install expo-image-picker" to enable photo uploads.',
    );
    return null;
  }

  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to upload a picture.');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType ? ['images'] : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return null;
    return result.assets?.[0]?.uri ?? null;
  } catch {
    Alert.alert('Could not pick image', 'Something went wrong selecting your photo.');
    return null;
  }
}
