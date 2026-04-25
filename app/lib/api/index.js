// Re-export all API functions from organized modules

// Client
export { apiFetch } from "./client";

// Auth
export { getMe, completeOnboarding, updateProfile, updateOrganization } from "./auth";

// Chat
export { ragChat } from "./chat";

// Documents
export {
    getDocuments,
    getDocument,
    uploadDocument,
    deleteDocument,
} from "./documents";
