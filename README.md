# Recruiter POS Service

Enterprise-grade multi-tenant backend for recruiter portfolio management. Built with Node.js, TypeScript, and MongoDB.

## 🚀 Quick Start

### 1. Requirements
- Node.js 22 LTS
- MongoDB (Running locally or on Atlas)

### 2. Setup (Automated)
Run the following command to install dependencies, configure environment, and seed the database:

**Windows:**
```powershell
./setup.bat
```

**Linux/Mac:**
```bash
./setup.sh
```

### 3. Manual Installation
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Seed the database
npm run seed
```

## 📂 Project Structure

- `src/controller`: API request handlers (dot-notation)
- `src/service`: Business logic layer
- `src/repository`: Data access layer (BaseRepository pattern)
- `src/entity`: Mongoose models and interfaces
- `src/seed`: Database seeding logic (renamed from scripts)
- `src/middleware`: Custom Express middleware
- `src/routes`: API route definitions
- `src/validators`: Request validation logic

## 🛡️ API Standards
- **Tenancy**: Every request must include a `x-tenant-id` header.
- **Auditing**: All records include `auditInfo` (createdBy, updatedBy, timestamps).
- **Standards**: Follows 10xTA architectural standards for naming and structure.

## 📄 Documentation
Standardized OpenAPI/Swagger documentation is available at `/api-docs` when the server is running.
