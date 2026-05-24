export type Applicant = {
  applicantId: string
  applicantName: string
  homeAddress: string
  phoneNumber: string
  emailAddress: string
  linkedInUrl: string
  citizenshipStatus: string
  hasCriminalHistory: boolean | null
  agreesToDrugTest: boolean | null
}

export type JobApplication = {
  JobApplicationId: string
  applicantId: string
  appliedPosition: string
  JobApplicationDate: string
  JobApplicationStatus?: string
  lastUpdated: string
  availableStartDate: string
  expectedSalary: string
  resumeFileUrl: string
  references?: ApplicantReference[]
  trainings?: Training[]
  certificates?: Certificate[]
  agreedToTerms?: boolean
  dateAgreed?: string
}

export type Education = {
  educationId: string
  applicantId: string
  schoolId?: string
  schoolName: string
  schoolLocation: string
  startYear: string
  endYear: string
  degreeReceived: string
  programName: string
}

export type EmploymentHistory = {
  EmploymentHistoryId: string
  applicantId: string
  companyName: string
  companyId?: string
  companyAddress: string
  workPosition: string
  reasonForLeaving?: string | null
  companyPhone?: string | null
  startDate: string
  endDate: string
  isEmployed?: boolean
}

export type ApplicantReference = {
  referenceId: string
  applicantId: string
  referenceName: string
  referenceTitle: string
  referenceCompany: string
  referencePhone: string
  referenceEmail: string
}

export type Training = {
  trainingId: string
  trainingTitle: string
  trainingDescription: string
  trainingInstructor: string
  trainingDurationHours: string
  completionDate?: string
}

export type Certificate = {
  certificateId: string
  certificateName: string
  issuingAuthority: string
  validityMonths: string
  dateIssued?: string
}

export type ApplicationResumeSettings = {
  JobApplicationId: string
  resumeTemplate: 'classic' | 'compact' | 'modern'
  previewFont: string
  lastUpdated?: string
}
