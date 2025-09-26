import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
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
  const { pet } = route.params as any;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    breed: '',
    age: '',
    ageUnit: 'meses',
    size: 'Médio',
    sex: 'Fêmea',
    description: '',
    location: ''
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        breed: pet.breed || '',
        age: pet.age || '',
        ageUnit: pet.ageUnit || 'meses',
        size: pet.size || 'Médio',
        sex: pet.sex || 'Fêmea',
        description: pet.description || '',
        location: pet.location || ''
      });
    }
  }, [pet]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.breed || !formData.age || !formData.description) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const url = pet ? `http://192.168.0.107:3000/api/animals/${pet.id}` : 'http://192.168.0.107:3000/api/animals';
      const method = pet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Sucesso', pet ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao salvar pet');
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof PetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {pet ? 'Editar Pet' : 'Adicionar Novo Pet'}
          </Text>
          <Text style={styles.subtitle}>
            {pet ? 'Atualize as informações do pet' : 'Preencha as informações do novo pet'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Digite o nome do pet"
            />
          </View>

          {/* Raça */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raça *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.breed}
              onChangeText={(value) => updateField('breed', value)}
              placeholder="Ex: Vira-lata, Labrador, etc."
            />
          </View>

          {/* Idade */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Idade *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.age}
                onChangeText={(value) => updateField('age', value)}
                placeholder="Ex: 2"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Unidade</Text>
              <View style={styles.selectContainer}>
                <TouchableOpacity
                  style={[styles.selectOption, formData.ageUnit === 'meses' && styles.selectOptionActive]}
                  onPress={() => updateField('ageUnit', 'meses')}
                >
                  <Text style={[styles.selectText, formData.ageUnit === 'meses' && styles.selectTextActive]}>
                    Meses
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.selectOption, formData.ageUnit === 'anos' && styles.selectOptionActive]}
                  onPress={() => updateField('ageUnit', 'anos')}
                >
                  <Text style={[styles.selectText, formData.ageUnit === 'anos' && styles.selectTextActive]}>
                    Anos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Porte e Sexo */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Porte</Text>
              <View style={styles.selectContainer}>
                {['Pequeno', 'Médio', 'Grande'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.selectOption, formData.size === size && styles.selectOptionActive]}
                    onPress={() => updateField('size', size)}
                  >
                    <Text style={[styles.selectText, formData.size === size && styles.selectTextActive]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.selectContainer}>
                {['Fêmea', 'Macho'].map((sex) => (
                  <TouchableOpacity
                    key={sex}
                    style={[styles.selectOption, formData.sex === sex && styles.selectOptionActive]}
                    onPress={() => updateField('sex', sex)}
                  >
                    <Text style={[styles.selectText, formData.sex === sex && styles.selectTextActive]}>
                      {sex}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Localização */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Ex: São Paulo, SP"
            />
          </View>

          {/* Descrição */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Descreva o pet, personalidade, cuidados especiais, etc."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {pet ? 'Atualizar' : 'Cadastrar'} Pet
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
  },
  selectContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  selectOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectOptionActive: {
    backgroundColor: '#3B82F6',
  },
  selectText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectTextActive: {
    color: '#FFFFFF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddEditPetScreen;