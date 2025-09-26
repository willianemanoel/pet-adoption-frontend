import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const UserProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={40} color="#6B7280" />
        </View>
        <Text style={styles.userName}>Maria Silva</Text>
        <Text style={styles.userEmail}>maria.silva@email.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minhas Informações</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="user" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Dados Pessoais</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="home" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Informações da Casa</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="heart" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Preferências de Adoção</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minhas Adoções</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="list" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Processos em Andamento</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="check-circle" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Adoções Concluídas</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="bell" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Notificações</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="lock" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Privacidade e Segurança</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="help-circle" size={20} color="#3B82F6" />
          <Text style={styles.menuText}>Ajuda e Suporte</Text>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileScreen;