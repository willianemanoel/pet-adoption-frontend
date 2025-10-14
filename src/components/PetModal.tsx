import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Pet } from '../types/types';

interface PetModalProps {
  visible: boolean;
  pet: Pet | null; // Permite que o pet seja nulo para evitar erros ao fechar
  onClose: () => void;
  onAdopt: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const PetModal: React.FC<PetModalProps> = ({ visible, pet, onClose, onAdopt, isFavorite, onToggleFavorite }) => {
  if (!pet) {
    return null; // Não renderiza nada se não houver um pet selecionado
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade" // Animação mais suave
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: pet.photos?.[0] || 'https://placehold.co/600x400/E5E7EB/6B7280?text=Pet' }}
            style={styles.petImage}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#6B7280" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petDetails}>{pet.breed} • {pet.age} {pet.ageUnit}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.favoriteButton]}
                onPress={onToggleFavorite}
              >
                <Feather
                  name="heart"
                  size={22}
                  color={isFavorite ? '#FFFFFF' : '#FF6B6B'}
                  fill={isFavorite ? '#FF6B6B' : 'none'}
                />
                <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>
                  {isFavorite ? 'Favorito' : 'Favoritar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.adoptButton]}
                onPress={onAdopt}
              >
                <Feather name="message-circle" size={22} color="#FFFFFF" />
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                  Adotar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  petImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
  },
  favoriteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FFD6D6'
  },
  adoptButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});