import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import AppButton from "@/components/AppButton";
import PlantImagePickerModal from "@/components/PlantImagePickerModal";
import { Colors } from "@/constants/theme";
import { styles } from "./PlantForm.styles";

const colors = Colors.light as any;

export type PlantFormValues = {
  name: string;
  location: string;
  wateringInterval: string;
  lastWateredDate: Date;
  imageAsset: ImagePicker.ImagePickerAsset | null;
  imageUrl: string | null;
};

export type PlantSpeciesOption = {
  id: string;
  name: string;
  scientific_name: string | null;
  description: string | null;
  watering_interval: number | null;
  moisture_categories?: {
    label: string;
    moisture_min: number;
    moisture_max: number;
  } | null;
};

type PlantFormProps = {
  title: string;
  values: PlantFormValues;
  onChange: (values: PlantFormValues) => void;

  selectedSpecies: PlantSpeciesOption | null;
  speciesLocked?: boolean;

  speciesQuery?: string;
  onSpeciesQueryChange?: (value: string) => void;
  speciesResults?: PlantSpeciesOption[];
  onSelectSpecies?: (species: PlantSpeciesOption) => void;

  submitTitle: string;
  loading?: boolean;
  onSubmit: () => void;

  onCancel?: () => void;
  cancelTitle?: string;
};

export default function PlantForm({
  title,
  values,
  onChange,
  selectedSpecies,
  speciesLocked = false,
  speciesQuery = "",
  onSpeciesQueryChange,
  speciesResults = [],
  onSelectSpecies,
  submitTitle,
  loading = false,
  onSubmit,
  onCancel,
  cancelTitle = "otkaži",
}: PlantFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  function updateField<K extends keyof PlantFormValues>(
    key: K,
    value: PlantFormValues[K],
  ) {
    onChange({
      ...values,
      [key]: value,
    });
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function handleDateChange(event: any, selectedDate?: Date) {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      updateField("lastWateredDate", selectedDate);
    }
  }

  const imageSource = values.imageAsset
    ? { uri: values.imageAsset.uri }
    : values.imageUrl
      ? { uri: values.imageUrl }
      : null;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.label}>Slika biljke:</Text>

      <Pressable
        style={styles.imagePicker}
        onPress={() => setImagePickerVisible(true)}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name="image-outline"
              size={36}
              color={colors.textLightest}
            />
            <Text style={styles.imagePickerText}>Izaberi sliku</Text>
          </View>
        )}
      </Pressable>

      <Text style={styles.label}>Vrsta biljke:</Text>

      {speciesLocked ? (
        <View style={styles.disabledInput}>
          <Text style={styles.disabledInputText}>
            {selectedSpecies?.name ?? "Vrsta nije uneta"}
          </Text>
        </View>
      ) : (
        <>
          <TextInput
            value={speciesQuery}
            onChangeText={onSpeciesQueryChange}
            placeholder="Pretraži vrstu biljke..."
            placeholderTextColor={colors.textLightest}
            style={styles.input}
          />

          {speciesResults.length > 0 && (
            <View style={styles.speciesResultsBox}>
              {speciesResults.map((species) => {
                const selected = selectedSpecies?.id === species.id;

                return (
                  <Pressable
                    key={species.id}
                    style={[
                      styles.speciesOption,
                      selected && styles.selectedSpeciesOption,
                    ]}
                    onPress={() => onSelectSpecies?.(species)}
                  >
                    <Text
                      style={[
                        styles.speciesName,
                        selected && styles.selectedSpeciesName,
                      ]}
                    >
                      {species.name}
                    </Text>

                    {species.scientific_name && (
                      <Text
                        style={[
                          styles.speciesSubtitle,
                          selected && styles.selectedSpeciesSubtitle,
                        ]}
                      >
                        {species.scientific_name}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
      )}

      {selectedSpecies && (
        <View style={styles.speciesInfoBox}>
          <Text style={styles.speciesInfoTitle}>{selectedSpecies.name}</Text>

          {selectedSpecies.scientific_name && (
            <Text style={styles.speciesInfoSubtitle}>
              {selectedSpecies.scientific_name}
            </Text>
          )}
        </View>
      )}

      <Text style={styles.label}>Naziv biljke:</Text>
      <TextInput
        value={values.name}
        onChangeText={(text) => updateField("name", text)}
        placeholder="Moja monstera..."
        placeholderTextColor={colors.textLightest}
        style={styles.input}
      />

      <Text style={styles.label}>Lokacija:</Text>
      <TextInput
        value={values.location}
        onChangeText={(text) => updateField("location", text)}
        placeholder="Dnevna soba..."
        placeholderTextColor={colors.textLightest}
        style={styles.input}
      />

      <Text style={styles.label}>Interval zalivanja:</Text>
      <TextInput
        value={values.wateringInterval}
        onChangeText={(text) => updateField("wateringInterval", text)}
        placeholder="7"
        placeholderTextColor={colors.textLightest}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.helper}>
        *Napomena: Ovo je preporučeni interval zalivanja i možete ga izmeniti
        ukoliko mislite da je potrebno
      </Text>

      <Text style={styles.label}>Datum poslednjeg zalivanja:</Text>

      <Pressable
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {formatDate(values.lastWateredDate)}
        </Text>

        <Ionicons
          name="calendar-outline"
          size={24}
          color={colors.textLightest}
        />
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={values.lastWateredDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.textLightest}
        />
      ) : (
        <AppButton
          title={submitTitle}
          variant="outline"
          onPress={onSubmit}
          buttonStyle={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      )}

      {onCancel && (
        <AppButton
          title={cancelTitle}
          variant="outline"
          onPress={onCancel}
          buttonStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      )}

      <PlantImagePickerModal
        visible={imagePickerVisible}
        title="Slika biljke"
        onClose={() => setImagePickerVisible(false)}
        onImageSelected={(image) => {
          updateField("imageAsset", image);
          setImagePickerVisible(false);
        }}
      />
    </View>
  );
}
