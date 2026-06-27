import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { CATEGORY_GROUPS } from '../data/catalog';
import { colors } from '../theme';

// The Admin Dashboard lets ScholarGen administrators manage the entire learning
// catalog — categories, subjects, examinations, education levels, streams,
// promotional banners, pricing & family packages and group classes — with full
// add / edit / delete / enable / disable control. Whatever Admins publish here
// is exactly what tutors and students see, so the platform can expand without
// any developer changing code.

const SECTIONS = [
  { key: 'categories', label: 'Categories' },
  { key: 'subjects', label: 'Subjects' },
  { key: 'examinations', label: 'Exams' },
  { key: 'educationLevels', label: 'Levels' },
  { key: 'streams', label: 'Streams' },
  { key: 'banners', label: 'Banners' },
  { key: 'packages', label: 'Packages' },
  { key: 'familyPackages', label: 'Family' },
  { key: 'groupClasses', label: 'Group Classes' },
];

// Per-section display + form configuration.
const CONFIG = {
  categories: {
    title: 'Learning Categories',
    primary: (i) => i.name,
    secondary: (i) => i.group,
    defaults: { name: '', group: CATEGORY_GROUPS[0], icon: 'school' },
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'group', label: 'Group', type: 'select', options: CATEGORY_GROUPS },
      { key: 'icon', label: 'Ionicon name', type: 'text' },
    ],
  },
  subjects: {
    title: 'Subjects',
    primary: (i) => i.name,
    secondary: () => 'Subject',
    defaults: { name: '' },
    fields: [{ key: 'name', label: 'Name', type: 'text' }],
  },
  examinations: {
    title: 'Examinations',
    primary: (i) => i.name,
    secondary: () => 'Examination',
    defaults: { name: '' },
    fields: [{ key: 'name', label: 'Name', type: 'text' }],
  },
  educationLevels: {
    title: 'Education Levels',
    primary: (i) => i.name,
    secondary: (i) => i.group,
    defaults: { name: '', group: 'Primary School' },
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'group', label: 'Group', type: 'text' },
    ],
  },
  streams: {
    title: 'Streams',
    primary: (i) => i.name,
    secondary: () => 'Stream',
    defaults: { name: '' },
    fields: [{ key: 'name', label: 'Name', type: 'text' }],
  },
  banners: {
    title: 'Promotional Banners',
    primary: (i) => i.title,
    secondary: (i) => `${i.buttonText} → ${i.link}`,
    defaults: {
      title: '',
      description: '',
      buttonText: 'Learn More',
      link: '',
      linkType: 'external',
      colors: ['#10240C', '#1A3312'],
    },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'multiline' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'link', label: 'Destination (URL or screen name)', type: 'text' },
      { key: 'linkType', label: 'Link Type', type: 'select', options: ['external', 'internal'] },
    ],
  },
  packages: {
    title: 'Pricing Packages',
    primary: (i) => i.name,
    secondary: (i) => `₦${Number(i.price).toLocaleString('en-NG')} / ${i.period}`,
    defaults: { name: '', price: 0, period: 'month', details: '', features: [], popular: false },
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'price', label: 'Price (₦)', type: 'number' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'details', label: 'Details', type: 'text' },
      { key: 'features', label: 'Features (comma separated)', type: 'list' },
      { key: 'popular', label: 'Mark as Popular', type: 'boolean' },
    ],
  },
  familyPackages: {
    title: 'Family Packages',
    primary: (i) => i.name,
    secondary: (i) => `${i.children} children · ${i.discountPercent}% off`,
    defaults: { name: '', children: 2, price: 0, discountPercent: 0, eligibility: '' },
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'children', label: 'Number of Children', type: 'number' },
      { key: 'price', label: 'Price (₦)', type: 'number' },
      { key: 'discountPercent', label: 'Discount %', type: 'number' },
      { key: 'eligibility', label: 'Eligibility Rules', type: 'multiline' },
    ],
  },
  groupClasses: {
    title: 'Group Classes',
    primary: (i) => i.title,
    secondary: (i) => `${i.schedule} · ₦${Number(i.price).toLocaleString('en-NG')}`,
    defaults: { title: '', description: '', price: 0, schedule: '', seats: 50, enrolled: 0 },
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'multiline' },
      { key: 'price', label: 'Price (₦)', type: 'number' },
      { key: 'schedule', label: 'Schedule', type: 'text' },
      { key: 'seats', label: 'Total Seats', type: 'number' },
    ],
  },
};

function formFromItem(config, item) {
  const form = {};
  config.fields.forEach((f) => {
    const value = item[f.key];
    if (f.type === 'number') form[f.key] = value != null ? String(value) : '';
    else if (f.type === 'list') form[f.key] = Array.isArray(value) ? value.join(', ') : '';
    else if (f.type === 'boolean') form[f.key] = !!value;
    else form[f.key] = value != null ? value : '';
  });
  return form;
}

