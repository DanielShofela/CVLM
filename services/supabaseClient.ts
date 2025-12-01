
import { createClient } from '@supabase/supabase-js';

// Configuration de la base de données Supabase
const SUPABASE_URL = 'https://fxxivevcodwsloftfkba.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4eGl2ZXZjb2R3c2xvZnRma2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDk3MjYsImV4cCI6MjA3OTkyNTcyNn0.OQ-IeZdo9ZwMHOOu55QSdEhhPhsyuyzxXbVuEVAt7xg';

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Vérifie si Supabase est correctement configuré dans le code
 */
export const isSupabaseConfigured = () => {
  return SUPABASE_URL && SUPABASE_ANON_KEY && (SUPABASE_URL as string) !== 'https://votre-projet.supabase.co';
};

/**
 * Teste la connexion réelle au serveur Supabase
 */
export const checkDbConnection = async () => {
  if (!isSupabaseConfigured()) return { success: false, message: "Configuration manquante" };
  
  try {
    // On essaie juste de voir si la table existe (head: true ne récupère pas de données, juste les métadonnées)
    const { error } = await supabase.from('cv_requests').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("Erreur connexion Supabase:", error);
      // Si l'erreur est 404 ou relation "cv_requests" does not exist
      if (error.message.includes('relation') || error.code === '42P01') {
        return { success: false, message: "Table 'cv_requests' manquante" };
      }
      return { success: false, message: error.message };
    }
    
    return { success: true, message: "Connecté" };
  } catch (err: any) {
    return { success: false, message: err.message || "Erreur réseau" };
  }
};

/**
 * Sauvegarde une demande de CV dans la base de données
 */
export const saveCVRequest = async (requestData: any) => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase n'est pas configuré.");
    return { error: { message: "Supabase not configured" }, data: null };
  }

  try {
    const { data, error } = await supabase
      .from('cv_requests')
      .insert([
        { 
          full_name: requestData.fullName,
          email: requestData.email,
          template_name: requestData.templateName || 'Inconnu',
          form_data: requestData, // Sauvegarde tout le JSON du formulaire
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error("Erreur Supabase:", error);
    }
    
    return { data, error };
  } catch (err) {
    console.error("Exception Supabase:", err);
    return { data: null, error: err };
  }
};
