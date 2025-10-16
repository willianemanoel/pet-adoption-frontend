// src/components/ImageUploader.tsx
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
    existingImages: string[];
    newImages: string[];
    onPickImage: () => void;
    onRemoveExisting: (uri: string) => void;
    onRemoveNew: (uri: string) => void;
}

const ImagePreview: React.FC<{ uri: string; onRemove: () => void; }> = ({ uri, onRemove }) => (
    <View style={styles.imageWrapper}>
        <Image source={{ uri }} style={styles.petImage} />
        <TouchableOpacity style={styles.removeIcon} onPress={onRemove}>
            <Feather name="x-circle" size={24} color="#EF4444" />
        </TouchableOpacity>
    </View>
);

export const ImageUploader: React.FC<Props> = ({ existingImages, newImages, onPickImage, onRemoveExisting, onRemoveNew }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>Fotos *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
            {existingImages.map((uri) => <ImagePreview key={uri} uri={uri} onRemove={() => onRemoveExisting(uri)} />)}
            {newImages.map((uri) => <ImagePreview key={uri} uri={uri} onRemove={() => onRemoveNew(uri)} />)}
            <TouchableOpacity style={styles.addImageButton} onPress={onPickImage}>
                <Feather name="plus" size={24} color="#3B82F6" />
            </TouchableOpacity>
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
    imageContainer: { flexDirection: 'row', paddingVertical: 10 },
    imageWrapper: { marginRight: 10, position: 'relative' },
    petImage: { width: 100, height: 100, borderRadius: 12 },
    removeIcon: { position: 'absolute', top: -5, right: -5, backgroundColor: 'white', borderRadius: 12 },
    addImageButton: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#3B82F6', borderStyle: 'dashed' }
});