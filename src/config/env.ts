import { z } from 'zod';

// Define environment variable schema
const envSchema = z.object({
    // Firebase
    VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
    VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
    VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
    VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
    VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),

    // Optional
    VITE_API_BASE_URL: z.string().url().optional(),
    MODE: z.enum(['development', 'production', 'test']).optional(),
});

// Validate and export environment variables
function validateEnv() {
    try {
        return envSchema.parse(import.meta.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
            throw new Error(
                `Missing or invalid environment variables: ${missingVars}\n` +
                'Please check your .env file and ensure all required variables are set.'
            );
        }
        throw error;
    }
}

export const env = validateEnv();

// Helper to check if we're in production
export const isProduction = env.MODE === 'production';
export const isDevelopment = env.MODE === 'development';
