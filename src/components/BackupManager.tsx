import { useState, useRef } from 'react';
import { db } from '../db';

export function BackupManager() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      setMessage(null);
      await db.downloadBackup();
      setMessage({ type: 'success', text: 'Backup realizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao realizar backup:', error);
      setMessage({ type: 'error', text: `Erro ao realizar backup: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsRestoring(true);
      setMessage(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          await db.importData(data);
          setMessage({ type: 'success', text: 'Dados restaurados com sucesso! Recarregue a página para ver as alterações.' });
        } catch (error) {
          console.error('Erro ao processar arquivo de backup:', error);
          setMessage({ type: 'error', text: `Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
        } finally {
          setIsRestoring(false);
          // Limpar o input de arquivo
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Erro ao restaurar dados:', error);
      setMessage({ type: 'error', text: `Erro ao restaurar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
      setIsRestoring(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Gerenciamento de Dados</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Realize backups periódicos para evitar perda de dados. Os backups são salvos em formato JSON
            e podem ser importados novamente em caso de necessidade.
          </p>
          
          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isBackingUp ? 'Gerando backup...' : 'Fazer backup agora'}
          </button>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong className="text-red-600">Atenção:</strong> Restaurar um backup substituirá todos os dados 
            atuais. Certifique-se de fazer um backup antes de restaurar.
          </p>
          
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleRestore}
              accept=".json"
              disabled={isRestoring}
              className="hidden"
              id="backup-file"
            />
            <label
              htmlFor="backup-file"
              className={`block w-full px-4 py-2 text-center ${
                isRestoring ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'
              } text-white rounded-md transition-colors cursor-pointer disabled:opacity-50`}
            >
              {isRestoring ? 'Restaurando...' : 'Restaurar backup'}
            </label>
          </div>
        </div>
        
        {message && (
          <div className={`p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-gray-500">
            Dica: Mantenha vários arquivos de backup em diferentes momentos para maior segurança.
            Recomendamos fazer backups semanais ou após adicionar muitos registros.
          </p>
        </div>
      </div>
    </div>
  );
} 