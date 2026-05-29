# 🚀 GUIA: Deploy na Railway

## ✅ PASSO 1: Criar Conta Railway

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Escolha: **"Deploy from GitHub"**
4. Autorize Railway com sua conta GitHub
5. Selecione o repositório: **`ytalseg-erp-v86`**
6. Clique em **"Deploy"**

---

## ✅ PASSO 2: Railway Cria o App

Railway vai:
- ✅ Detectar o `Dockerfile`
- ✅ Criar PostgreSQL automaticamente
- ✅ Fazer o build do código
- ✅ Subir a aplicação

**Espere ~5-10 minutos** ⏳

---

## ✅ PASSO 3: Verificar Variáveis de Ambiente

No painel Railway:

1. Vá em **"Variables"**
2. Clique em **"Raw Editor"**
3. Copie e cole:

```
SECRET_KEY=sua-chave-secreta-super-segura-12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
CORS_ORIGINS=https://seu-app-name.railway.app
```

4. Clique em **"Update"**

---

## ✅ PASSO 4: Obter URL da App

No painel Railway:

1. Vá em **"Deployments"**
2. Procure por **"Public URL"** ou **"Domains"**
3. Copie a URL (exemplo: `https://ytalseg-erp-v86.railway.app`)
4. Abra em seu navegador! 🎉

---

## ✅ PASSO 5: Acessar no Celular/Notebook

**URL fixa:**
```
https://seu-app-name.railway.app
```

Funciona em qualquer lugar! ✅

---

## 📊 Monitorar a App

No painel Railway:

- **Logs**: Ver o que a app está fazendo
- **Metrics**: CPU, memória, requisições
- **Deployments**: Histórico de atualizações

---

## 🔄 Atualizar a App

Toda vez que faz `git push`:

```powershell
git add .
git commit -m "Atualização: descrição do que mudou"
git push origin main
```

Railway detecta automaticamente e faz novo deploy! ✅

---

## 🆘 Possíveis Problemas

### **App não inicia**
- Veja os **Logs** no painel Railway
- Pode ser erro no código

### **Banco de dados não conecta**
- Verifique **DATABASE_URL** nas variáveis
- Railway cria automaticamente, não precisa fazer nada

### **Página branca**
- Limpe cache: `Ctrl + Shift + Del`
- Tente em modo incógnito

---

## ✅ CHECKLIST FINAL

- [ ] Conta Railway criada
- [ ] GitHub conectado
- [ ] Deploy bem-sucedido
- [ ] PostgreSQL criado
- [ ] URL funcionando
- [ ] Acessível no celular
- [ ] Acessível no notebook

---

## 🎉 PRONTO!

Sua app está **24/7 na nuvem**! 🚀

Compartilhe a URL com qualquer pessoa e funciona!

---

## 📞 Dúvidas?

Me avisa! 👍
