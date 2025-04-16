import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { AgendamentoForm } from './AgendamentoForm';

export function TopNav() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center border-b">
      <div className="flex space-x-4 text-sm font-medium">
        <NavLink 
          to="/" 
          className={({ isActive }) =>
            isActive 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-600 hover:text-blue-600'
          }
          end
        >
          Semana
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) =>
            isActive 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-600 hover:text-blue-600'
          }
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/cadastro" 
          className={({ isActive }) =>
            isActive 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-600 hover:text-blue-600'
          }
        >
          Cadastros
        </NavLink>
      </div>
      <div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          + Novo Atendimento
        </button>
      </div>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                Novo Atendimento
              </Dialog.Title>
              
              <AgendamentoForm
                onSave={() => {
                  setShowModal(false);
                  window.location.reload();
                }}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 