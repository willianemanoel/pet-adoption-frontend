// src/components/FormInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
    label: string;
}

export const FormInput: React.FC<Props> = ({ label, ...props }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.textInput, props.multiline && styles.textArea]}
            placeholderTextColor="#9CA3AF"
            {...props}
        />
    </View>
);

const styles = StyleSheet.create({
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
    textInput: { backgroundColor: '#F7F8FA', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', color: '#1F2937' },
    textArea: { minHeight: 120, textAlignVertical: 'top' }
});