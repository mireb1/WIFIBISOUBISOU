# 🚀 Guide de Déploiement Automatique - WiFi Bisou Bisou

## 📋 Vue d'ensemble

Ce guide explique comment utiliser les scripts de déploiement automatique pour mettre à jour votre application WiFi Bisou Bisou directement sur l'URL GitHub Pages.

## 🌐 URL Actuelle

**URL de production :** https://mireb1.github.io/WIFIBISOUBISOU/

## 🛠️ Scripts Disponibles

### 1. Déploiement Rapide (`deploy-quick.sh`)

**Usage :** Pour des mises à jour rapides sans modification d'URL

```bash
./deploy-quick.sh
```

**Ce que fait ce script :**
- Bascule automatiquement sur la branche `gh-pages`
- Ajoute tous les fichiers modifiés
- Commite avec un message automatique
- Pousse vers GitHub Pages
- Affiche l'URL d'accès

### 2. Mise à jour Complète (`update-and-deploy.sh`)

**Usage :** Pour des mises à jour complètes avec options avancées

```bash
./update-and-deploy.sh
```

**Options disponibles :**
1. 🌐 Utiliser l'URL GitHub Pages (recommandé)
2. 🔗 Configurer une URL personnalisée
3. 🚀 Déployer sans changer l'URL
4. 📋 Voir l'URL actuelle
5. 🔄 Mise à jour complète (URL + déploiement)

## ⚡ Déploiement Instantané

### Pour une mise à jour rapide (recommandé) :

```bash
# Naviguez vers le dossier du projet
cd /workspaces/WIFIBISOUBISOU

# Exécutez le script de déploiement rapide
./deploy-quick.sh
```

### Pour une mise à jour avec options :

```bash
# Naviguez vers le dossier du projet
cd /workspaces/WIFIBISOUBISOU

# Exécutez le script de mise à jour complète
./update-and-deploy.sh

# Choisissez l'option 1 pour GitHub Pages
# ou l'option 5 pour une mise à jour complète
```

## 📝 Configuration Actuelle

Les fichiers suivants ont été automatiquement configurés pour pointer vers GitHub Pages :

- ✅ `url-config.js` - Configuration des URLs de base
- ✅ `environment-config.js` - Configuration d'environnement
- ✅ `manifest.json` - Manifeste PWA
- ✅ Scripts de déploiement automatique

## 🔄 Processus de Déploiement

1. **Modification du code** → Éditez vos fichiers normalement
2. **Exécution du script** → `./deploy-quick.sh`
3. **Déploiement automatique** → Le script gère tout automatiquement
4. **Vérification** → Visitez https://mireb1.github.io/WIFIBISOUBISOU/

## ⏱️ Temps de Déploiement

- **Commit et push** : Instantané
- **Déploiement GitHub Pages** : 2-5 minutes
- **Propagation DNS** : 5-10 minutes (si domaine personnalisé)

## 🎯 Utilisation Recommandée

### Pour des mises à jour quotidiennes :
```bash
# Modifiez vos fichiers, puis :
./deploy-quick.sh
```

### Pour des changements majeurs :
```bash
# Utilisez le script complet :
./update-and-deploy.sh
# Choisissez l'option 5 (mise à jour complète)
```

## 🔍 Vérification du Déploiement

Après chaque déploiement, vérifiez :

1. **URL principale** : https://mireb1.github.io/WIFIBISOUBISOU/
2. **Tableau de bord** : https://mireb1.github.io/WIFIBISOUBISOU/#dashboard
3. **Console développeur** : Pas d'erreurs JavaScript
4. **Fonctionnalités** : Test d'achat de tickets

## 🚨 Dépannage

### Si le déploiement échoue :
```bash
# Vérifiez l'état Git
git status

# Vérifiez la branche actuelle
git branch

# Forcez le push si nécessaire
git push origin gh-pages --force
```

### Si l'URL ne fonctionne pas :
1. Vérifiez que GitHub Pages est activé dans les paramètres du repository
2. Assurez-vous que la branche source est `gh-pages`
3. Attendez 5-10 minutes pour la propagation

## 📞 Support

En cas de problème :
1. Vérifiez les logs du terminal
2. Consultez les paramètres GitHub Pages
3. Vérifiez l'état du repository sur GitHub

## 🎉 Félicitations !

Votre application WiFi Bisou Bisou est maintenant configurée pour des déploiements automatiques sur GitHub Pages. Utilisez `./deploy-quick.sh` pour vos mises à jour quotidiennes !

---

**URL de production :** https://mireb1.github.io/WIFIBISOUBISOU/  
**Dernière mise à jour :** 15 juillet 2025  
**Statut :** ✅ Actif et fonctionnel
