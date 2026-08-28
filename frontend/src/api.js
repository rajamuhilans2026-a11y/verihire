import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadJobDescription = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/upload/job', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const uploadCandidate = async (name, resumeFile, transcriptFile) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('resume', resumeFile)
  if (transcriptFile) {
    formData.append('transcript', transcriptFile)
  }
  
  const response = await api.post('/upload/candidate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const buildCandidateProfile = async (candidateId) => {
  const response = await api.post(`/profile/${candidateId}`)
  return response.data
}

export const evaluateCandidate = async (candidateId, jobId) => {
  const response = await api.post(`/evaluate/${candidateId}`, { job_id: jobId })
  return response.data
}

export const getCandidates = async () => {
  const response = await api.get('/candidates')
  return response.data
}

export const getCandidate = async (candidateId) => {
  const response = await api.get(`/candidates/${candidateId}`)
  return response.data
}

export const getEvaluationResults = async (candidateId) => {
  const response = await api.get(`/results/${candidateId}`)
  return response.data
}

export default api
