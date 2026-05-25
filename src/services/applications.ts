import type { JobApplication, ApplicationResumeSettings, ApplicantReference } from '../types'

const API_BASE_URL = 
// 'http://localhost:8000'
  // import.meta.env.VITE_API_BASE_URL ?? 
  'https://eliazar.heliohost.us/backend'

const requestJson = async <T>(
  url: string,
  body: Record<string, unknown>,
) => {
  console.log(body)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = (await response.json()) as T

  if (!response.ok || !(payload as { success?: boolean }).success) {
    const message = (payload as { message?: string }).message || 'Request failed'
    throw new Error(message)
  }

  return payload
}

const requestJsonWithMethod = async <T>(
  url: string,
  method: 'DELETE' | 'POST',
  body?: Record<string, unknown>,
) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = (await response.json()) as T

  if (!response.ok || !(payload as { success?: boolean }).success) {
    const message = (payload as { message?: string }).message || 'Request failed'
    throw new Error(message)
  }

  return payload
}

type ApplicationPayload = {
  jobApplication: JobApplication & {
    agreesToDrugTest?: boolean
    JobApplicationStatus?: string
  }
  references?: ApplicantReference[]
  resumeSettings?: ApplicationResumeSettings
}

export const createApplication = async (payload: ApplicationPayload) =>
  requestJson(`${API_BASE_URL}/api/applications/create.php`, payload)

export const updateApplication = async (payload: ApplicationPayload) =>
  requestJson(`${API_BASE_URL}/api/applications/update.php`, payload)

export const deleteApplication = async (jobApplicationId: string) =>
  requestJson(`${API_BASE_URL}/api/applications/delete.php`, { jobApplicationId })

export const deleteNestedItem = async (type: 'education' | 'employment' | 'certificate' | 'training' | 'reference', id: string) =>
  requestJsonWithMethod(
    `${API_BASE_URL}/api/delete_nested.php?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`,
    'DELETE',
  )

export const getResumeSettings = async (jobApplicationId: string) =>
  requestJson<{ success: boolean; data: ApplicationResumeSettings }>(
    `${API_BASE_URL}/api/applications/get.php`,
    { jobApplicationId }
  )

export const getApplicationsForApplicant = async (applicantId: string) =>
  requestJson<{
    success: boolean
    data: Array<
      JobApplication & {
        resumeTemplate?: ApplicationResumeSettings['resumeTemplate']
        previewFont?: string
        settingsLastUpdated?: string
      }
    >
  }>(`${API_BASE_URL}/api/applications/list.php`, { applicantId })
