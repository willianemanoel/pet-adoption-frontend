// src/components/SegmentedControl.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    label: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

export const SegmentedControl: React.FC<Props> = ({ label, options, selectedValue, onSelect }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.selectContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[styles.selectOption, selectedValue === option && styles.selectOptionActive]}
                    onPress={() => onSelect(option)}
                >
                    <Text style={[styles.selectText, selectedValue === option && styles.selectTextActive]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

const styles = StyleSheet.create({
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
    selectContainer: { flexDirection: 'row', backgroundColor: '#F7F8FA', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', height: 58 },
    selectOption: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    selectOptionActive: { backgroundColor: '#3B82F6' },
    selectText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    selectTextActive: { color: '#FFFFFF', fontWeight: '600' },
});