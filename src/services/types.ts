
// API Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "client" | "freelancer" | "admin";
  bio?: string;
  skills?: string;
  hourlyRate?: number;
  avatarUrl?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  skills: string;
  duration: string;
  client_id: number;
  status: "open" | "in_progress" | "completed" | "cancelled";
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "client" | "freelancer";
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  bio?: string;
  skills?: string;
  hourlyRate?: number;
}

export interface JobCreateData {
  title: string;
  description: string;
  budget: number;
  skills: string;
  duration: string;
}

export interface JobUpdateData {
  title: string;
  description: string;
  budget: number;
  skills: string;
  duration: string;
  status: Job['status'];
}

export interface Proposal {
  id: number;
  job_id: number;
  freelancer_id: number;
  cover_letter: string;
  bid_amount: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}
