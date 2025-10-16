// src/screens/AddEditPetScreen.tsx
import React, { useState, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert,
    ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';

import { API_BASE_URL } from '../config/api';
import { Pet } from '../types/types';
import { ImageUploader } from '../components/ImageUploader';
import { FormInput } from '../components/FormInput';
import { SegmentedControl } from '../components/SegmentedControl';

type AddEditPetScreenRouteProp = RouteProp<{ params: { pet?: Pet } }, 'params'>;

export const AddEditPetScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<AddEditPetScreenRouteProp>();
    const { pet } = route.params || {};
    const isEditing = !!pet;

    const [loading, setLoading] = useState(false);
    const [existingImages, setExistingImages] = useState<string[]>(pet?.photos || []);
    const [newImages, setNewImages] = useState<ImagePickerAsset[]>([]);
    
    const [formData, setFormData] = useState({
        name: pet?.name || '',
        breed: pet?.breed || '',
        age: pet?.age?.toString() || '',
        ageUnit: pet?.ageUnit || 'meses',
        size: pet?.size || 'Médio',
        sex: pet?.sex || 'Fêmea',
        description: pet?.description || '',
        location: pet?.location || ''
    });

    // ✅ Adicionado tipo 'string' ao parâmetro 'value'
    const updateField = useCallback((field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsMultipleSelection: true,
        });

        if (!result.canceled && result.assets) {
            setNewImages(prev => [...prev, ...result.assets]);
        }
    };
    
    const handleRemoveExisting = (uri: string) => setExistingImages(prev => prev.filter(img => img !== uri));
    const handleRemoveNew = (uri: string) => setNewImages(prev => prev.filter(img => img.uri !== uri));

    const handleSubmit = async () => {
        if (!formData.name || !formData.breed || !formData.age || !formData.location || !formData.description) {
            Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos com asterisco (*).');
            return;
        }

        setLoading(true);
        const petData = new FormData();

        Object.keys(formData).forEach(key => {
            petData.append(key, formData[key as keyof typeof formData]);
        });
        
        newImages.forEach((asset, index) => {
            const uri = asset.uri;
            const ext = uri.split('.').pop();
            const type = asset.mimeType || `image/${ext}`;
            
            petData.append('photos', {
                uri,
                name: asset.fileName || `photo_${Date.now()}_${index}.${ext}`,
                type,
            } as any);
        });

        if (isEditing) {
            petData.append('existingPhotos', JSON.stringify(existingImages));
        }

        try {
            const url = isEditing ? `${API_BASE_URL}/animals/${pet.id}` : `${API_BASE_URL}/animals`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, { method, body: petData });
            const result = await response.json();

            if (response.ok) {
                Alert.alert('Sucesso!', `Pet ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso.`);
                navigation.goBack();
            } else {
                throw new Error(result.message || 'Ocorreu um erro no servidor.');
            }
        } catch (error: any) {
            console.error('Erro ao salvar o pet:', error);
            Alert.alert('Erro', error.message || 'Não foi possível conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        if (!pet) return;

        Alert.alert(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir ${pet.name}? Esta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await fetch(`${API_BASE_URL}/animals/${pet.id}`, { method: 'DELETE' });
                            if (response.ok) {
                                Alert.alert('Sucesso!', 'Pet excluído com sucesso.');
                                navigation.goBack();
                            } else {
                                throw new Error('Falha ao excluir o pet.');
                            }
                        } catch (error: any) {
                            Alert.alert('Erro', error.message);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.header}>
                    <Text style={styles.title}>{isEditing ? 'Editar Pet' : 'Cadastrar Pet'}</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Feather name="x" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.form}>
                        <ImageUploader
                            existingImages={existingImages}
                            newImages={newImages.map(img => img.uri)}
                            onPickImage={pickImage}
                            onRemoveExisting={handleRemoveExisting}
                            onRemoveNew={handleRemoveNew}
                        />

                        {/* ✅ Adicionado tipo '(v: string)' em todas as chamadas */}
                        <FormInput label="Nome *" value={formData.name} onChangeText={(v: string) => updateField('name', v)} placeholder="Ex: Bob" />
                        <FormInput label="Raça *" value={formData.breed} onChangeText={(v: string) => updateField('breed', v)} placeholder="Ex: Vira-lata" />
                        
                        <View style={styles.row}>
                            <View style={{ flex: 2, marginRight: 12 }}>
                                <FormInput label="Idade *" value={formData.age} onChangeText={(v: string) => updateField('age', v)} keyboardType="numeric" placeholder="Ex: 2" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <SegmentedControl
                                    label=" "
                                    options={['meses', 'anos']}
                                    selectedValue={formData.ageUnit}
                                    onSelect={(v: string) => updateField('ageUnit', v)}
                                />
                            </View>
                        </View>
                        
                        <SegmentedControl label="Porte *" options={['Pequeno', 'Médio', 'Grande']} selectedValue={formData.size} onSelect={(v: string) => updateField('size', v)} />
                        <SegmentedControl label="Sexo *" options={['Fêmea', 'Macho']} selectedValue={formData.sex} onSelect={(v: string) => updateField('sex', v)} />
                        
                        <FormInput label="Localização *" value={formData.location} onChangeText={(v: string) => updateField('location', v)} placeholder="Ex: São Paulo, SP" />
                        <FormInput label="Descrição *" value={formData.description} onChangeText={(v: string) => updateField('description', v)} multiline placeholder="Descreva a personalidade do pet..." />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Pet'}</Text>}
                    </TouchableOpacity>
                    {isEditing && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
                            <Text style={styles.deleteButtonText}>Excluir Pet</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderColor: '#E5E7EB' },
    title: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
    closeButton: { padding: 4 },
    form: { paddingHorizontal: 24, paddingBottom: 24 },
    row: { flexDirection: 'row', alignItems: 'flex-start' },
    footer: { padding: 24, borderTopWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
    submitButton: { backgroundColor: '#3B82F6', borderRadius: 16, padding: 16, alignItems: 'center' },
    submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    deleteButton: { marginTop: 12, padding: 12, alignItems: 'center' },
    deleteButtonText: { color: '#EF4444', fontSize: 14, fontWeight: '500' },
});

export default AddEditPetScreen;