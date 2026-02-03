# Laravel API + JWT + RBAC System Architecture

## System Overview

```mermaid
graph TB
    subgraph "Frontend Application"
        A[React/Vue/Next.js]
        B[JWT Token Storage]
        C[Permission-based UI]
    end

    subgraph "API Gateway"
        D[HTTP Requests]
        E[JWT Authentication]
        F[Permission Middleware]
    end

    subgraph "Laravel Backend"
        subgraph "HTTP Layer"
            G[Routes]
            H[Controllers]
            I[Middleware]
        end

        subgraph "Business Logic Layer"
            J[Services]
            K[Policies]
            L[Business Rules]
        end

        subgraph "Data Layer"
            M[Models]
            N[Database]
            O[Relationships]
        end
    end

    subgraph "Supporting Services"
        P[JWT Token Management]
        Q[Permission Cache]
        R[Audit Logs]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> J
    J --> K
    K --> L
    J --> M
    M --> N
    M --> O
    P --> J
    Q --> J
    R --> J
```

## Folder Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   ├── LoginController.php
│   │   │   ├── RefreshTokenController.php
│   │   │   └── ForgotPasswordController.php
│   │   ├── UserController.php
│   │   └── RoleController.php
│   │
│   ├── Middleware/
│   │   ├── JwtAuthenticate.php
│   │   └── CheckPermission.php
│   │
│   ├── Requests/
│   │   ├── Auth/
│   │   │   └── LoginRequest.php
│   │   ├── User/
│   │   │   └── StoreUserRequest.php
│   │   └── Role/
│   │       └── StoreRoleRequest.php
│   │
│   └── Resources/
│       ├── UserResource.php
│       └── RoleResource.php
│
├── Services/
│   ├── Auth/
│   │   ├── LoginService.php
│   │   └── TokenService.php
│   ├── UserService.php
│   └── RoleService.php
│
├── Policies/
│   ├── UserPolicy.php
│   └── RolePolicy.php
│
├── Models/
│   ├── User.php
│   ├── Role.php
│   └── Permission.php
│
└── Support/
    ├── Auth/
    │   └── PermissionChecker.php
    └── Response/
        └── ApiResponse.php
```

## Database Schema

```mermaid
erDiagram
    users ||--o{ role_user : "has"
    users ||--o{ activity_logs : "creates"
    users {
        bigint id PK
        string name
        string email UK
        string password
        enum status
        timestamp last_login_at
        timestamps
    }

    roles ||--o{ role_user : "belongs to"
    roles ||--o{ permission_role : "has"
    roles {
        bigint id PK
        string name UK
        string label
        text description
        timestamps
    }

    permissions ||--o{ permission_role : "belongs to"
    permissions {
        bigint id PK
        string name UK
        string label
        string group
        timestamps
    }

    role_user {
        bigint user_id PK,FK
        bigint role_id PK,FK
        timestamps
    }

    permission_role {
        bigint role_id PK,FK
        bigint permission_id PK,FK
        timestamps
    }

    activity_logs {
        bigint id PK
        bigint user_id FK
        string action
        string target_type
        bigint target_id
        json metadata
        timestamps
    }
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant LoginController
    participant LoginService
    participant JWT
    participant Database
    participant PermissionChecker

    Client->>LoginController: POST /auth/login {email, password}
    LoginController->>LoginService: login($credentials)
    LoginService->>Database: Find user by email
    Database-->>LoginService: User data
    LoginService->>LoginService: Check status == 'active'
    LoginService->>LoginService: Verify password
    LoginService->>JWT: Generate token
    JWT-->>LoginService: JWT token
    LoginService->>PermissionChecker: Load user permissions
    PermissionChecker->>Database: Get user roles & permissions
    Database-->>PermissionChecker: Roles & permissions
    PermissionChecker-->>LoginService: Merged permissions
    LoginService-->>LoginController: Auth result
    LoginController-->>Client: {token, user, roles, permissions}
```

## Authorization Flow

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Controller
    participant Policy
    participant Service
    participant Model

    Client->>Middleware: Request with JWT
    Middleware->>Middleware: Validate JWT
    Middleware->>Middleware: Extract user
    Middleware->>Middleware: Check permission
    Middleware-->>Controller: Authenticated request
    Controller->>Policy: authorize($action, $model)
    Policy->>Policy: Check authorization rules
    Policy-->>Controller: Allow/Deny
    Controller->>Service: Execute business logic
    Service->>Model: Perform operations
    Model-->>Service: Result
    Service-->>Controller: Result
    Controller-->>Client: JSON response
```

## API Endpoints Structure

```mermaid
graph LR
    A[Auth Endpoints] --> A1[POST /auth/login]
    A --> A2[POST /auth/refresh]
    A --> A3[POST /auth/logout]
    A --> A4[POST /auth/forgot-password]
    A --> A5[POST /auth/reset-password]

    B[User Endpoints] --> B1[GET /me]
    B --> B2[GET /users]
    B --> B3[POST /users]
    B --> B4[PUT /users/{id}]
    B --> B5[PATCH /users/{id}/status]

    C[Role Endpoints] --> C1[GET /roles]
    C --> C2[POST /roles]
    C --> C3[PUT /roles/{id}]

    D[Permission Endpoints] --> D1[GET /permissions]

    E[Assignment Endpoints] --> E1[POST /users/{id}/roles]
    E --> E2[POST /roles/{id}/permissions]

    A --> F[No Authentication Required]
    B --> G[Authentication Required]
    C --> G
    D --> G
    E --> G
```

## Permission Naming Convention

```mermaid
graph TD
    A[Permission Format] --> B[action_resource]
    B --> C[Examples]

    C --> C1[create_order]
    C --> C2[edit_order]
    C --> C3[view_order]
    C --> C4[delete_order]
    C --> C5[refund_order]

    C --> C6[create_user]
    C --> C7[edit_user]
    C --> C8[view_user]
    C --> C9[manage_users]
    C --> C10[suspend_user]

    C --> C11[view_report]
    C --> C12[export_report]
    C --> C13[manage_roles]
    C --> C14[assign_permissions]

    D[Groups] --> D1[order]
    D --> D2[user]
    D --> D3[report]
    D --> D4[role]
    D --> D5[system]
```

## Security Layers

```mermaid
graph TB
    subgraph "Layer 1: Network Security"
        A1[HTTPS]
        A2[CORS]
        A3[Rate Limiting]
    end

    subgraph "Layer 2: Authentication"
        B1[JWT Validation]
        B2[Token Expiration]
        B3[Refresh Tokens]
    end

    subgraph "Layer 3: Authorization"
        C1[Permission Middleware]
        C2[Policy Checks]
        C3[Role-Based Access]
    end

    subgraph "Layer 4: Input Validation"
        D1[FormRequest Validation]
        D2[Data Sanitization]
        D3[SQL Injection Protection]
    end

    subgraph "Layer 5: Business Logic"
        E1[Service Layer]
        E2[Business Rules]
        E3[Audit Logging]
    end

    A1 --> B1
    B1 --> C1
    C1 --> D1
    D1 --> E1
```
