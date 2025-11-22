# Diagramme de Classes UML - Dashboard Transaction

## 📊 Vue d'Ensemble

Ce document décrit l'architecture des classes du système Dashboard Transaction, incluant les modèles de données, les services, et leurs relations.

## 📁 Fichiers

- **class-diagram.puml** : Diagramme UML en notation PlantUML
- **class-diagram.png** : Version image du diagramme (à générer)

## 🎨 Générer le Diagramme Visuel

### Méthode 1 : En Ligne (Rapide)

1. Allez sur [PlantUML Online](http://www.plantuml.com/plantuml/uml/)
2. Copiez le contenu de `class-diagram.puml`
3. Collez dans l'éditeur en ligne
4. Le diagramme s'affiche automatiquement
5. Téléchargez en PNG/SVG/PDF

### Méthode 2 : VS Code Extension

1. Installez l'extension **PlantUML** dans VS Code
2. Ouvrez le fichier `class-diagram.puml`
3. Appuyez sur `Alt+D` pour prévisualiser
4. Clic droit → **Export Current Diagram** pour sauvegarder

### Méthode 3 : Ligne de Commande

```bash
# Installer PlantUML
npm install -g node-plantuml

# Générer le diagramme
puml generate class-diagram.puml -o class-diagram.png
```

### Méthode 4 : Docker

```bash
docker run --rm -v $(pwd):/data plantuml/plantuml class-diagram.puml
```

## 📦 Structure du Diagramme

### 1️⃣ **Transaction Models** (Bleu Clair)

#### Interface `Transaction`
Représente une transaction financière avec :
- **Identifiants** : `id`, `reference`
- **Temporel** : `date`
- **Financier** : `amount`, `currency` (XOF, XAF, GNF)
- **Classification** : `type` (enum), `status` (enum)
- **Informations** : `description`, `customer`, `paymentMethod`

#### Classe `Customer`
Informations client intégrées dans Transaction :
- `name` : Nom du client
- `email` : Email du client

#### Enum `TransactionType`
Types de transactions :
- `PAYMENT` - Paiement
- `REFUND` - Remboursement
- `TRANSFER` - Transfert
- `WITHDRAWAL` - Retrait
- `DEPOSIT` - Dépôt

#### Enum `TransactionStatus`
Statuts possibles :
- `PENDING` - En attente
- `COMPLETED` - Complétée
- `FAILED` - Échouée
- `CANCELLED` - Annulée

#### Interface `TransactionFilter`
Filtres pour rechercher des transactions :
- Par statut
- Par type
- Par période (dateFrom/dateTo)
- Par terme de recherche

---

### 2️⃣ **User Models** (Vert Clair)

#### Interface `User`
Représente un utilisateur du système :
- **Identité** : `id`, `email`, `name`
- **Autorisation** : `role` (ADMIN ou USER)
- **Optionnel** : `avatar`

#### Enum `UserRole`
Rôles disponibles :
- `ADMIN` - Administrateur (accès complet)
- `USER` - Utilisateur simple (accès limité)

#### Interface `LoginCredentials`
Données de connexion :
- `email` : Email de l'utilisateur
- `password` : Mot de passe

#### Interface `AuthResponse`
Réponse d'authentification :
- `user` : Objet User
- `token` : Token JWT (mock)

---

### 3️⃣ **Services** (Jaune Clair)

#### Classe `TransactionService`
**Responsabilités** :
- Gestion CRUD des transactions
- Filtrage et recherche
- Calcul de statistiques
- Simulation API avec données mock

**Méthodes principales** :
```typescript
getTransactions(filter?: TransactionFilter): Observable<Transaction[]>
getTransactionById(id: string): Observable<Transaction | undefined>
getTransactionByReference(reference: string): Observable<Transaction | undefined>
getTransactionStats(): Observable<TransactionStats>
```

#### Classe `AuthService`
**Responsabilités** :
- Authentification des utilisateurs
- Gestion des sessions (avec support SSR)
- Vérification des rôles
- Stockage sécurisé (localStorage en mode browser)

**Méthodes principales** :
```typescript
login(credentials: LoginCredentials): Observable<AuthResponse>
logout(): void
isAuthenticated(): boolean
isAdmin(): boolean
isUser(): boolean
hasRole(role: UserRole): boolean
getToken(): string | null
```

**Particularités** :
- Support SSR avec `isPlatformBrowser`
- Utilise `BehaviorSubject` pour état réactif
- Stockage localStorage seulement côté client

#### Classe `ExportService`
**Responsabilités** :
- Export multi-format des transactions
- Formatage des données pour export
- Génération de fichiers téléchargeables

**Méthodes principales** :
```typescript
exportToPDF(transactions: Transaction[], filename: string): void
exportToExcel(transactions: Transaction[], filename: string): void
exportToCSV(transactions: Transaction[], filename: string): void
```

**Technologies utilisées** :
- **PDF** : jsPDF + jspdf-autotable
- **Excel** : XLSX
- **CSV** : File-saver avec BOM UTF-8

---

### 4️⃣ **Components** (Rose Clair)

#### `DashboardComponent`
Dashboard administrateur avec statistiques complètes

#### `TransactionListComponent`
Liste des transactions avec filtres et exports

#### `LoginComponent`
Page de connexion avec formulaire réactif

#### `UserDashboardComponent`
Dashboard utilisateur simple avec exports

#### `TransactionDetailComponent`
**Responsabilités** :
- Affichage détaillé d'une transaction unique
- Récupération de transaction par référence depuis l'URL
- Formatage des statuts et types pour affichage
- Navigation retour vers le dashboard

**Route** : `/admin/dashboard/:reference`

**Propriétés principales** :
```typescript
transaction: Transaction | null  // Transaction affichée
loading: boolean                 // État de chargement
notFound: boolean                // Indicateur si transaction non trouvée
```

**Méthodes principales** :
```typescript
ngOnInit(): void                                      // Initialise et charge la transaction
loadTransaction(reference: string): void              // Charge par référence
getStatusClass(status: TransactionStatus): string     // CSS class pour statut
getTypeClass(type: TransactionType): string           // CSS class pour type
getStatusLabel(status: TransactionStatus): string     // Label français pour statut
getTypeLabel(type: TransactionType): string           // Label français pour type
goBack(): void                                        // Retour au dashboard
```

**Dépendances** :
- `TransactionService` - Pour récupérer les données
- `ActivatedRoute` - Pour lire le paramètre de route
- `Router` - Pour la navigation

---

## 🔗 Relations Entre les Classes

### Associations

| Type | Relation | Description |
|------|----------|-------------|
| **Composition** (◆) | Transaction ◆→ Customer | Transaction contient un Customer |
| **Composition** (◆) | AuthResponse ◆→ User | AuthResponse contient un User |
| **Association** (→) | Transaction → TransactionType | Transaction utilise TransactionType |
| **Association** (→) | Transaction → TransactionStatus | Transaction utilise TransactionStatus |
| **Association** (→) | User → UserRole | User a un UserRole |
| **Dépendance** (..>) | Service ..> Model | Services dépendent des modèles |

### Multiplicités

- `Transaction` **1** ←→ **1** `Customer` (composition)
- `TransactionService` **1** ←→ **0..*** `Transaction` (gère plusieurs)
- `AuthService` **1** ←→ **0..1** `User` (un user connecté ou aucun)
- `ExportService` **1** ←→ **0..*** `Transaction` (exporte plusieurs)

---

## 💡 Patterns de Conception Utilisés

### 1. **Singleton Pattern**
Tous les services sont injectables avec `providedIn: 'root'`, garantissant une seule instance.

### 2. **Observer Pattern**
- `AuthService` utilise `BehaviorSubject` pour notifier les changements d'état
- `TransactionService` retourne des `Observable` pour les opérations asynchrones

### 3. **Strategy Pattern**
`ExportService` implémente différentes stratégies d'export (PDF, Excel, CSV)

### 4. **Repository Pattern**
`TransactionService` agit comme un repository abstrayant l'accès aux données

### 5. **Guard Pattern**
`AuthService` fournit des méthodes de vérification (`isAuthenticated`, `isAdmin`, `isUser`)

---

## 🌍 Spécificités Africaines

### Devises Supportées
- **XOF** - Franc CFA BCEAO (Afrique de l'Ouest)
- **XAF** - Franc CFA BEAC (Afrique Centrale)
- **GNF** - Franc Guinéen

### Méthodes de Paiement
- Mobile Money
- Wave
- Orange Money
- Virement bancaire
- Carte de crédit
- Distributeur automatique

### Noms et Prénoms
Utilisation de noms authentiquement africains dans les données mock :
- Mamadou, Aïssatou, Ousmane, Fatou, Ibrahima, etc.

---

## 🔄 Flux de Données Typiques

### Flux d'Authentification
```
LoginComponent → AuthService.login(credentials)
                    ↓
                 Mock validation
                    ↓
                 AuthResponse
                    ↓
                 localStorage (browser only)
                    ↓
                 BehaviorSubject.next(user)
                    ↓
                 Redirect to Dashboard
```

### Flux de Transaction
```
TransactionListComponent → TransactionService.getTransactions(filter)
                              ↓
                           Filter mock data
                              ↓
                           Observable<Transaction[]>
                              ↓
                           Display in table
```

### Flux d'Export
```
Component → ExportService.exportToPDF(transactions)
               ↓
            Format data
               ↓
            Generate PDF with jsPDF
               ↓
            Trigger download
```

---

## 📝 Notes Techniques

### SSR (Server-Side Rendering)
Le `AuthService` est compatible SSR grâce à :
- Injection de `PLATFORM_ID`
- Utilisation de `isPlatformBrowser`
- Accès conditionnel à `localStorage`

### Typage Fort
Tous les modèles utilisent TypeScript pour :
- Interfaces strictes
- Enums pour les constantes
- Type safety à la compilation

### Réactivité
- Utilisation de RxJS pour la programmation réactive
- `Observable` pour toutes les opérations asynchrones
- `BehaviorSubject` pour l'état partagé

---

## 🎯 Évolutions Futures Possibles

1. **Persistence réelle** : Remplacer mock data par API REST
2. **WebSocket** : Notifications temps réel des transactions
3. **GraphQL** : Alternative à REST pour queries flexibles
4. **Audit trail** : Traçabilité des modifications
5. **Rapports avancés** : Graphiques et analyses statistiques
6. **Multi-tenant** : Support de plusieurs organisations

---

## 📚 Ressources

- [PlantUML Documentation](https://plantuml.com/)
- [UML Class Diagram Tutorial](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-class-diagram-tutorial/)
- [Angular Architecture Guide](https://angular.dev/guide/architecture)
- [RxJS Documentation](https://rxjs.dev/)

---

**Date de création** : 31 Octobre 2025
**Version** : 1.0
**Auteur** : Dashboard Transaction Team
