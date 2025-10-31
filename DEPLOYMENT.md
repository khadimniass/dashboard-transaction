# Guide de Déploiement sur GitHub Pages

Ce guide explique comment déployer l'application Dashboard Transaction sur GitHub Pages en utilisant GitHub Actions.

## Configuration Initiale

### 1. Activer GitHub Pages dans votre dépôt

1. Allez dans les paramètres de votre dépôt GitHub
2. Naviguez vers **Settings** > **Pages**
3. Dans la section **Build and deployment**, sélectionnez:
   - **Source**: GitHub Actions
4. Sauvegardez les modifications

### 2. Créer la branche de déploiement

La branche `deploy` est utilisée pour déclencher le déploiement automatique. Créez-la à partir de votre branche principale:

```bash
# Créer la branche deploy
git checkout -b deploy

# Pousser la branche vers GitHub
git push -u origin deploy
```

## Déploiement Automatique

### Comment déclencher un déploiement

Le déploiement se fait automatiquement à chaque fois que vous poussez des modifications sur la branche `deploy`:

```bash
# Méthode 1: Fusionner votre branche de travail dans deploy
git checkout deploy
git merge votre-branche
git push origin deploy

# Méthode 2: Pousser directement sur deploy
git checkout deploy
git push origin deploy
```

### Workflow GitHub Actions

Le fichier `.github/workflows/deploy.yml` contient le workflow de déploiement qui:

1. **Build** - Compile l'application Angular en mode production
2. **Upload** - Télécharge les fichiers construits
3. **Deploy** - Déploie sur GitHub Pages

### Configuration du workflow

Le workflow est configuré pour:
- Se déclencher sur push vers la branche `deploy`
- Permettre le déclenchement manuel via l'interface GitHub
- Utiliser Node.js 20
- Builder avec `--base-href "/dashboard-transaction/"`

## Déploiement Manuel

Vous pouvez aussi déclencher le déploiement manuellement:

1. Allez dans l'onglet **Actions** de votre dépôt GitHub
2. Sélectionnez le workflow **Deploy to GitHub Pages**
3. Cliquez sur **Run workflow**
4. Sélectionnez la branche `deploy`
5. Cliquez sur **Run workflow**

## URL de l'application déployée

Une fois déployée, votre application sera accessible à:

```
https://[votre-username].github.io/dashboard-transaction/
```

Remplacez `[votre-username]` par votre nom d'utilisateur GitHub.

## Configuration Angular

La configuration de build dans `angular.json` inclut:

- **Optimisation des fonts**: Désactivée pour éviter les erreurs 403 de Google Fonts
- **Base href**: `/dashboard-transaction/` pour correspondre au nom du dépôt
- **Output mode**: SSR (Server-Side Rendering) compatible avec le déploiement statique

## Processus de Développement Recommandé

```bash
# 1. Développez sur votre branche de feature
git checkout -b feature/ma-nouvelle-fonctionnalite
# ... faites vos modifications ...
git add .
git commit -m "Description de vos modifications"
git push origin feature/ma-nouvelle-fonctionnalite

# 2. Testez localement
npm run build
npm start

# 3. Fusionnez dans la branche principale (main/master)
git checkout main
git merge feature/ma-nouvelle-fonctionnalite
git push origin main

# 4. Déployez en production
git checkout deploy
git merge main
git push origin deploy
```

## Vérification du Déploiement

Après avoir poussé sur la branche `deploy`:

1. Allez dans **Actions** sur GitHub
2. Vérifiez que le workflow s'exécute sans erreur
3. Une fois terminé (coche verte ✓), attendez 1-2 minutes
4. Visitez l'URL de votre application

## Résolution des Problèmes

### Le déploiement échoue

- Vérifiez les logs dans l'onglet **Actions**
- Assurez-vous que GitHub Pages est activé dans les paramètres
- Vérifiez que les permissions sont correctement configurées

### L'application ne charge pas correctement

- Vérifiez que le `base-href` dans `angular.json` correspond au nom de votre dépôt
- Vérifiez les chemins des ressources dans la console du navigateur
- Assurez-vous que tous les fichiers nécessaires ont été déployés

### Les icônes Material ne s'affichent pas

- Vérifiez que le lien Google Fonts est présent dans `src/index.html`
- Videz le cache de votre navigateur

## Commandes Utiles

```bash
# Tester le build localement
npm run build

# Voir le statut de la branche deploy
git checkout deploy
git status

# Voir l'historique des commits
git log --oneline

# Forcer un redéploiement
git commit --allow-empty -m "Trigger deployment"
git push origin deploy
```

## Notes Importantes

- **Ne jamais** développer directement sur la branche `deploy`
- La branche `deploy` doit toujours refléter une version stable de l'application
- Testez toujours localement avant de pousser sur `deploy`
- Le workflow utilise `npm ci` pour une installation déterministe des dépendances
