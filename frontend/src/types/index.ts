export interface Diploma {
  id: string;
  nom_Diplome: string;
  ecole: string;
  career: string[];
  employement_Opportunities: string[];
  ancienne_Diplome: string;
  filiere: string;
  duree: number;
  mention_Bac: 'Très Bien' | 'Bien' | 'Assez Bien' | '';
  ville: string;
  matieres_Diplome: string[];
  matieres_Etudiant: string[];
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface DiplomaStats {
  total: number;
  byEcole: Record<string, number>;
  byVille: Record<string, number>;
  byFiliere: Record<string, number>;
  byMentionBac: Record<string, number>;
  byDuree: Record<string, number>;
  topCareers: Array<{name: string, count: number}>;
  topEmploymentOpportunities: Array<{name: string, count: number}>;
}

export type MentionBacOption = 'Très Bien' | 'Bien' | 'Assez Bien' | '';