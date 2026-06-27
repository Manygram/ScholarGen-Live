import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { AvatarPicker } from '../components/Avatar';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const STEPS = [
  { key: 'profile', title: 'Personal Info', subtitle: 'Your photo, subjects & areas you teach' },
  { key: 'documents', title: 'Verification', subtitle: 'Upload your ID and certificates' },
  { key: 'assessment', title: 'Subject Assessment', subtitle: '25–40 questions on your subject' },
  { key: 'demo', title: 'Demo Video', subtitle: 'A 3–5 minute sample lesson' },
  { key: 'review', title: 'Review & Submit', subtitle: 'Confirm and send for approval' },
];

export default function TutorOnboardingScreen() {
  const navigation = useNavigation();
  const { subjects: subjectCatalog, categories, tutorProfile, updateTutorProfile } = useApp();

  // Tutors choose only from what Admin has published.
  const subjectOptions = subjectCatalog.filter((s) => s.enabled).map((s) => s.name);
  const categoryOptions = categories.filter((c) => c.enabled);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(tutorProfile.avatar);
  const [subjects, setSubjects] = useState(['Mathematics']);
  const [teachCategories, setTeachCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleSubject = (s) =>
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleCategory = (id) =>
    setTeachCategories((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const next = async () => {
    if (!isLast) {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
      return;
    }
    // Final step → persist the tutor profile to the API. Best-effort: in the
    // demo flow a live tutor session may not exist, so we still continue.
    setSubmitting(true);
    try {
      await api.tutors.updateProfile({
        ...(name.trim() ? { full_name: name.trim() } : {}),
        subjects,
      });
    } catch {
      // Swallow — onboarding can proceed; submission is retried from the dashboard.
    }
    updateTutorProfile({
      ...(name.trim() ? { name: name.trim() } : {}),
      avatar,
    });
    setSubmitting(false);
    navigation.navigate('TutorDashboard');
  };
  const back = () => {
    if (step === 0) navigation.goBack();
    else setStep((s) => s - 1);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Gradient header with progress */}
      <LinearGradient
        colors={[colors.brandDeep, colors.brandDeep2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={back}>
            <Feather name="chevron-left" size={22} color={colors.inkOnDark} />
          </TouchableOpacity>
          <Text style={styles.stepCounter}>
            Step {step + 1} of {STEPS.length}
          </Text>
          <View style={styles.backBtn} />
        </View>

        {/* Segmented progress indicator */}
        <View style={styles.progressTrack}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSeg,
                i <= step ? styles.progressSegActive : styles.progressSegInactive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.headerTitle}>{STEPS[step].title}</Text>
        <Text style={styles.headerSubtitle}>{STEPS[step].subtitle}</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <>
            <View style={styles.photoSection}>
              <AvatarPicker uri={avatar} name={name || 'New Tutor'} size={96} onChange={setAvatar} />
              <Text style={styles.photoHint}>Add a profile photo</Text>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Funke Adeyemi"
              placeholderTextColor={colors.inkSoft}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Short Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Your teaching experience in a sentence or two…"
              placeholderTextColor={colors.inkSoft}
              value={bio}
              onChangeText={setBio}
              multiline
            />
            <Text style={styles.label}>Subjects You Teach</Text>
            <View style={styles.subjectWrap}>
              {subjectOptions.map((s) => {
                const active = subjects.includes(s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.subjectChip, active && styles.subjectChipActive]}
                    activeOpacity={0.8}
                    onPress={() => toggleSubject(s)}
                  >
                    {active && <Feather name="check" size={12} color={colors.inkOnDark} />}
                    <Text style={[styles.subjectText, active && styles.subjectTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label, { marginTop: 24 }]}>Teaching Categories</Text>
            <Text style={styles.helperText}>
              Choose from areas published by ScholarGen — academics, exams & skills.
            </Text>
            <View style={styles.subjectWrap}>
              {categoryOptions.map((c) => {
                const active = teachCategories.includes(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.subjectChip, active && styles.subjectChipActive]}
                    activeOpacity={0.8}
                    onPress={() => toggleCategory(c.id)}
                  >
                    {active && <Feather name="check" size={12} color={colors.inkOnDark} />}
                    <Text style={[styles.subjectText, active && styles.subjectTextActive]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <UploadTile
              icon="credit-card"
              title="Government ID"
              subtitle="NIN, driver's licence or passport"
              status="uploaded"
            />
            <UploadTile
              icon="award"
              title="Teaching Certificate"
              subtitle="Degree or professional certification"
              status="pending"
            />
            <UploadTile
              icon="file-text"
              title="CV / Résumé"
              subtitle="PDF, up to 5MB"
              status="optional"
            />
            <View style={styles.infoNote}>
              <Ionicons name="shield-checkmark" size={16} color={colors.brand} />
              <Text style={styles.infoNoteText}>
                Documents are reviewed within 48 hours and stored securely.
              </Text>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <View style={styles.assessCard}>
              <View style={styles.assessIcon}>
                <Ionicons name="clipboard-outline" size={28} color={colors.brand} />
              </View>
              <Text style={styles.assessTitle}>Mathematics Assessment</Text>
              <Text style={styles.assessSub}>
                A short test to confirm your subject mastery.
              </Text>
              <View style={styles.assessMetaRow}>
                <View style={styles.assessMeta}>
                  <Text style={styles.assessMetaValue}>32</Text>
                  <Text style={styles.assessMetaLabel}>Questions</Text>
                </View>
                <View style={styles.assessDivider} />
                <View style={styles.assessMeta}>
                  <Text style={styles.assessMetaValue}>40 min</Text>
                  <Text style={styles.assessMetaLabel}>Duration</Text>
                </View>
                <View style={styles.assessDivider} />
                <View style={styles.assessMeta}>
                  <Text style={styles.assessMetaValue}>70%</Text>
                  <Text style={styles.assessMetaLabel}>To pass</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
              <Feather name="play-circle" size={18} color={colors.brand} />
              <Text style={styles.outlineBtnText}>Start Assessment</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <View style={styles.videoDrop}>
              <View style={styles.videoIcon}>
                <Feather name="video" size={26} color={colors.brand} />
              </View>
              <Text style={styles.videoTitle}>Upload a 3–5 min demo lesson</Text>
              <Text style={styles.videoSub}>
                Teach a topic of your choice as if to a student. MP4, up to 200MB.
              </Text>
              <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.85}>
                <Feather name="upload-cloud" size={16} color={colors.inkOnDark} />
                <Text style={styles.uploadBtnText}>Choose Video</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>What reviewers look for</Text>
              {['Clear explanation & pacing', 'Good audio and lighting', 'Engaging teaching style'].map(
                (t) => (
                  <View key={t} style={styles.tipRow}>
                    <Feather name="check-circle" size={14} color={colors.brand} />
                    <Text style={styles.tipText}>{t}</Text>
                  </View>
                ),
              )}
            </View>
          </>
        )}

        {step === 4 && (
          <>
            <ReviewRow label="Name" value={name || 'Dr. Funke Adeyemi'} onEdit={() => setStep(0)} />
            <ReviewRow label="Subjects" value={subjects.join(', ')} onEdit={() => setStep(0)} />
            <ReviewRow label="Documents" value="ID ✓ · Certificate pending" onEdit={() => setStep(1)} />
            <ReviewRow label="Assessment" value="Completed · 84%" onEdit={() => setStep(2)} />
            <ReviewRow label="Demo Video" value="Uploaded (4:12)" onEdit={() => setStep(3)} />
            <View style={styles.infoNote}>
              <Ionicons name="time-outline" size={16} color={colors.brand} />
              <Text style={styles.infoNoteText}>
                You'll be notified once our team approves your profile — usually within 2 days.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, submitting && styles.nextBtnDisabled]}
          activeOpacity={0.85}
          onPress={next}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.inkOnDark} />
          ) : (
            <>
              <Text style={styles.nextBtnText}>
                {isLast ? 'Submit Application' : 'Continue'}
              </Text>
              <Feather name={isLast ? 'send' : 'arrow-right'} size={18} color={colors.inkOnDark} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function UploadTile({ icon, title, subtitle, status }) {
  const statusMap = {
    uploaded: { label: 'Uploaded', color: colors.success, bg: '#F1F9ED', iconName: 'check-circle' },
    pending: { label: 'Required', color: colors.warning, bg: colors.warningSoft, iconName: 'upload' },
    optional: { label: 'Optional', color: colors.inkSoft, bg: '#F4F6F4', iconName: 'upload' },
  };
  const s = statusMap[status];
  return (
    <TouchableOpacity style={styles.uploadTile} activeOpacity={0.8}>
      <View style={styles.uploadTileIcon}>
        <Feather name={icon} size={18} color={colors.brand} />
      </View>
      <View style={styles.uploadTileInfo}>
        <Text style={styles.uploadTileTitle}>{title}</Text>
        <Text style={styles.uploadTileSub}>{subtitle}</Text>
      </View>
      <View style={[styles.uploadStatus, { backgroundColor: s.bg }]}>
        <Feather name={s.iconName} size={12} color={s.color} />
        <Text style={[styles.uploadStatusText, { color: s.color }]}>{s.label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <View style={styles.reviewRow}>
      <View style={styles.reviewInfo}>
        <Text style={styles.reviewLabel}>{label}</Text>
        <Text style={styles.reviewValue} numberOfLines={1}>{value}</Text>
      </View>
      <TouchableOpacity onPress={onEdit} hitSlop={8} activeOpacity={0.7}>
        <Feather name="edit-2" size={15} color={colors.brand} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.glassBtn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCounter: { color: colors.inkOnDarkSoft2, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  progressTrack: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2 },
  progressSegActive: { backgroundColor: colors.brandBright },
  progressSegInactive: { backgroundColor: colors.glassBorder },
  headerTitle: { color: colors.inkOnDark, fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  headerSubtitle: { color: colors.inkOnDarkSoft, fontSize: 13, fontWeight: '500', marginTop: 6 },

  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },

  photoSection: { alignItems: 'center', marginBottom: 24 },
  photoHint: { color: colors.inkSoft, fontSize: 13, fontWeight: '600', marginTop: 12 },
  helperText: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginBottom: 12, marginTop: -4 },

  label: { color: colors.ink, fontSize: 14, fontWeight: '800', marginBottom: 10, letterSpacing: -0.3 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 24,
  },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },

  subjectWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 5,
  },
  subjectChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  subjectText: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },
  subjectTextActive: { color: colors.inkOnDark, fontWeight: '700' },

  uploadTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  uploadTileIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTileInfo: { flex: 1, marginLeft: 12 },
  uploadTileTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  uploadTileSub: { color: colors.inkSoft, fontSize: 12, fontWeight: '500', marginTop: 2 },
  uploadStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9,
    gap: 4,
  },
  uploadStatusText: { fontSize: 11, fontWeight: '700' },

  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.brandSoftAlt,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    gap: 10,
  },
  infoNoteText: { flex: 1, color: colors.inkSoft, fontSize: 12, fontWeight: '500', lineHeight: 18 },

  assessCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  assessIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  assessTitle: { color: colors.ink, fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  assessSub: { color: colors.inkSoft, fontSize: 13, fontWeight: '500', marginTop: 6, textAlign: 'center' },
  assessMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  assessMeta: { alignItems: 'center', paddingHorizontal: 18 },
  assessMetaValue: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  assessMetaLabel: { color: colors.inkSoft, fontSize: 11, fontWeight: '600', marginTop: 2 },
  assessDivider: { width: 1, height: 32, backgroundColor: colors.cardBorder },

  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  outlineBtnText: { color: colors.brand, fontSize: 15, fontWeight: '800' },

  videoDrop: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D8EECB',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  videoIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.brandSoftAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  videoTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  videoSub: {
    color: colors.inkSoft,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
    lineHeight: 19,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  uploadBtnText: { color: colors.inkOnDark, fontSize: 14, fontWeight: '700' },

  tipsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tipsTitle: { color: colors.ink, fontSize: 14, fontWeight: '800', marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  tipText: { color: colors.inkSoft, fontSize: 13, fontWeight: '500' },

  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  reviewInfo: { flex: 1 },
  reviewLabel: { color: colors.inkSoft, fontSize: 11, fontWeight: '700', marginBottom: 3 },
  reviewValue: { color: colors.ink, fontSize: 14, fontWeight: '700' },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  nextBtnText: { color: colors.inkOnDark, fontSize: 15, fontWeight: '800' },
  nextBtnDisabled: { opacity: 0.7 },
});