// FILE: src/constants/storage.js
// Centralized storage key constants for localStorage
export const STORAGE_KEYS = {
  PROFILE: (id) => `rdo_os_profile_${id}`,
  CART: (id) => `rdo_os_cart_${id}`,
  ACTIVE_SLOT: 'rdo_active_slot'
};

