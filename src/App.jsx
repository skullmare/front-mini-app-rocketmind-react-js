import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AgentsListPage from './pages/AgentsListPage.jsx';
import AgentSergyPage from './pages/AgentSergyPage.jsx';
import AgentNickPage from './pages/AgentNickPage.jsx';
import AgentLidaPage from './pages/AgentLidaPage.jsx';
import AgentMarkPage from './pages/AgentMarkPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import TariffPage from './pages/TariffPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/agents_list" element={<AgentsListPage />} />
      <Route path="/agent_sergy" element={<AgentSergyPage />} />
      <Route path="/agent_nick" element={<AgentNickPage />} />
      <Route path="/agent_lida" element={<AgentLidaPage />} />
      <Route path="/agent_mark" element={<AgentMarkPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/tariff" element={<TariffPage />} />
    </Routes>
  );
}

export default App;




