import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthForm } from '@/components/auth/auth-form';
import { AuthFooter } from '@/components/auth/auth-footer';

export default function Index() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      {/* Elementos decorativos de fundo (ambient glow) */}
      <View
        pointerEvents="none"
        className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15"
      />
      <View
        pointerEvents="none"
        className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-purple-600/15"
      />
      <View
        pointerEvents="none"
        className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-900/20"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingVertical: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6"
        >
          <AuthHeader />
          <AuthForm isSignUp={isSignUp} />
          <AuthFooter isSignUp={isSignUp} onToggle={() => setIsSignUp(!isSignUp)} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
