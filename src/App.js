/** @format */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Protected from './context/Protected';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import { ClientContext } from './context/ClientContext';
import { MachineContext } from './context/MachineContext';
let theme = createTheme({
  typography: { color: 'black', button: { textTransform: 'none' } },
});
function App() {
  const [clientID, setClientID] = useState();
  const [machineID, setMachineID] = useState();
  return (
    // <BrowserRouter>
    <BrowserRouter basename='/operator'>
      <ThemeProvider theme={theme}>
        <ClientContext.Provider value={{ clientID, setClientID }}>
          <MachineContext.Provider value={{ machineID, setMachineID }}>
            <Routes>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/' element={<Protected />} />
              <Route path='/*' element={<Protected />} />
            </Routes>
          </MachineContext.Provider>
        </ClientContext.Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
