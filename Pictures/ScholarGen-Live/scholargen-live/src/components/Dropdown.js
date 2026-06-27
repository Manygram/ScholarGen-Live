// Reusable select-style dropdown. Renders a tappable field that opens a modal
// list of options. Used for things like the Nigerian state picker where a free
// text input would be error-prone.
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Dropdown({
  value,
  options = [],
  onChange,
  placeholder = 'Select…',
  searchable = true,
  iconName = 'chevron-down',
  leftIcon,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const pick = (option) => {
    onChange?.(option);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        {leftIcon ? <Feather name={leftIcon} size={18} color="#34931A" style={styles.leftIcon} /> : null}
        <Text style={[styles.fieldText, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Feather name={iconName} size={18} color="#8B9A8B" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
                <Feather name="x" size={22} color="#8B9A8B" />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchBox}>
                <Feather name="search" size={16} color="#8B9A8B" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search…"
                  placeholderTextColor="#8B9A8B"
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                />
              </View>
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => pick(item)}>
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item}</Text>
                    {selected && <Feather name="check" size={18} color="#34931A" />}
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4E5D4',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  leftIcon: { marginRight: 12 },
  fieldText: { flex: 1, fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  placeholder: { color: '#8B9A8B' },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,36,12,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    maxHeight: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: { color: '#1A1A1A', fontSize: 17, fontWeight: '800' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  list: { flexGrow: 0 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F9F5',
  },
  optionText: { color: '#1A1A1A', fontSize: 15, fontWeight: '500' },
  optionTextSelected: { color: '#34931A', fontWeight: '700' },
});
