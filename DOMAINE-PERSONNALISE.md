# Configuration du Domaine Personnalisé - wifibisoubisou.com

## 🎯 Étapes pour Configurer wifibisoubisou.com

### 1. **Acheter le Domaine**
- Rendez-vous sur un registrar (GoDaddy, Namecheap, etc.)
- Achetez **wifibisoubisou.com**

### 2. **Configurer DNS**
Ajoutez ces enregistrements DNS :
```
Type: CNAME
Nom: www
Valeur: mireb1.github.io

Type: A
Nom: @
Valeur: 185.199.108.153
Valeur: 185.199.109.153
Valeur: 185.199.110.153
Valeur: 185.199.111.153
```

### 3. **Configurer GitHub Pages**
1. Allez sur GitHub > Settings > Pages
2. Dans "Custom domain", entrez : `wifibisoubisou.com`
3. Cochez "Enforce HTTPS"
4. GitHub générera automatiquement un certificat SSL

### 4. **Créer le fichier CNAME**
```bash
echo "wifibisoubisou.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin gh-pages
```

### 5. **Vérifier**
- Attendez 10-15 minutes pour la propagation DNS
- Visitez https://wifibisoubisou.com
- Vérifiez que le certificat SSL est actif

## ✅ **Résultat Final**
Votre site sera accessible sur :
- https://wifibisoubisou.com (domaine personnalisé)
- https://mireb1.github.io/WIFIBISOUBISOU/ (URL GitHub)

Les deux URLs fonctionneront parfaitement !
