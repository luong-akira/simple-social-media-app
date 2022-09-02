import React from 'react';

import { io } from 'socket.io-client';

export const socket = io('');

export const socketContext = React.createContext();
