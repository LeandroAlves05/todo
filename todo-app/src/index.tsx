import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

const AppContext = createContext({ api });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <AppContext.Provider value={{ api }}>
        <App />
    </AppContext.Provider>
);

export const useAppContext = () => useContext(AppContext);