function itemFromForm(config, form) {
  const out = {};
  config.fields.forEach((f) => {
    const value = form[f.key];
    if (f.type === 'number') out[f.key] = Number(value) || 0;
    else if (f.type === 'list') {
      out[f.key] = String(value || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === 'boolean') out[f.key] = !!value;
    else out[f.key] = value;
  });
  return out;
}

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const app = useApp();

  const [section, setSection] = useState('categories');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  // Bind each section key to its list + CRUD api from context.
  const data = useMemo(
    () => ({
      categories: { list: app.categories, api: app.categoriesApi },
      subjects: { list: app.subjects, api: app.subjectsApi },
      examinations: { list: app.examinations, api: app.examinationsApi },
      educationLevels: { list: app.educationLevels, api: app.educationLevelsApi },
      streams: { list: app.streams, api: app.streamsApi },
      banners: { list: app.banners, api: app.bannersApi },
      packages: { list: app.packages, api: app.packagesApi },
      familyPackages: { list: app.familyPackages, api: app.familyPackagesApi },
      groupClasses: { list: app.groupClasses, api: app.groupClassesApi },
    }),
    [app],
  );

  const config = CONFIG[section];
  const { list, api } = data[section];

  const openAdd = () => {
    setEditingId(null);
    setForm(formFromItem(config, config.defaults));
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm(formFromItem(config, item));
    setModalOpen(true);
  };

  const save = () => {
    const payload = itemFromForm(config, form);
    if (editingId) api.update(editingId, payload);
    else api.add({ ...config.defaults, ...payload });
    setModalOpen(false);
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[colors.brandDeep, colors.brandDeep2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color="#DDF0D6" />
          </TouchableOpacity>
          <View style={styles.adminBadge}>
            <Feather name="shield" size={12} color={colors.brandBright} />
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage the learning catalog & marketing.</Text>
      </LinearGradient>

      {/* Section selector */}
      <View style={styles.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsStrip}
        >
          {SECTIONS.map((s) => {
            const active = section === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.tab, active && styles.tabActive]}
                activeOpacity={0.7}
                onPress={() => setSection(s.key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{config.title}</Text>
          <Text style={styles.countText}>{list.length} items</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={openAdd}>
          <Feather name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add {config.title.replace(/s$/, '')}</Text>
        </TouchableOpacity>

        {list.map((item) => (
          <View key={item.id} style={[styles.row, !item.enabled && styles.rowDisabled]}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowPrimary} numberOfLines={1}>{config.primary(item)}</Text>
              <Text style={styles.rowSecondary} numberOfLines={1}>{config.secondary(item)}</Text>
            </View>

            <Switch
              trackColor={{ false: '#Edf4E9', true: colors.brand }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#Edf4E9"
              value={!!item.enabled}
              onValueChange={() => api.toggle(item.id)}
              style={styles.switch}
            />

            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => openEdit(item)}>
              <Feather name="edit-2" size={16} color={colors.brand} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => api.remove(item.id)}>
              <Feather name="trash-2" size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add / Edit modal */}
      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Edit' : 'Add'} {config.title.replace(/s$/, '')}
                </Text>
                <TouchableOpacity onPress={() => setModalOpen(false)} hitSlop={8}>
                  <Feather name="x" size={22} color={colors.inkSoft} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                {config.fields.map((f) => (
                  <View key={f.key} style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>{f.label}</Text>

                    {f.type === 'select' ? (
                      <View style={styles.selectRow}>
                        {f.options.map((opt) => {
                          const active = form[f.key] === opt;
                          return (
                            <TouchableOpacity
                              key={opt}
                              style={[styles.selectChip, active && styles.selectChipActive]}
                              activeOpacity={0.8}
                              onPress={() => setField(f.key, opt)}
                            >
                              <Text style={[styles.selectChipText, active && styles.selectChipTextActive]}>
                                {opt}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : f.type === 'boolean' ? (
                      <Switch
                        trackColor={{ false: '#Edf4E9', true: colors.brand }}
                        thumbColor="#FFFFFF"
                        value={!!form[f.key]}
                        onValueChange={(v) => setField(f.key, v)}
                      />
                    ) : (
                      <TextInput
                        style={[styles.input, f.type === 'multiline' && styles.inputMultiline]}
                        value={String(form[f.key] ?? '')}
                        onChangeText={(t) => setField(f.key, t)}
                        placeholder={f.label}
                        placeholderTextColor={colors.inkSoft}
                        keyboardType={f.type === 'number' ? 'numeric' : 'default'}
                        multiline={f.type === 'multiline'}
                      />
                    )}
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={save}>
                <Text style={styles.saveBtnText}>{editingId ? 'Save Changes' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.glassBtn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.glassBtn,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  adminBadgeText: { color: colors.brandBright, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  headerTitle: { color: colors.inkOnDark, fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  headerSubtitle: { color: colors.inkOnDarkSoft, fontSize: 13, fontWeight: '500', marginTop: 6 },

  tabsWrap: { backgroundColor: colors.bg },
  tabsStrip: { paddingHorizontal: 24, paddingVertical: 16, gap: 10 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  tabText: { color: colors.inkSoft, fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: colors.inkOnDark },

  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  countText: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 18,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rowDisabled: { opacity: 0.55 },
  rowInfo: { flex: 1, marginRight: 8 },
  rowPrimary: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  rowSecondary: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginTop: 2 },
  switch: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  // -- MODAL --
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,36,12,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: { color: colors.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  modalScroll: { marginBottom: 16 },

  fieldGroup: { marginBottom: 16 },
  fieldLabel: { color: colors.ink, fontSize: 13, fontWeight: '800', marginBottom: 8 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },

  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  selectChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  selectChipText: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },
  selectChipTextActive: { color: colors.inkOnDark, fontWeight: '700' },

  saveBtn: {
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
