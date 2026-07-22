"use client";

import { create } from "zustand";

type StudioShellUiState = {
  mobileNavOpen: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
  userMenuOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
  closeOverlays: () => void;
};

export const useStudioShellUi = create<StudioShellUiState>((set) => ({
  mobileNavOpen: false,
  searchOpen: false,
  notificationsOpen: false,
  userMenuOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setSearchOpen: (searchOpen) =>
    set({ searchOpen, notificationsOpen: false, userMenuOpen: false }),
  setNotificationsOpen: (notificationsOpen) =>
    set({ notificationsOpen, searchOpen: false, userMenuOpen: false }),
  setUserMenuOpen: (userMenuOpen) =>
    set({ userMenuOpen, searchOpen: false, notificationsOpen: false }),
  closeOverlays: () =>
    set({
      mobileNavOpen: false,
      searchOpen: false,
      notificationsOpen: false,
      userMenuOpen: false,
    }),
}));
