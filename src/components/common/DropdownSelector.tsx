import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

interface DropdownOption<T> {
  value: T;
  label: string;
}

interface DropdownSelectorProps<T> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  displayValue?: string;
}

export function DropdownSelector<T>({
  label,
  value,
  options,
  onChange,
  displayValue,
}: DropdownSelectorProps<T>): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (selectedValue: T) => {
      onChange(selectedValue);
      setIsOpen(false);
    },
    [onChange]
  );

  const currentLabel =
    displayValue ?? options.find((opt) => opt.value === value)?.label ?? '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={handleOpen}
        accessibilityLabel={`Select ${label}`}
        accessibilityRole="button"
      >
        <Text style={styles.selectorValue}>{currentLabel}</Text>
        <Text style={styles.selectorChevron}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    option.value === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.primary,
    minWidth: 100,
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  selectorValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.mono,
  },
  selectorChevron: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing[2],
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    minWidth: 200,
    maxWidth: 300,
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  modalTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[4],
    letterSpacing: 1,
  },
  optionsContainer: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  option: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface.primary,
    borderWidth: 2,
    borderColor: colors.border.secondary,
  },
  optionSelected: {
    borderColor: colors.accent[500],
    backgroundColor: colors.accent[500] + '20',
  },
  optionText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.accent[500],
    fontWeight: typography.fontWeight.bold,
  },
  closeButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
});
