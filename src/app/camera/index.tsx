import { useCameraStore } from '@/presentation/store/useCameraStore';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { useTheme } from '@/presentation/theme/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

export default function CameraScreen() {
  const { addSelectedImage } = useCameraStore();

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestCameraPermission] = useCameraPermissions();
  const [, requestMediaPermission] = MediaLibrary.usePermissions({
    writeOnly: true,
  });

  const [selectedImage, setSelectedImage] = useState<string>();

  const cameraRef = useRef<CameraView>(null);

  const onRequestPermission = async () => {
    try {
      const { status: cameraPermissionStatus } =
        await requestCameraPermission();

      if (cameraPermissionStatus !== 'granted') {
        Alert.alert(
          'Lo siento',
          'Necesitamos permiso a la camara para tomar fotos',
        );
        return;
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Algo salio mal con los permisos');
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={{
          ...styles.container,
          marginHorizontal: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={styles.message}>
          Necesitamos permiso para usar la camara y galeria
        </Text>
        <TouchableOpacity onPress={onRequestPermission}>
          <ThemedText type="subtitle">Solicitar permiso</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const onShutterButtonPress = async () => {
    if (!cameraRef.current) return;

    const picture = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });

    if (!picture?.uri) return;

    setSelectedImage(picture.uri);
  };

  const onReturnCancel = () => {
    router.dismiss();
  };

  const onPictureAccepted = async () => {
    if (!selectedImage) return;
    try {
      const permission = await requestMediaPermission();
      if (!permission.granted) {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos permiso para guardar la foto en la fototeca.',
        );
        return;
      }

      await MediaLibrary.Asset.create(selectedImage);
      addSelectedImage(selectedImage);
      router.dismiss();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la foto en la fototeca.');
    }
  };

  const onRetakePhoto = () => {
    setSelectedImage(undefined);
  };

  const onPickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        aspect: [4, 3],
        // allowsEditing: true,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets[0]) {
        result.assets.forEach((asset) => {
          addSelectedImage(asset.uri);
        });
        router.dismiss();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo abrir la galeria de fotos.');
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.camera} />
        <ConfirmImageButton onPress={onPictureAccepted} />
        <RetakeImageButton onPress={onRetakePhoto} />
        <ReturnButton onPress={onReturnCancel} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

      <FlipCamerButton onPress={toggleCameraFacing} />
      <GalleryButton onPress={onPickImage} />

      <ReturnButton onPress={onReturnCancel} />

      <ShutterButton onPress={onShutterButtonPress} />
      {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity> */}
    </View>
  );
}

//Custom Components
const ShutterButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  const { primary } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: primary,
        },
      ]}
    ></TouchableOpacity>
  );
};

const ConfirmImageButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  const { primary } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: primary,
        },
      ]}
    >
      <Ionicons name="checkmark-outline" size={30} color={primary} />
    </TouchableOpacity>
  );
};

const RetakeImageButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.flipCameraButton} onPress={onPress}>
      <Ionicons name="close-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const FlipCamerButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.flipCameraButton} onPress={onPress}>
      <Ionicons name="camera-reverse-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const GalleryButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.galleryButton} onPress={onPress}>
      <Ionicons name="images-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const ReturnButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.returnCancelButton} onPress={onPress}>
      <Ionicons name="arrow-back-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    right: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  returnCancelButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    top: 50,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
