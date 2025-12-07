// FILE: src/context/profileContextInstance.js
// ProfileContext instance creation

import { createContext } from 'react';

// Context with undefined default (forces provider usage)
export const ProfileContext = createContext(undefined);

