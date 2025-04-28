
import { JobCreateData, JobUpdateData, Job } from './types';
import { API_URL, getToken, handleResponse } from './config';

export const getJobs = async () => {
  try {
    const response = await fetch(`${API_URL}/jobs`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const getJobById = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    throw error;
  }
};

export const createJob = async (jobData: JobCreateData) => {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(jobData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const updateJob = async (id: number, jobData: JobUpdateData) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(jobData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const updateJobStatus = async (id: number, status: Job['status']) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
};

export const deleteJob = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
