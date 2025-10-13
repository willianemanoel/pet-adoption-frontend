import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

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
  const [formData, setFormData] = useState<PetFormData>({
    name: pet?.name || '', breed: pet?.breed || '', age: pet?.age || '',
    ageUnit: pet?.ageUnit || 'meses', size: pet?.size || 'Médio',
    sex: pet?.sex || 'Fêmea', description: pet?.description || '', location: pet?.location || ''
  });

  const handleSubmit = async () => {
    // ... (lógica de submit permanece a mesma)
    navigation.goBack();
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
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <Text style={styles.title}>{pet ? 'Editar Pet' : 'Adicionar Pet'}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Feather name="x" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
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
});

export default AddEditPetScreen;