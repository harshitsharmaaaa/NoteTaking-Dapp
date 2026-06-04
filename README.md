# 📝 Note-Taking Dapp

> A fully decentralized, blockchain-powered note-taking application built on **Solana**. Create, store, update, and manage your notes securely on-chain with complete ownership and immutability.

<div align="center">

[![Solana](https://img.shields.io/badge/Blockchain-Solana-9945FF?style=flat-square&logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/Library-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🎯 Overview

**Note-Taking Dapp** is a decentralized application that revolutionizes how you store and manage notes. Unlike traditional centralized note-taking apps, your notes are stored directly on the **Solana blockchain**, ensuring:

- ✅ **Complete Ownership** - You control your data, not a company
- ✅ **Immutability** - Once created, notes are tamper-proof
- ✅ **Transparency** - All transactions are verifiable on-chain
- ✅ **Security** - Cryptographic signing ensures authenticity
- ✅ **Accessibility** - Access your notes from anywhere with a Solana wallet

---

## ✨ Features

### Core Functionality
- 📝 **Create Notes** - Add new notes with title and content
- 📖 **View Notes** - Browse all your notes with timestamps
- ✏️ **Update Notes** - Edit content of existing notes
- 🗑️ **Delete Notes** - Remove notes from the blockchain
- 🔐 **Wallet Authentication** - Secure access via Phantom wallet

### User Experience
- 🎨 **Beautiful UI** - Clean, modern interface with Tailwind CSS
- ⚡ **Real-time Updates** - Instant feedback on all operations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⏱️ **Timestamps** - Track creation and update times
- 🔤 **Character Limits** - Smart validation (title: 100 chars, content: 1000 chars)
- 💬 **User Feedback** - Clear messaging for all operations

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          React Components & State Management          │  │
│  │  - Page Component (CRUD operations)                  │  │
│  │  - Wallet Provider (Solana integration)              │  │
│  │  - UI Components (Forms, Lists, Buttons)             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Web3.js + Anchor SDK
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Solana Wallet (Phantom)                         │
│  - Signs transactions                                        │
│  - Manages user keys                                         │
│  - Broadcasts to network                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ RPC Calls
                 │
┌────────────────▼────────────────────────────────────────────┐
│         Solana Blockchain (Devnet)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Notes Smart Contract (Anchor Program)             │  │
│  │  Program ID: 5VbB9hthf1DcTrrnM2cyvN9iqruj3k9CMyjD.. │  │
│  │  - createNote(title, content)                        │  │
│  │  - updateNote(content)                               │  │
│  │  - deleteNote()                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           On-Chain Data Storage (PDAs)                │  │
│  │  - Note Account: author + title + content + times    │  │
│  │  - Derived from: ["note", author, title]             │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → React State Update → Sign with Wallet → 
Send Transaction → Smart Contract Execution → 
Update On-Chain Account → Reload Notes → UI Update
```

### Smart Contract Account Structure

```
┌─────────────────────────────────┐
│    Note Account (PDA)           │
├─────────────────────────────────┤
│ author: PublicKey               │ ← Wallet owner
│ title: String (max 100 chars)   │ ← Note title
│ content: String (max 1000 chars)│ ← Note content
│ createdAt: i64                  │ ← Timestamp
│ lastUpdated: i64                │ ← Update timestamp
└─────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
note-taking-app/
│
├── 📄 README.md                    # Project documentation
├── 📦 package.json                 # Dependencies & scripts
├── 🔧 tsconfig.json               # TypeScript configuration
├── 🔧 next.config.ts              # Next.js configuration
├── 🔧 tailwind.config.js          # Tailwind CSS setup
├── 🔧 postcss.config.mjs          # PostCSS configuration
├── 🔧 eslint.config.mjs           # ESLint configuration
│
├── 📁 app/                         # Next.js App Router
│   ├── page.tsx                   # ⭐ Main application page
│   ├── layout.tsx                 # Root layout wrapper
│   ├── globals.css                # Global styles & Tailwind imports
│   └── favicon.ico                # App icon
│
├── 📁 components/                 # Reusable React components
│   └── WalletContextProvider.tsx  # Solana wallet integration & header
│
├── 📁 web3/                       # Blockchain utilities
│   └── Binary.ts                  # Anchor IDL & Program configuration
│
├── 📁 public/                     # Static assets
│   ├── next.svg
│   ├── vercel.svg
│   ├── globe.svg
│   ├── file.svg
│   └── window.svg
│
└── 📁 node_modules/              # Dependencies (auto-generated)
```

### File Descriptions

| File | Purpose |
|------|---------|
| **app/page.tsx** | Core component with CRUD logic, state management, and UI rendering |
| **app/layout.tsx** | Root layout integrating WalletContextProvider |
| **app/globals.css** | Tailwind CSS imports and theme configuration |
| **components/WalletContextProvider.tsx** | Solana wallet adapter setup and header navigation |
| **web3/Binary.ts** | Anchor IDL definition and smart contract Program ID |

---

## 💻 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.6 | React framework with SSR & SSG |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first CSS framework |
| **PostCSS** | - | CSS transformation |

### Blockchain
| Technology | Version | Purpose |
|-----------|---------|---------|
| **@solana/web3.js** | ^1.98.4 | Solana blockchain SDK |
| **@project-serum/anchor** | ^0.26.0 | Smart contract framework & IDL |
| **@solana/wallet-adapter-react** | ^0.15.39 | Wallet integration |
| **@solana/wallet-adapter-react-ui** | ^0.9.39 | Wallet UI components |
| **@solana/wallet-adapter-wallets** | ^0.19.38 | Wallet implementations |
| **@solana/wallet-adapter-base** | - | Base wallet adapter |

### Development
| Tool | Version | Purpose |
|-----|---------|---------|
| **ESLint** | ^9 | Code quality & linting |
| **Node.js Types** | ^20 | TypeScript node definitions |
| **React Types** | ^19 | TypeScript react definitions |

---

## 🚀 Getting Started

### Prerequisites
- 🔐 **Node.js** (v16 or higher)
- 📦 **npm** or **yarn** package manager
- 🦊 **Phantom Wallet** browser extension
- 💰 **SOL tokens** on Devnet (for transactions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshitsharmaaaa/NoteTaking-Dapp.git
   cd note-taking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Phantom Wallet**
   - Install [Phantom Wallet](https://phantom.app/) browser extension
   - Create or import a wallet
   - Switch network to **Devnet**

4. **Get testnet SOL (Optional)**
   - Visit [Solana Faucet](https://solfaucet.com/)
   - Enter your wallet address
   - Request airdrop

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

---

## 📖 User Guide

### Connecting Your Wallet

1. Click the **"Connect Wallet"** button or **"Select Wallet"** in the header
2. Choose **Phantom** from the available wallets
3. Approve the connection in Phantom popup
4. Your wallet address will appear in the header

### Creating a Note

1. Enter a title (max 100 characters) in the "Title" field
2. Type your note content (max 1000 characters) in the "Content" field
3. Click **"Create Note"** button
4. Approve the transaction in your Phantom wallet
5. Wait for confirmation - your note will appear in the list below

### Viewing Your Notes

- All your notes are displayed in the **"Your Notes"** section
- Each note shows:
  - 📝 Title
  - 📄 Content
  - 🕐 Created timestamp
  - ⏱️ Last updated timestamp

### Editing a Note

1. Click the **"Edit"** button on the note you want to modify
2. Update the content in the textarea that appears
3. Click **"Update"** to save changes
4. Approve the transaction in Phantom
5. Click **"Cancel Editing"** to discard changes

### Deleting a Note

1. Click the **"Delete"** button on the note
2. Approve the deletion transaction in Phantom
3. The note will be permanently removed from the blockchain

---

## 🔐 Smart Contract Details

### Program ID
```
5VbB9hthf1DcTrrnM2cyvN9iqruj3k9CMyjDSmi74c2k
```

### Contract Accounts

#### **Note Account**
```typescript
{
  author: PublicKey,           // Wallet address that created the note
  title: string,               // Note title (max 100 chars)
  content: string,             // Note content (max 1000 chars)
  createdAt: i64,              // Unix timestamp of creation
  lastUpdated: i64             // Unix timestamp of last update
}
```

### Contract Instructions

#### **1. Create Note**
```typescript
Instructions: createNote(title: string, content: string)
Accounts:
  - note (writable) - The new note account to be created
  - author (signer) - The wallet creating the note
  - systemProgram - Required for account creation
```

#### **2. Update Note**
```typescript
Instructions: updateNote(content: string)
Accounts:
  - note (writable) - The note to be updated
  - author (signer) - Must be the original author
```

#### **3. Delete Note**
```typescript
Instructions: deleteNote()
Accounts:
  - note (writable) - The note to be deleted
  - author (signer) - Must be the original author
```

### Validation & Constraints

- ✅ **Title validation**: Max 100 characters, must be non-empty
- ✅ **Content validation**: Max 1000 characters, must be non-empty
- ✅ **Authorization**: Only the original author can update/delete notes
- ✅ **Error handling**: Clear error messages for validation failures

---

## 💡 Key Features Explained

### Program Derived Addresses (PDAs)

Notes use PDAs for deterministic account addresses:
```typescript
PDA = PublicKey.findProgramAddressSync(
  [
    Buffer.from("note"),      // Seed 1: Discriminator
    wallet.publicKey.toBuffer(), // Seed 2: Author's public key
    Buffer.from(title)        // Seed 3: Note title
  ],
  PROGRAM_ID
)
```

This ensures:
- 📌 **Unique addresses** for each note per user
- 🔍 **Deterministic derivation** - Same inputs always produce same address
- 🔒 **No duplicate notes** - Can't create multiple notes with same title for one user

### Real-time Note Loading

Notes are fetched using Anchor's `memcmp` filter:
```typescript
const notes = await program.account.note.all([
  {
    memcmp: {
      offset: 8,                           // Skip discriminator
      bytes: wallet.publicKey.toBase58()   // Filter by author
    }
  }
]);
```

This efficiently retrieves only notes belonging to the connected wallet.

---

## 🔧 Development

### Code Quality

Run ESLint to check code quality:
```bash
npm run lint
```

### Project Dependencies

**Core Dependencies:**
- `@project-serum/anchor` - Smart contract framework
- `@solana/web3.js` - Solana blockchain SDK
- `@solana/wallet-adapter-*` - Wallet integration
- `next` - React framework
- `react` - UI library
- `tailwindcss` - CSS framework

**Dev Dependencies:**
- `typescript` - Type checking
- `eslint` - Code linting
- `tailwindcss` - CSS generation

### TypeScript Configuration

The project uses strict TypeScript settings:
- ✅ Strict mode enabled
- ✅ Module resolution: bundler
- ✅ Target: ES2017
- ✅ Path aliases for imports (`@/*`)

---

## 🐛 Troubleshooting

### Issue: "Wallet not connected"
**Solution:** Click "Connect Wallet" button and select Phantom from the modal

### Issue: "Error Creating Note"
**Possible causes:**
- Insufficient SOL in wallet
- Phantom wallet not approved for transaction
- Network connection issues
- Invalid title or content format

### Issue: "Notes not loading"
**Solution:**
- Refresh the page
- Ensure wallet is connected to Devnet
- Check browser console for errors

### Issue: "Transaction failed"
**Steps:**
1. Check Phantom wallet balance
2. Verify you're on Solana Devnet network
3. Refresh the page and try again
4. Check browser console for detailed error messages

---

## 📊 Network Information

- **Blockchain**: Solana
- **Network**: Devnet (Development/Testing)
- **RPC Endpoint**: Solana public RPC
- **Wallet**: Phantom

### Switching Networks in Phantom

1. Click Phantom extension
2. Click your wallet name
3. Select "Devnet" from network dropdown
4. Refresh the app

---

## 📝 Validation Rules

### Note Validation

| Field | Min Length | Max Length | Required |
|-------|-----------|-----------|----------|
| Title | 1 char | 100 chars | Yes |
| Content | 1 char | 1000 chars | Yes |

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Title and Content cannot be empty" | Missing title or content | Fill in both fields |
| "Title cannot be longer than 100 chars" | Title exceeds limit | Shorten title |
| "Content cannot be longer than 1000 chars" | Content exceeds limit | Shorten content |
| "Content cannot be empty" (Edit) | Empty update content | Provide new content |
| "Error Creating Note" | Contract execution failed | Check console and retry |
| "Error Updating Note" | Only author can update | Verify wallet connection |
| "Error Deleting Note" | Only author can delete | Verify wallet connection |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Use TypeScript with strict mode
- Write clear commit messages
- Test changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📚 Resources

### Solana Documentation
- [Solana Developer Guide](https://docs.solana.com/)
- [Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Book](https://www.anchor-lang.com/)

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

### Blockchain Resources
- [Solana Faucet](https://solfaucet.com/) - Get testnet SOL
- [Phantom Wallet](https://phantom.app/) - Download wallet
- [Solana Explorer](https://explorer.solana.com/) - View transactions

---

## 👤 Author

**Harshit Sharma**

- GitHub: [@harshitsharmaaaa](https://github.com/harshitsharmaaaa)
- Repository: [NoteTaking-Dapp](https://github.com/harshitsharmaaaa/NoteTaking-Dapp)

---

## 🙏 Acknowledgments

- [Solana Foundation](https://solana.com/)
- [Phantom Wallet](https://phantom.app/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Vercel](https://vercel.com/) for Next.js

---

<div align="center">

**Made with ❤️ for the Solana ecosystem**

[![Star us on GitHub!](https://img.shields.io/github/stars/harshitsharmaaaa/NoteTaking-Dapp?style=social)](https://github.com/harshitsharmaaaa/NoteTaking-Dapp)

</div>
