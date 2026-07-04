import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { styles } from "./PlantDropdown.styles";

const colors = Colors.light as any;

export type PlantDropdownOption = {
  id: string;
  name: string;
  location: string | null;
  plant_species: {
    name: string;
  } | null;
};

type PlantDropdownProps = {
  plants: PlantDropdownOption[];
  selectedPlantId: string | null;
  onSelect: (plantId: string) => void;
  placeholder?: string;
};

export default function PlantDropdown({
  plants,
  selectedPlantId,
  onSelect,
  placeholder = "Izaberite biljku",
}: PlantDropdownProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const selectedPlant = useMemo(() => {
    return plants.find((plant) => plant.id === selectedPlantId) ?? null;
  }, [plants, selectedPlantId]);

  const filteredPlants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return plants;
    }

    return plants.filter((plant) => {
      const plantName = plant.name ?? "";
      const speciesName = plant.plant_species?.name ?? "";
      const location = plant.location ?? "";

      return (
        plantName.toLowerCase().includes(query) ||
        speciesName.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query)
      );
    });
  }, [plants, search]);

  function handleSelect(plantId: string) {
    onSelect(plantId);
    setVisible(false);
    setSearch("");
  }

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.dropdownButton} onPress={() => setVisible(true)}>
        <Text
          style={[
            styles.dropdownText,
            !selectedPlant && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedPlant ? selectedPlant.name : placeholder}
        </Text>

        <Ionicons name="chevron-down" size={24} color={colors.textLightest} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <Text style={styles.modalTitle}>Izaberite biljku</Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Pretraži biljku..."
              placeholderTextColor="#777"
              style={styles.searchInput}
            />

            <ScrollView
              style={styles.optionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filteredPlants.length === 0 ? (
                <Text style={styles.emptyText}>Nema rezultata.</Text>
              ) : (
                filteredPlants.map((plant) => {
                  const selected = plant.id === selectedPlantId;

                  return (
                    <Pressable
                      key={plant.id}
                      style={[styles.option, selected && styles.selectedOption]}
                      onPress={() => handleSelect(plant.id)}
                    >
                      <View style={styles.optionTextBox}>
                        <Text style={styles.optionName} numberOfLines={1}>
                          {plant.name}
                        </Text>

                        <Text style={styles.optionSubtitle} numberOfLines={1}>
                          {plant.plant_species?.name ?? "Vrsta nije uneta"}
                          {plant.location ? ` • ${plant.location}` : ""}
                        </Text>
                      </View>

                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={22}
                          color={colors.textDarkest}
                        />
                      )}
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
