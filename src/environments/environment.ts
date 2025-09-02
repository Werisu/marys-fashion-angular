export const environment = {
  production: false,
  supabase: {
    // ⚠️ IMPORTANTE: Substitua estas URLs pelas suas credenciais reais do Supabase
    // 1. Acesse: https://supabase.com/dashboard
    // 2. Selecione seu projeto
    // 3. Vá em Settings > API
    // 4. Copie a "Project URL", "anon public" key e "service_role" key

    url: 'https://sxuvliahfsrneveezzgb.supabase.co', // ✅ Substitua pela sua Project URL
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dXZsaWFoZnNybmV2ZWV6emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDc4NjksImV4cCI6MjA3MjMyMzg2OX0.rHIgjnJMACyMjeaqmlC0k1Zxn9nvTz01Hy6YWPuCz74', // ✅ Substitua pela sua anon public key
    serviceRoleKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dXZsaWFoZnNybmV2ZWV6emdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc0Nzg2OSwiZXhwIjoyMDcyMzIzODY5fQ.N4RWMeW2ittlaPSaPFWLEP8OPwGedG4QUgc_Ryey300', // ⚠️ ADICIONE SUA SERVICE ROLE KEY AQUI
  },
};
