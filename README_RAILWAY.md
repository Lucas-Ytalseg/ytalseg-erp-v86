# YTALSEG ERP V86 - Deployment na Railway

## 🚀 Como fazer Deploy

### 1. Criar Repositório no GitHub

```bash
# Clone do repositório local
git init
git add .
git commit -m "Initial commit - YTALSEG ERP V86"
git branch -M main
git remote add origin https://github.com/Lucas-Ytalseg/ytalseg-erp.git
git push -u origin main
```

### 2. Conectar com Railway

1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Selecione "Deploy from GitHub"
4. Autorize e conecte sua conta GitHub
5. Escolha o repositório `ytalseg-erp`
6. Railway detecta automaticamente o Dockerfile

### 3. Configurar Banco de Dados

Railway cria PostgreSQL automaticamente!

- Variables > DATABASE_URL (gerado automaticamente)

### 4. Deploy Automático

Toda vez que você faz `git push`, Railway atualiza automaticamente! ✅

### 5. Acessar a App

Railway gera URL automaticamente:
```
https://seu-projeto.railway.app
```

---

## 📝 Variáveis de Ambiente

Railway lê automaticamente de `.env`

Você pode configurar no painel Railway:
- `SECRET_KEY`
- `ALGORITHM`
- `CORS_ORIGINS`

---

## ✅ Checklist

- [ ] Repositório GitHub criado
- [ ] Código feito push
- [ ] Railway conectado
- [ ] PostgreSQL criado
- [ ] Deploy bem-sucedido
- [ ] URL funcionando

---

## 📞 Suporte

Dúvidas? Me avisa!
