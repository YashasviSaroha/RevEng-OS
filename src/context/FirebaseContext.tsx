import React, { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, writeBatch, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, OperationType, handleFirestoreError } from "../firebase";
import { WorkspaceConfig, BuyingSignal, Integration, Lead } from "../types";

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  
  // Cloud Firestore operations
  loadUserData: () => Promise<{
    config: WorkspaceConfig | null;
    signals: BuyingSignal[] | null;
    integrations: Integration[] | null;
    leads: Lead[] | null;
  }>;
  saveWorkspaceConfig: (config: WorkspaceConfig) => Promise<void>;
  saveSignal: (signal: BuyingSignal) => Promise<void>;
  saveIntegration: (integration: Integration) => Promise<void>;
  saveLead: (lead: Lead) => Promise<void>;
  saveLeadsBatch: (leads: Lead[]) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Helper to load all user workspace configurations, triggers, and leads
  const loadUserData = async () => {
    if (!auth.currentUser) return { config: null, signals: null, integrations: null, leads: null };
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);
    
    try {
      // 1. Get fundamental user Doc
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        return { config: null, signals: null, integrations: null, leads: null };
      }
      
      const userData = userDoc.data();
      const config: WorkspaceConfig = {
        companyWebsite: userData.companyWebsite || "",
        companyDescription: userData.companyDescription || "",
        targetIndustry: userData.targetIndustry || "",
        targetGeography: userData.targetGeography || "",
        companySizeRange: userData.companySizeRange || "",
        targetPersonas: userData.targetPersonas || [],
        fundingStages: userData.fundingStages || [],
      };

      // 2. Fetch signals
      const signalsColRef = collection(db, "users", userId, "signals");
      const signalsSnap = await getDocs(signalsColRef);
      const signals: BuyingSignal[] = [];
      signalsSnap.forEach(doc => {
        signals.push(doc.data() as BuyingSignal);
      });

      // 3. Fetch integrations
      const integrationsColRef = collection(db, "users", userId, "integrations");
      const integrationsSnap = await getDocs(integrationsColRef);
      const integrations: Integration[] = [];
      integrationsSnap.forEach(doc => {
        integrations.push(doc.data() as Integration);
      });

      // 4. Fetch leads
      const leadsColRef = collection(db, "users", userId, "leads");
      const leadsSnap = await getDocs(leadsColRef);
      const leads: Lead[] = [];
      leadsSnap.forEach(doc => {
        leads.push(doc.data() as Lead);
      });

      return {
        config: Object.keys(config).length > 0 ? config : null,
        signals: signals.length > 0 ? signals : null,
        integrations: integrations.length > 0 ? integrations : null,
        leads: leads.length > 0 ? leads : null
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return { config: null, signals: null, integrations: null, leads: null };
    }
  };

  // Save/Update fundamental user Workspace configuration
  const saveWorkspaceConfig = async (config: WorkspaceConfig) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);
    
    try {
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          userId,
          email: auth.currentUser.email || "",
          ...config,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(userDocRef, {
          ...config,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  };

  // Save/Update individual signal target properties
  const saveSignal = async (signal: BuyingSignal) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const signalDocRef = doc(db, "users", userId, "signals", signal.id);
    
    try {
      await setDoc(signalDocRef, signal);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/signals/${signal.id}`);
    }
  };

  // Save/Update single third party integration info
  const saveIntegration = async (integration: Integration) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const intDocRef = doc(db, "users", userId, "integrations", integration.id);
    
    try {
      await setDoc(intDocRef, integration);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/integrations/${integration.id}`);
    }
  };

  // Save/Update single lead metadata
  const saveLead = async (lead: Lead) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const leadDocRef = doc(db, "users", userId, "leads", lead.id);
    
    try {
      await setDoc(leadDocRef, lead);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/leads/${lead.id}`);
    }
  };

  // Batch-save newly simulated/scraped pipeline profiles
  const saveLeadsBatch = async (leads: Lead[]) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    
    try {
      const batch = writeBatch(db);
      leads.forEach(lead => {
        const leadDocRef = doc(db, "users", userId, "leads", lead.id);
        batch.set(leadDocRef, lead);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/leads/batch`);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logout,
        loadUserData,
        saveWorkspaceConfig,
        saveSignal,
        saveIntegration,
        saveLead,
        saveLeadsBatch
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
