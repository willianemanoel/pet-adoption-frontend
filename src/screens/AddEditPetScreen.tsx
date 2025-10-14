import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { API_BASE_URL } from '../config/api';

interface PetFormData {
  name: string;
  breed: string;
  age: string;
  ageUnit: string;
  size: string;
  sex: string;
  description: string;
  location: string;
}

export const AddEditPetScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = (route.params as any) || {};

  const [loading, setLoading] = useState(false);
  
  // ✅ CORREÇÃO: Garante que o estado 'images' seja sempre um array.
  const [images, setImages] = useState<string[]>(Array.isArray(pet?.photos) ? pet.photos : []);
  
  const [formData, setFormData] = useState<PetFormData>({
    name: pet?.name || '',
    breed: pet?.breed || '',
    age: pet?.age?.toString() || '',
    ageUnit: pet?.ageUnit || 'meses',
    size: pet?.size || 'Médio',
    sex: pet?.sex || 'Fêmea',
    description: pet?.description || '',
    location: pet?.location || ''
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset: ImagePickerAsset) => asset.uri)]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.breed || !formData.age || !formData.location || !formData.description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }
    setLoading(true);
    const petData = new FormData();
    Object.keys(formData).forEach(key => {
      petData.append(key, formData[key as keyof PetFormData]);
    });
    images.forEach((uri, index) => {
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      petData.append('photos', {
        uri,
        name: `photo_${index}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    });

    try {
      const isEditing = !!pet;
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
      console.error('Falha ao salvar o pet:', error);
      Alert.alert('Erro ao Salvar', error.message || 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof PetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderSelect = (label: string, options: string[], selected: string, onSelect: (value: string) => void) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.selectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.selectOption, selected === option && styles.selectOptionActive]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.selectText, selected === option && styles.selectTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <Text style={styles.title}>{pet ? 'Editar Pet' : 'Adicionar Pet'}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Feather name="x" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fotos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                {images.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.petImage} />
                ))}
                <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                  <Feather name="plus" size={24} color="#3B82F6" />
                </TouchableOpacity>
              </ScrollView>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome *</Text>
              <TextInput style={styles.textInput} value={formData.name} onChangeText={(v) => updateField('name', v)} placeholder="Ex: Bob" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raça *</Text>
              <TextInput style={styles.textInput} value={formData.breed} onChangeText={(v) => updateField('breed', v)} placeholder="Ex: Vira-lata" />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Idade *</Text>
                <TextInput style={styles.textInput} value={formData.age} onChangeText={(v) => updateField('age', v)} keyboardType="numeric" placeholder="Ex: 2" />
              </View>
              {renderSelect('', ['meses', 'anos'], formData.ageUnit, (v) => updateField('ageUnit', v))}
            </View>
            {renderSelect('Porte', ['Pequeno', 'Médio', 'Grande'], formData.size, (v) => updateField('size', v))}
            {renderSelect('Sexo', ['Fêmea', 'Macho'], formData.sex, (v) => updateField('sex', v))}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Localização *</Text>
              <TextInput style={styles.textInput} value={formData.location} onChangeText={(v) => updateField('location', v)} placeholder="Ex: São Paulo, SP" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput style={[styles.textInput, styles.textArea]} value={formData.description} onChangeText={(v) => updateField('description', v)} multiline placeholder="Descreva a personalidade do pet..." />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>{pet ? 'Salvar Alterações' : 'Cadastrar Pet'}</Text>}
          </TouchableOpacity>
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
  form: { padding: 24, flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  textInput: { backgroundColor: '#F7F8FA', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  selectContainer: { flexDirection: 'row', backgroundColor: '#F7F8FA', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', height: 58 },
  selectOption: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  selectOptionActive: { backgroundColor: '#3B82F6' },
  selectText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  selectTextActive: { color: '#FFFFFF' },
  footer: { padding: 24, borderTopWidth: 1, borderColor: '#E5E7EB' },
  submitButton: { backgroundColor: '#3B82F6', borderRadius: 16, padding: 16, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  imageContainer: { flexDirection: 'row', paddingVertical: 10 },
  petImage: { width: 100, height: 100, borderRadius: 12, marginRight: 10 },
  addImageButton: {
    width: 100, height: 100, borderRadius: 12, backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
    borderColor: '#3B82F6', borderStyle: 'dashed'
  }
});

export default AddEditPetScreen;