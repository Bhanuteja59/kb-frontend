// Re-export all API functions from organized modules

// Client
export { apiFetch } from "./client";

// Auth  
export { login, signup, getMe, completeOnboarding } from "./auth";

// Chat
export { ragChat } from "./chat";

// Documents
export {
    getDocuments,
    getDocument,
    uploadDocument,
    uploadFromDrive,
    deleteDocument,
    restoreDocument
} from "./documents";
