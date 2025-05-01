import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';

// Initialize Appwrite client

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('681312ad0000dd31f180');

// Initialize Appwrite services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Database and collection IDs
const DATABASE_ID = '681316040007bdd30eee';
const APPLICATIONS_COLLECTION_ID = '681316d6000e0b4c2985';
const STORAGE_BUCKET_ID = '68131e98002e14afc25f';

// Helper functions for applications
const appwriteService = {
    // Create a new application submission
    async createApplication(formData) {
        try {
            // Upload driver's license images first
            const dlFrontFile = formData.dlFront;
            const dlBackFile = formData.dlBack;
            
            let dlFrontId = null;
            let dlBackId = null;
            
            if (dlFrontFile) {
                try {
                    const frontUpload = await storage.createFile(
                        STORAGE_BUCKET_ID,
                        ID.unique(),
                        dlFrontFile,
                        [
                            // Allow any user to upload files
                            Permission.write(Role.any()),
                            Permission.read(Role.any())
                        ]
                    );
                    dlFrontId = frontUpload.$id;
                    console.log('Front license uploaded successfully:', dlFrontId);
                } catch (error) {
                    console.error('Error uploading front license:', error);
                }
            }
            
            if (dlBackFile) {
                try {
                    const backUpload = await storage.createFile(
                        STORAGE_BUCKET_ID,
                        ID.unique(),
                        dlBackFile,
                        [
                            // Allow any user to upload files
                            Permission.write(Role.any()),
                            Permission.read(Role.any())
                        ]
                    );
                    dlBackId = backUpload.$id;
                    console.log('Back license uploaded successfully:', dlBackId);
                } catch (error) {
                    console.error('Error uploading back license:', error);
                }
            }
            
            // Create application document
            console.log('Creating application document with data:', {
                name: formData.name,
                email: formData.email,
                dlFrontId,
                dlBackId
            });
            
            // Convert string values to arrays where needed and ensure constraints are met
            const applicationData = {
                name: [formData.name || ''],  // Convert to array
                email: formData.email || '',
                phone: formData.phone || '',
                address: formData.address || '',
                city: formData.city || '',
                state: formData.state || '',
                zip: formData.zip || '',
                ssn: (formData.ssn || '').substring(0, 10),  // Limit to 10 characters
                age: formData.age ? parseInt(formData.age) : 0,
                position: (formData.position || '').substring(0, 10),  // Limit to 10 characters
                experience: formData.experience || '',
                availability: formData.availability || '',
                dlFrontId: dlFrontId,
                dlBackId: dlBackId,
                submittedAt: new Date().toISOString()
            };
            
            const application = await databases.createDocument(
                DATABASE_ID,
                APPLICATIONS_COLLECTION_ID,
                ID.unique(),
                applicationData,
                [
                    // Allow any user to create documents
                    Permission.write(Role.any()),
                    Permission.read(Role.any())
                ]
            );
            
            console.log('Application created successfully:', application.$id);
            return application;
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    },
    
    // Get all applications
    async getApplications() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                APPLICATIONS_COLLECTION_ID,
                [
                    Query.orderDesc('submittedAt')
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    },
    
    // Get a single application by ID
    async getApplication(id) {
        try {
            return await databases.getDocument(
                DATABASE_ID,
                APPLICATIONS_COLLECTION_ID,
                id
            );
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    },
    
    // Get file preview URL
    getFilePreview(fileId) {
        return storage.getFilePreview(STORAGE_BUCKET_ID, fileId);
    },
    
    // Get file download URL
    getFileDownload(fileId) {
        return storage.getFileDownload(STORAGE_BUCKET_ID, fileId);
    },
    
    // Admin authentication
    async login(email, password) {
        try {
            const session = await account.createEmailSession(email, password);
            return session;
        } catch (error) {
            console.error('Appwrite authentication error:', error);
            throw error;
        }
    },
    
    // Get current session
    async getCurrentSession() {
        try {
            return await account.get();
        } catch (error) {
            console.error('No active session');
            return null;
        }
    },
    
    // Logout
    async logout() {
        try {
            await account.deleteSession('current');
            return true;
        } catch (error) {
            console.error('Appwrite logout error:', error);
            throw error;
        }
    }
};

export { appwriteService };
export default appwriteService;
