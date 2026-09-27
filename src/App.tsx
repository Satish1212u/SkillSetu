import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { api, setAuthToken } from './services/api';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { StudentView } from './pages/student/StudentView';
import { InstituteView } from './pages/institute/InstituteView';
import { EmployerView } from './pages/employer/EmployerView';
import { AdminView } from './pages/admin/AdminView';
import { GeminiChatbot } from './components/chat/GeminiChatbot';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Default active tab map per role
  const defaultTabMap: Record<UserRole, string> = {
    STUDENT: 'overview',
    INSTITUTE: 'overview',
    EMPLOYER: 'overview',
    ADMIN: 'overview',
  };

  const roleUserMap: Record<UserRole, { name: string; org: string; email: string }> = {
    STUDENT: {
      name: 'Arjun Sharma',
      org: 'PICT Pune (Computer Engg 2026)',
      email: 'arjun.sharma@sih.gov.in',
    },
    INSTITUTE: {
      name: 'Prof. Ramesh Kulkarni',
      org: 'Pune Institute of Computer Technology (PICT)',
      email: 'dean.academic@pict.ac.in',
    },
    EMPLOYER: {
      name: 'Priya Sundaram',
      org: 'Razorpay Software Pvt Ltd',
      email: 'talent@razorpay.com',
    },
    ADMIN: {
      name: 'Dr. Sunita Deshmukh',
      org: 'Ministry of Skill Development & Entrepreneurship (MSDE)',
      email: 'director.skill@msde.gov.in',
    },
  };

  const handleRoleChange = async (newRole: UserRole) => {
    setCurrentRole(newRole);
    setActiveTab(defaultTabMap[newRole]);

    try {
      const loginRes = await api.login(roleUserMap[newRole].email, newRole);
      setAuthToken(loginRes.token);
      setCurrentUser(loginRes.user);
    } catch (err) {
      console.error('Role login switch error:', err);
    }
  };

  useEffect(() => {
    // Initial login as student
    handleRoleChange('STUDENT');
  }, []);

  const activeUserInfo = roleUserMap[currentRole];

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col font-sans relative">
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        userName={currentUser?.name || activeUserInfo.name}
        organizationName={currentUser?.organizationName || activeUserInfo.org}
        onOpenChat={() => setIsChatOpen(prev => !prev)}
      />

      <div className="flex-1 w-full flex flex-col md:flex-row min-w-0">
        <Sidebar
          currentRole={currentRole}
          currentTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {currentRole === 'STUDENT' && (
            <StudentView currentTab={activeTab} onTabChange={setActiveTab} />
          )}
          {currentRole === 'INSTITUTE' && <InstituteView currentTab={activeTab} />}
          {currentRole === 'EMPLOYER' && <EmployerView currentTab={activeTab} />}
          {currentRole === 'ADMIN' && <AdminView currentTab={activeTab} />}
        </main>
      </div>

      {/* Floating SkillSetu Help Trigger Button */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-4 py-3 shadow-xl border border-slate-700 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          title="Open SkillSetu Help"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold tracking-tight">SkillSetu Help</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 hidden sm:inline">
            3.5 Flash / 3.1 Pro
          </span>
        </button>
      )}

      {/* SkillSetu Help Modal / Drawer */}
      <GeminiChatbot
        currentRole={currentRole}
        userName={currentUser?.name || activeUserInfo.name}
        organizationName={currentUser?.organizationName || activeUserInfo.org}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
