import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Modal, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { styles } from "./PlantImagePickerModal.style";

const colors = Colors.light;

type PlantImagePickerModalProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onImageSelected: (image: ImagePicker.ImagePickerAsset) => void;
};

export default function PlantImagePickerModal({
  visible,
  title = "Dodaj sliku",
  onClose,
  onImageSelected,
}: PlantImagePickerModalProps) {
  async function handleTakePhoto() {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Dozvola je potrebna",
        "Morate dozvoliti pristup kameri da biste slikali biljku.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    onImageSelected(result.assets[0]);
    onClose();
  }

  async function handlePickFromGallery() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Dozvola je potrebna",
        "Morate dozvoliti pristup galeriji da biste izabrali sliku biljke.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    onImageSelected(result.assets[0]);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.yellowShape} />

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color={colors.darkest} />
        </Pressable>

        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.dragLine} />

          <Pressable style={styles.primaryCard} onPress={handleTakePhoto}>
            <View style={styles.lightIconCircle}>
              <Ionicons name="camera" size={36} color={colors.textLightest} />
            </View>

            <Text style={styles.primaryText}>Slikaj</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryCard}
            onPress={handlePickFromGallery}
          >
            <View style={styles.darkIconCircle}>
              <Ionicons
                name="image-outline"
                size={38}
                color={colors.textLightest}
              />
            </View>

            <Text style={styles.secondaryText}>Izaberi iz galerije</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
