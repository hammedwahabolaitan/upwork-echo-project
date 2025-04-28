
import { API_URL, getToken, handleResponse } from './config';

export const createProposal = async (jobId: number, proposalData: { coverLetter: string; bidAmount: number }) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        cover_letter: proposalData.coverLetter,
        bid_amount: proposalData.bidAmount,
      }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error submitting proposal:", error);
    throw error;
  }
};

export const getJobProposals = async (jobId: number) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/proposals`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
};

export const updateProposalStatus = async (proposalId: number, status: "accepted" | "rejected") => {
  try {
    const response = await fetch(`${API_URL}/proposals/${proposalId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating proposal status:", error);
    throw error;
  }
};
