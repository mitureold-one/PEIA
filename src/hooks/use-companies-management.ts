import { useState } from 'react';
import { empresasActions, useEmpresas } from '@/hooks/use-empresas';
import { usePermissions } from '@/hooks/use-user-role';

export function useCompaniesManagement() {
  const { isAdmin } = usePermissions();
  const empresas = useEmpresas();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const cadastrar = async (): Promise<boolean> => {
    if (!nome.trim() || !email.trim()) {
      setErro('Informe o nome e o e-mail da empresa.');
      return false;
    }

    setSalvando(true);
    setErro('');
    setSucesso(false);

    try {
      await empresasActions.criar({
        nome: nome.trim(),
        email: email.trim(),
      });
      setNome('');
      setEmail('');
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
      return true;
    } catch (e: any) {
      setErro(e?.message || 'Falha ao salvar a empresa no banco local.');
      return false;
    } finally {
      setSalvando(false);
    }
  };

  return {
    isAdmin,
    empresas,
    totalEmpresas: empresas.length,
    nome,
    setNome,
    email,
    setEmail,
    erro,
    salvando,
    sucesso,
    cadastrar,
  };
}

