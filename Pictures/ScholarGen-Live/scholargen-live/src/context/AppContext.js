// ScholarGen Live — global app store.
//
// Holds the admin-controlled catalog (categories, education levels, streams,
// subjects, examinations, banners, packages, family packages, group classes)
// plus the signed-in student & tutor profiles (including profile pictures).
//
// Screens read from here so that anything an Admin changes is reflected live
// across the student and tutor experiences without code changes.

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  makeId,
  seedCategories,
  seedEducationLevels,
  seedStreams,
  seedSubjects,
  seedExaminations,
  seedBanners,
  seedPackages,
  seedFamilyPackages,
  seedGroupClasses,
} from '../data/catalog';

const AppContext = createContext(null);

// Returns CRUD helpers bound to a single collection's state setter. Every
// admin-managed list (categories, subjects, …) shares the same contract:
//   add(item) · update(id, patch) · remove(id) · toggle(id)
function makeCrud(setList, idPrefix) {
  return {
    add: (item) =>
      setList((prev) => [{ id: makeId(idPrefix), enabled: true, ...item }, ...prev]),
    update: (id, patch) =>
      setList((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it))),
    remove: (id) => setList((prev) => prev.filter((it) => it.id !== id)),
    toggle: (id) =>
      setList((prev) => prev.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it))),
  };
}

export function AppProvider({ children }) {
  const [categories, setCategories] = useState(seedCategories);
  const [educationLevels, setEducationLevels] = useState(seedEducationLevels);
  const [streams, setStreams] = useState(seedStreams);
  const [subjects, setSubjects] = useState(seedSubjects);
  const [examinations, setExaminations] = useState(seedExaminations);
  const [banners, setBanners] = useState(seedBanners);
  const [packages, setPackages] = useState(seedPackages);
  const [familyPackages, setFamilyPackages] = useState(seedFamilyPackages);
  const [groupClasses, setGroupClasses] = useState(seedGroupClasses);

  // Signed-in profiles. `avatar` is a local image URI chosen via the picker.
  const [studentProfile, setStudentProfile] = useState({
    name: 'Chidinma Okafor',
    email: 'chidinma.o@example.com',
    avatar: null,
  });
  const [tutorProfile, setTutorProfile] = useState({
    name: 'Dr. Funke Adeyemi',
    email: 'funke.a@example.com',
    avatar: null,
  });

  const updateStudentProfile = useCallback(
    (patch) => setStudentProfile((prev) => ({ ...prev, ...patch })),
    [],
  );
  const updateTutorProfile = useCallback(
    (patch) => setTutorProfile((prev) => ({ ...prev, ...patch })),
    [],
  );

  // Stable CRUD bundles per collection.
  const categoriesApi = useMemo(() => makeCrud(setCategories, 'cat'), []);
  const educationLevelsApi = useMemo(() => makeCrud(setEducationLevels, 'lvl'), []);
  const streamsApi = useMemo(() => makeCrud(setStreams, 'stream'), []);
  const subjectsApi = useMemo(() => makeCrud(setSubjects, 'sub'), []);
  const examinationsApi = useMemo(() => makeCrud(setExaminations, 'exam'), []);
  const bannersApi = useMemo(() => makeCrud(setBanners, 'ban'), []);
  const packagesApi = useMemo(() => makeCrud(setPackages, 'pkg'), []);
  const familyPackagesApi = useMemo(() => makeCrud(setFamilyPackages, 'fam'), []);
  const groupClassesApi = useMemo(() => makeCrud(setGroupClasses, 'gc'), []);

  const value = useMemo(
    () => ({
      // Collections
      categories,
      educationLevels,
      streams,
      subjects,
      examinations,
      banners,
      packages,
      familyPackages,
      groupClasses,
      // CRUD
      categoriesApi,
      educationLevelsApi,
      streamsApi,
      subjectsApi,
      examinationsApi,
      bannersApi,
      packagesApi,
      familyPackagesApi,
      groupClassesApi,
      // Profiles
      studentProfile,
      tutorProfile,
      updateStudentProfile,
      updateTutorProfile,
    }),
    [
      categories,
      educationLevels,
      streams,
      subjects,
      examinations,
      banners,
      packages,
      familyPackages,
      groupClasses,
      categoriesApi,
      educationLevelsApi,
      streamsApi,
      subjectsApi,
      examinationsApi,
      bannersApi,
      packagesApi,
      familyPackagesApi,
      groupClassesApi,
      studentProfile,
      tutorProfile,
      updateStudentProfile,
      updateTutorProfile,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
