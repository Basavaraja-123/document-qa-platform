# Document Q&A Platform

A streamlined web application for document management and question answering using RAG (Retrieval-Augmented Generation) technology. This platform allows users to upload documents, manage them, and ask questions to get relevant answers based on the document content.


## Features

- **User Authentication**: Secure login and signup functionality
- **Document Management**: Upload, view, and delete documents
- **Document Tagging**: Organize documents with custom tags
- **Q&A Interface**: Ask questions about your documents and get AI-powered answers
- **Source Attribution**: See which documents were used to generate answers
- **User Management**: Admin panel for managing users and permissions
- **Ingestion Tracking**: Monitor document processing status

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom UI components based on shadcn/ui
- **Authentication**: Custom auth system (mock implementation for demo)
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Basavaraja-123/document-qa-platform.git
cd document-qa-platform
```

2. Install dependencies:

```sh
npm install
# or
yarn install
```

3. Start the development server:

```sh
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Authentication

For demo purposes, you can use the following credentials:

- **Email**: basavaraj1@gmail.com
- **Password**: password

Or you can create a new account using the signup page.

### Document Upload

1. Navigate to the Dashboard
2. Click on "Upload Document" or go to the Upload page
3. Drag and drop files or click to browse
4. Add description and tags
5. Click "Upload"

### Asking Questions

1. Navigate to the Q&A page
2. Type your question in the input field
3. Press "Send" to get an answer
4. View the answer and its sources

## Project Structure

```sh
document-qa-platform/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard pages
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # UI components
│   │   └── ui-components.tsx  # All UI components
├── context/                # React context providers
│   └── auth-context.tsx    # Authentication context
├── lib/                    # Utility functions and mock data
│   ├── mock-data.ts        # Mock data for demo
│   ├── mock-services.ts    # Mock API services
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
└── README.md               # Project documentation
```

## Features in Detail

### Document Management

The platform allows users to upload various document types (PDF, DOCX, TXT, CSV, XLSX, PPTX) and organize them with tags. Users can search for documents by name or tags, and view or delete them as needed.

### Q&A System

The Q&A system uses a RAG (Retrieval-Augmented Generation) approach to answer questions based on the content of uploaded documents. When a user asks a question, the system:

1. Retrieves relevant documents
2. Extracts information from those documents
3. Generates an answer based on the extracted information
4. Provides source attribution to show which documents were used

### User Management

Administrators can:
- View all users
- Add new users
- Set user roles (admin, user, viewer)
- Delete users

## Future Improvements

- [ ] Implement real authentication with NextAuth.js
- [ ] Add document preview functionality
- [ ] Implement dark mode toggle
- [ ] Add mobile responsiveness
- [ ] Integrate with a vector database for better RAG performance
- [ ] Add document version control
- [ ] Implement collaborative features
- [ ] Add analytics dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.