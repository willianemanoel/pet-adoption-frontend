import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { Pet } from '../types/types';

interface PetModalProps {
  visible: boolean;
  pet: Pet;
  onClose: () => void;
  onAdopt: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const PetModal: React.FC<PetModalProps> = ({ visible, pet, onClose, onAdopt, isFavorite, onToggleFavorite }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text>{pet.type}</Text>
        <Button title={isFavorite ? "Remover dos favoritos" : "Favoritar"} onPress={onToggleFavorite} />
        <Button title="Adotar" onPress={onAdopt} />
        <Button title="Fechar" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffdd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
