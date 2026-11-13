import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileStudentAcademicEditModal } from '@/components/profile/profile-student-academic-edit-modal';
import { ProfileStudentPhotoModal } from '@/components/profile/profile-student-photo-modal';
import type { Aluno, AlunoProps } from '@/data/user';

export interface ProfileStudentInfoProps {
  aluno: Aluno;
  iniciais: string;
  onUpdateAcademicData: (dados: Partial<AlunoProps>) => Promise<void>;
  onToggleAbertoOportunidades: () => Promise<void>;
  onUpdateAvatar: (uri?: string) => Promise<void> | void;
}

/**
 * Componente de Identificação do Estudante no estilo LinkedIn / Hero Profissional.
 * Foto de perfil destacada e centralizada com tipografia hierárquica e badges.
 */
export function ProfileStudentInfo({
  aluno,
  iniciais,
  onUpdateAcademicData,
  onToggleAbertoOportunidades,
  onUpdateAvatar,
}: ProfileStudentInfoProps) {
  const [modalEdicaoVisivel, setModalEdicaoVisivel] = useState(false);
  const [modalFotoVisivel, setModalFotoVisivel] = useState(false);

  const isAberto = aluno.abertoOportunidades;

  // Círculos e anéis de disponibilidade combinados dinamicamente com o status do aluno (Estilo LinkedIn Open to Work)
  const ringOuterBorder = isAberto
    ? 'border-emerald-500 dark:border-emerald-400'
    : 'border-slate-300 dark:border-slate-700';

  const ringOuterBg = isAberto
    ? 'bg-emerald-50/60 dark:bg-emerald-950/40'
    : 'bg-slate-100/60 dark:bg-slate-900/40';

  const ringInnerBorder = isAberto
    ? 'border-emerald-200 dark:border-emerald-800/80'
    : 'border-slate-200 dark:border-slate-800';

  const badgeBg = isAberto
    ? 'bg-emerald-600 dark:bg-emerald-500'
    : 'bg-slate-500 dark:bg-slate-600';

  const avatarFallbackBg = isAberto
    ? 'bg-emerald-600'
    : 'bg-slate-600';

  return (
    <>
      <View className="items-center gap-3">
        {/* Foto de Perfil Centralizada com Maior Destaque e Círculos de Disponibilidade */}
        <Pressable
          onPress={() => setModalFotoVisivel(true)}
          accessibilityRole="button"
          accessibilityLabel={`Ver foto ampliada ou trocar foto de perfil. Status atual: ${aluno.statusOportunidadeLabel}`}
          className="relative active:opacity-85 items-center justify-center"
        >
          {/* Círculo 1: Anel Externo de Disponibilidade (Halo Open to Work) */}
          <View
            style={{ width: 104, height: 104, aspectRatio: 1 }}
            className={`w-[104px] h-[104px] rounded-full border-2 ${ringOuterBorder} ${ringOuterBg} p-1 items-center justify-center shadow-md`}
          >
            {/* Círculo 2: Anel Intermediário de Respiro Negativo */}
            <View
              style={{ width: '100%', height: '100%', aspectRatio: 1 }}
              className={`w-full h-full rounded-full border ${ringInnerBorder} p-0.5 bg-white dark:bg-slate-900 items-center justify-center overflow-hidden`}
            >
              {/* Círculo 3: Foto ou Iniciais do Estudante */}
              {aluno.avatar ? (
                <Image
                  source={{ uri: aluno.avatar }}
                  resizeMode="cover"
                  style={{ width: '100%', height: '100%', aspectRatio: 1 }}
                  className="h-full w-full rounded-full"
                />
              ) : (
                <View className={`h-full w-full rounded-full ${avatarFallbackBg} items-center justify-center`}>
                  <Text className="text-3xl font-black text-white">{iniciais}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Badge Indicativo para Trocar Foto Sincronizado com a Cor de Disponibilidade */}
          <View className={`absolute bottom-0 right-0 h-7 w-7 rounded-full ${badgeBg} border-2 border-white dark:border-slate-900 items-center justify-center shadow-sm`}>
            <Ionicons name="camera" size={13} color="#ffffff" />
          </View>
        </Pressable>

        {/* Informações Pessoais & Acadêmicas Centralizadas */}
        <View className="items-center">
          {/* Nome e Atalho de Edição Acadêmica */}
          <View className="flex-row items-center gap-1.5">
            <Text className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white text-center">
              {aluno.fullName}
            </Text>
            <Pressable
              onPress={() => setModalEdicaoVisivel(true)}
              accessibilityRole="button"
              accessibilityLabel="Editar dados acadêmicos"
              className="p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 active:scale-95"
            >
              <Ionicons name="pencil" size={13} color="#6366f1" />
            </Pressable>
          </View>

          {/* Cargo / Ocupação */}
          <Text className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 text-center">
            {aluno.cargo}
          </Text>

          {/* Instituição e Curso */}
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-center">
            {aluno.instituicao} · {aluno.curso}
          </Text>

          {/* Tag Interativa de Status (Aberto a Oportunidades) */}
          <Pressable
            onPress={onToggleAbertoOportunidades}
            accessibilityRole="button"
            accessibilityLabel={`Status: ${aluno.statusOportunidadeLabel}. Toque para alternar.`}
            className={`mt-2.5 px-3 py-1 rounded-full border flex-row items-center gap-1.5 active:scale-95 ${
              aluno.abertoOportunidades
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
            }`}
          >
            <View
              className={`h-2 w-2 rounded-full ${
                aluno.abertoOportunidades ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <Text
              className={`text-[10px] sm:text-xs font-semibold ${
                aluno.abertoOportunidades
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {aluno.statusOportunidadeLabel}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Modal de CRUD Acadêmico */}
      <ProfileStudentAcademicEditModal
        visible={modalEdicaoVisivel}
        aluno={aluno}
        onClose={() => setModalEdicaoVisivel(false)}
        onSave={onUpdateAcademicData}
      />

      {/* Modal de Visualização Ampliada e Troca de Foto de Perfil */}
      <ProfileStudentPhotoModal
        visible={modalFotoVisivel}
        avatar={aluno.avatar}
        nomeCompleto={aluno.fullName}
        iniciais={iniciais}
        abertoOportunidades={aluno.abertoOportunidades}
        onClose={() => setModalFotoVisivel(false)}
        onUpdateAvatar={onUpdateAvatar}
      />
    </>
  );
}
