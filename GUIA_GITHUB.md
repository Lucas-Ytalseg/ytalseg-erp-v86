# 📚 GUIA: Como Subir Código no GitHub

## ✅ PASSO 1: Instalar Git (se não tiver)

**Windows:**
1. Acesse: https://git-scm.com/download/win
2. Baixe e instale
3. Reinicie o PC

**Mac/Linux:**
```bash
brew install git  # Mac
sudo apt-get install git  # Linux
```

---

## ✅ PASSO 2: Configurar Git (primeira vez só)

Abra **PowerShell** e execute:

```powershell
git config --global user.name "Lucas"
git config --global user.email "seu-email@gmail.com"
```

---

## ✅ PASSO 3: Criar Repositório no GitHub

1. Acesse: https://github.com/Lucas-Ytalseg
2. Clique em **"New"** (botão verde)
3. **Repository name**: `ytalseg-erp-v86`
4. **Description**: `YTALSEG ERP - Sistema de Relatórios`
5. Escolha **"Public"** (pra Railway acessar)
6. Clique em **"Create repository"**

---

## ✅ PASSO 4: Fazer Upload do Código

Abra **PowerShell** na pasta do projeto:

```powershell
# Entra na pasta
cd C:\Users\lucas\Downloads\YTALSEG-ERP-V86-MOBILE-FINAL\ytalseg

# Inicializa Git
git init

# Adiciona todos os arquivos
git add .

# Faz primeiro commit
git commit -m "Initial commit - YTALSEG ERP V86"

# Renomeia branch para main
git branch -M main

# Adiciona o repositório remoto (MUDE "Lucas-Ytalseg" se necessário)
git remote add origin https://github.com/Lucas-Ytalseg/ytalseg-erp-v86.git

# Faz upload (push)
git push -u origin main
```

**Isso vai pedir seu usuário e senha do GitHub!**

---

## ✅ PASSO 5: Verificar se Funcionou

1. Acesse: https://github.com/Lucas-Ytalseg/ytalseg-erp-v86
2. Veja se os arquivos aparecem lá ✅

---

## 🚨 POSSÍVEIS ERROS:

### **"fatal: not a git repository"**
- Certifique-se que você está na pasta `/ytalseg`

### **"error: remote origin already exists"**
```powershell
git remote rm origin
git remote add origin https://github.com/Lucas-Ytalseg/ytalseg-erp-v86.git
```

### **"Permission denied"**
- Use seu **personal access token** ao invés de senha
- Gere em: GitHub > Settings > Developer settings > Personal access tokens

---

## ✅ PRONTO! 

Agora vamos fazer o **DEPLOY NA RAILWAY**! 🚀

Me avisa quando os arquivos aparecerem no GitHub!
