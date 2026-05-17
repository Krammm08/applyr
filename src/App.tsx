import { useMemo, useState } from 'react'
import './App.css'

type PortalView = 'applicant' | 'recruiter'

type Applicant = {
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

type JobApplication = {
  JobApplicationId: string
  applicantId: string
  appliedPosition: string
  JobApplicationDate: string
  JobApplicationStatus: 'Pending' | 'Under Review' | 'Interview' | 'Rejected' | 'Accepted'
  availableStartDate: string
  expectedSalary: string
  resumeFileUrl: string
}

type Education = {
  educationId: string
  applicantId: string
  schoolName: string
  schoolLocation: string
  yearsAttended: string
  degreeReceived: string
  programName: string
}

type EmploymentHistory = {
  EmploymentHistoryId: string
  applicantId: string
  companyName: string
  workAddress: string
  workPosition: string
  reasonForLeaving: string
}

type ApplicantReference = {
  referenceId: string
  applicantId: string
  referenceName: string
  referenceTitle: string
  referenceCompany: string
  referencePhone: string
  referenceEmail: string
}

type CandidateRecord = {
  applicant: Applicant
  jobApplication: JobApplication
  education: Education[]
  employmentHistory: EmploymentHistory[]
  references: ApplicantReference[]
  submittedAt: string
}

const steps = ['Contact Info', 'Education', 'Experience', 'Compliance & Submission']

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const createEmptyApplicant = (): Applicant => ({
  applicantId: createId(),
  applicantName: '',
  homeAddress: '',
  phoneNumber: '',
  emailAddress: '',
  linkedInUrl: '',
  citizenshipStatus: '',
  hasCriminalHistory: null,
  agreesToDrugTest: null,
})

const createEmptyApplication = (applicantId: string): JobApplication => ({
  JobApplicationId: createId(),
  applicantId,
  appliedPosition: '',
  JobApplicationDate: new Date().toISOString().slice(0, 10),
  JobApplicationStatus: 'Pending',
  availableStartDate: '',
  expectedSalary: '',
  resumeFileUrl: '',
})

const createEducation = (applicantId: string): Education => ({
  educationId: createId(),
  applicantId,
  schoolName: '',
  schoolLocation: '',
  yearsAttended: '',
  degreeReceived: '',
  programName: '',
})

const createEmployment = (applicantId: string): EmploymentHistory => ({
  EmploymentHistoryId: createId(),
  applicantId,
  companyName: '',
  workAddress: '',
  workPosition: '',
  reasonForLeaving: '',
})

const createReference = (applicantId: string): ApplicantReference => ({
  referenceId: createId(),
  applicantId,
  referenceName: '',
  referenceTitle: '',
  referenceCompany: '',
  referencePhone: '',
  referenceEmail: '',
})

const starterApplicant = createEmptyApplicant()

function App() {
  const [portalView, setPortalView] = useState<PortalView>('applicant')
  const [currentStep, setCurrentStep] = useState(0)

  const [applicant, setApplicant] = useState<Applicant>(starterApplicant)
  const [jobApplication, setJobApplication] = useState<JobApplication>(
    createEmptyApplication(starterApplicant.applicantId),
  )
  const [education, setEducation] = useState<Education[]>([
    createEducation(starterApplicant.applicantId),
  ])
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([
    createEmployment(starterApplicant.applicantId),
  ])
  const [references, setReferences] = useState<ApplicantReference[]>([
    createReference(starterApplicant.applicantId),
  ])

  const [submissions, setSubmissions] = useState<CandidateRecord[]>([])
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const [stepError, setStepError] = useState('')
  const [uploadState, setUploadState] = useState({ uploading: false, message: '' })
  const [successMessage, setSuccessMessage] = useState('')

  const selectedSubmission = useMemo(
    () => submissions.find((item) => item.jobApplication.JobApplicationId === selectedSubmissionId),
    [selectedSubmissionId, submissions],
  )

  const visibleSubmissions = useMemo(() => {
    if (statusFilter === 'All') {
      return submissions
    }
    return submissions.filter((item) => item.jobApplication.JobApplicationStatus === statusFilter)
  }, [statusFilter, submissions])

  const linkApplicantId = (newApplicantId: string) => {
    setEducation((prev) => prev.map((item) => ({ ...item, applicantId: newApplicantId })))
    setEmploymentHistory((prev) => prev.map((item) => ({ ...item, applicantId: newApplicantId })))
    setReferences((prev) => prev.map((item) => ({ ...item, applicantId: newApplicantId })))
  }

  const resetForm = () => {
    const nextApplicant = createEmptyApplicant()
    setApplicant(nextApplicant)
    setJobApplication(createEmptyApplication(nextApplicant.applicantId))
    setEducation([createEducation(nextApplicant.applicantId)])
    setEmploymentHistory([createEmployment(nextApplicant.applicantId)])
    setReferences([createReference(nextApplicant.applicantId)])
    setCurrentStep(0)
    setStepError('')
    setUploadState({ uploading: false, message: '' })
  }

  const updateApplicant = <K extends keyof Applicant>(key: K, value: Applicant[K]) => {
    setApplicant((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'applicantId') {
        linkApplicantId(String(value))
      }
      return next
    })
  }

  const updateApplication = <K extends keyof JobApplication>(
    key: K,
    value: JobApplication[K],
  ) => {
    setJobApplication((prev) => ({ ...prev, [key]: value }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setEducation((prev) =>
      prev.map((item, current) => (current === index ? { ...item, [field]: value } : item)),
    )
  }

  const updateEmployment = (index: number, field: keyof EmploymentHistory, value: string) => {
    setEmploymentHistory((prev) =>
      prev.map((item, current) => (current === index ? { ...item, [field]: value } : item)),
    )
  }

  const updateReference = (index: number, field: keyof ApplicantReference, value: string) => {
    setReferences((prev) =>
      prev.map((item, current) => (current === index ? { ...item, [field]: value } : item)),
    )
  }

  const addEducation = () => {
    setEducation((prev) => [...prev, createEducation(applicant.applicantId)])
  }

  const addEmployment = () => {
    setEmploymentHistory((prev) => [...prev, createEmployment(applicant.applicantId)])
  }

  const addReference = () => {
    setReferences((prev) => [...prev, createReference(applicant.applicantId)])
  }

  const removeEducation = (index: number) => {
    setEducation((prev) => (prev.length > 1 ? prev.filter((_, current) => current !== index) : prev))
  }

  const removeEmployment = (index: number) => {
    setEmploymentHistory((prev) =>
      prev.length > 1 ? prev.filter((_, current) => current !== index) : prev,
    )
  }

  const removeReference = (index: number) => {
    setReferences((prev) => (prev.length > 1 ? prev.filter((_, current) => current !== index) : prev))
  }

  const validateStep = (step: number): string => {
    if (step === 0) {
      if (
        !applicant.applicantName.trim() ||
        !applicant.homeAddress.trim() ||
        !applicant.phoneNumber.trim() ||
        !applicant.emailAddress.trim() ||
        !applicant.citizenshipStatus.trim() ||
        !jobApplication.appliedPosition.trim()
      ) {
        return 'Please complete all required contact fields before moving to the next step.'
      }
    }

    if (step === 1) {
      const hasInvalid = education.some(
        (item) =>
          !item.schoolName.trim() ||
          !item.schoolLocation.trim() ||
          !item.yearsAttended.trim() ||
          !item.degreeReceived.trim(),
      )
      if (hasInvalid) {
        return 'Please complete each education block (school, location, years, and degree).'
      }
    }

    if (step === 2) {
      const invalidEmployment = employmentHistory.some(
        (item) =>
          !item.companyName.trim() ||
          !item.workAddress.trim() ||
          !item.workPosition.trim() ||
          !item.reasonForLeaving.trim(),
      )
      const invalidReference = references.some(
        (item) =>
          !item.referenceName.trim() ||
          !item.referenceTitle.trim() ||
          !item.referenceCompany.trim() ||
          !item.referencePhone.trim(),
      )
      if (invalidEmployment || invalidReference) {
        return 'Please complete all employment and reference blocks before continuing.'
      }
    }

    if (step === 3) {
      if (applicant.hasCriminalHistory === null || applicant.agreesToDrugTest === null) {
        return 'Please answer all compliance questions before submitting.'
      }
      if (!jobApplication.resumeFileUrl.trim()) {
        return 'Please upload your resume PDF before submitting the application.'
      }
    }

    return ''
  }

  const goToNext = () => {
    const validationError = validateStep(currentStep)
    if (validationError) {
      setStepError(validationError)
      return
    }

    setStepError('')
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const goToPrevious = () => {
    setStepError('')
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const updateRecruiterStatus = (
    applicationId: string,
    status: JobApplication['JobApplicationStatus'],
  ) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.jobApplication.JobApplicationId === applicationId
          ? {
              ...item,
              jobApplication: {
                ...item.jobApplication,
                JobApplicationStatus: status,
              },
            }
          : item,
      ),
    )
  }

  const handleResumeUpload = async (file: File | null) => {
    if (!file) {
      return
    }

    if (file.type !== 'application/pdf') {
      setUploadState({ uploading: false, message: 'Please select a PDF file.' })
      return
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      setUploadState({
        uploading: false,
        message:
          'Cloud upload is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.',
      })
      return
    }

    setUploadState({ uploading: true, message: 'Uploading resume...' })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', 'applyr/resumes')

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const payload = (await response.json()) as { secure_url?: string }

      if (!payload.secure_url) {
        throw new Error('Missing uploaded file URL')
      }

      updateApplication('resumeFileUrl', payload.secure_url)
      setUploadState({ uploading: false, message: 'Resume uploaded successfully.' })
    } catch {
      setUploadState({
        uploading: false,
        message: 'Upload could not be completed. Please verify your Cloudinary configuration.',
      })
    }
  }

  const submitApplication = () => {
    const validationError = validateStep(3)
    if (validationError) {
      setStepError(validationError)
      return
    }

    const record: CandidateRecord = {
      applicant,
      jobApplication: {
        ...jobApplication,
        applicantId: applicant.applicantId,
        JobApplicationDate: jobApplication.JobApplicationDate || new Date().toISOString().slice(0, 10),
      },
      education,
      employmentHistory,
      references,
      submittedAt: new Date().toISOString(),
    }

    setSubmissions((prev) => [record, ...prev])
    setSelectedSubmissionId(record.jobApplication.JobApplicationId)
    setPortalView('recruiter')
    setSuccessMessage('Application submitted successfully. Recruiter dashboard updated.')
    resetForm()
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="kicker">Front-End Challenge</p>
          <h1>Multi-Step Candidate Portal</h1>
        </div>
        <div className="role-switch" role="tablist" aria-label="Choose portal view">
          <button
            type="button"
            className={portalView === 'applicant' ? 'active' : ''}
            onClick={() => {
              setPortalView('applicant')
              setSuccessMessage('')
            }}
          >
            Applicant Side
          </button>
          <button
            type="button"
            className={portalView === 'recruiter' ? 'active' : ''}
            onClick={() => setPortalView('recruiter')}
          >
            Recruiter Side
          </button>
        </div>
      </header>

      {successMessage ? <p className="success-banner">{successMessage}</p> : null}

      {portalView === 'applicant' ? (
        <section className="panel">
          <div className="stepper" aria-label="Application steps">
            {steps.map((step, index) => (
              <button
                key={step}
                type="button"
                className={index === currentStep ? 'step active' : 'step'}
                onClick={() => {
                  const validationError = validateStep(Math.min(currentStep, index))
                  if (!validationError || index <= currentStep) {
                    setStepError('')
                    setCurrentStep(index)
                  }
                }}
              >
                <span>{index + 1}</span>
                {step}
              </button>
            ))}
          </div>

          <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
            {currentStep === 0 ? (
              <>
                <h2>Contact Info</h2>
                <label>
                  Full Name*
                  <input
                    value={applicant.applicantName}
                    onChange={(event) => updateApplicant('applicantName', event.target.value)}
                    placeholder="Jane Example"
                  />
                </label>
                <label>
                  Home Address*
                  <input
                    value={applicant.homeAddress}
                    onChange={(event) => updateApplicant('homeAddress', event.target.value)}
                    placeholder="123 Main St, City, ST"
                  />
                </label>
                <label>
                  Phone Number*
                  <input
                    value={applicant.phoneNumber}
                    onChange={(event) => updateApplicant('phoneNumber', event.target.value)}
                    placeholder="555-0134"
                  />
                </label>
                <label>
                  Email Address*
                  <input
                    type="email"
                    value={applicant.emailAddress}
                    onChange={(event) => updateApplicant('emailAddress', event.target.value)}
                    placeholder="jane@example.com"
                  />
                </label>
                <label>
                  LinkedIn URL
                  <input
                    value={applicant.linkedInUrl}
                    onChange={(event) => updateApplicant('linkedInUrl', event.target.value)}
                    placeholder="https://linkedin.com/in/jane"
                  />
                </label>
                <label>
                  Citizenship Status*
                  <select
                    value={applicant.citizenshipStatus}
                    onChange={(event) => updateApplicant('citizenshipStatus', event.target.value)}
                  >
                    <option value="">Choose status</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Permanent Resident">Permanent Resident</option>
                    <option value="Visa Holder">Visa Holder</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Applied Position*
                  <input
                    value={jobApplication.appliedPosition}
                    onChange={(event) => updateApplication('appliedPosition', event.target.value)}
                    placeholder="Frontend Engineer"
                  />
                </label>
                <label>
                  Available Start Date
                  <input
                    type="date"
                    value={jobApplication.availableStartDate}
                    onChange={(event) => updateApplication('availableStartDate', event.target.value)}
                  />
                </label>
                <label>
                  Expected Salary
                  <input
                    type="number"
                    value={jobApplication.expectedSalary}
                    onChange={(event) => updateApplication('expectedSalary', event.target.value)}
                    placeholder="85000"
                  />
                </label>
              </>
            ) : null}

            {currentStep === 1 ? (
              <>
                <h2>Education</h2>
                {education.map((entry, index) => (
                  <article className="repeat-block" key={entry.educationId}>
                    <div className="repeat-header">
                      <h3>School {index + 1}</h3>
                      <button type="button" onClick={() => removeEducation(index)}>
                        Remove
                      </button>
                    </div>
                    <label>
                      School Name*
                      <input
                        value={entry.schoolName}
                        onChange={(event) => updateEducation(index, 'schoolName', event.target.value)}
                      />
                    </label>
                    <label>
                      School Location*
                      <input
                        value={entry.schoolLocation}
                        onChange={(event) => updateEducation(index, 'schoolLocation', event.target.value)}
                      />
                    </label>
                    <label>
                      Years Attended*
                      <input
                        value={entry.yearsAttended}
                        onChange={(event) => updateEducation(index, 'yearsAttended', event.target.value)}
                        placeholder="2019 - 2023"
                      />
                    </label>
                    <label>
                      Degree Received*
                      <input
                        value={entry.degreeReceived}
                        onChange={(event) => updateEducation(index, 'degreeReceived', event.target.value)}
                      />
                    </label>
                    <label>
                      Program Name
                      <input
                        value={entry.programName}
                        onChange={(event) => updateEducation(index, 'programName', event.target.value)}
                      />
                    </label>
                  </article>
                ))}

                <button type="button" className="add-button" onClick={addEducation}>
                  + Add Education Entry
                </button>
              </>
            ) : null}

            {currentStep === 2 ? (
              <>
                <h2>Experience</h2>
                <p className="section-caption">Employment History</p>
                {employmentHistory.map((entry, index) => (
                  <article className="repeat-block" key={entry.EmploymentHistoryId}>
                    <div className="repeat-header">
                      <h3>Employment {index + 1}</h3>
                      <button type="button" onClick={() => removeEmployment(index)}>
                        Remove
                      </button>
                    </div>
                    <label>
                      Company Name*
                      <input
                        value={entry.companyName}
                        onChange={(event) => updateEmployment(index, 'companyName', event.target.value)}
                      />
                    </label>
                    <label>
                      Work Address*
                      <input
                        value={entry.workAddress}
                        onChange={(event) => updateEmployment(index, 'workAddress', event.target.value)}
                      />
                    </label>
                    <label>
                      Work Position*
                      <input
                        value={entry.workPosition}
                        onChange={(event) => updateEmployment(index, 'workPosition', event.target.value)}
                      />
                    </label>
                    <label>
                      Reason For Leaving*
                      <input
                        value={entry.reasonForLeaving}
                        onChange={(event) =>
                          updateEmployment(index, 'reasonForLeaving', event.target.value)
                        }
                      />
                    </label>
                  </article>
                ))}

                <button type="button" className="add-button" onClick={addEmployment}>
                  + Add Employment Block
                </button>

                <p className="section-caption">References</p>
                {references.map((entry, index) => (
                  <article className="repeat-block" key={entry.referenceId}>
                    <div className="repeat-header">
                      <h3>Reference {index + 1}</h3>
                      <button type="button" onClick={() => removeReference(index)}>
                        Remove
                      </button>
                    </div>
                    <label>
                      Name*
                      <input
                        value={entry.referenceName}
                        onChange={(event) => updateReference(index, 'referenceName', event.target.value)}
                      />
                    </label>
                    <label>
                      Title*
                      <input
                        value={entry.referenceTitle}
                        onChange={(event) => updateReference(index, 'referenceTitle', event.target.value)}
                      />
                    </label>
                    <label>
                      Company*
                      <input
                        value={entry.referenceCompany}
                        onChange={(event) => updateReference(index, 'referenceCompany', event.target.value)}
                      />
                    </label>
                    <label>
                      Phone*
                      <input
                        value={entry.referencePhone}
                        onChange={(event) => updateReference(index, 'referencePhone', event.target.value)}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={entry.referenceEmail}
                        onChange={(event) => updateReference(index, 'referenceEmail', event.target.value)}
                      />
                    </label>
                  </article>
                ))}

                <button type="button" className="add-button" onClick={addReference}>
                  + Add Reference Block
                </button>
              </>
            ) : null}

            {currentStep === 3 ? (
              <>
                <h2>Compliance & Submission</h2>
                <label>
                  Have you ever had a criminal conviction?*
                  <select
                    value={
                      applicant.hasCriminalHistory === null
                        ? ''
                        : applicant.hasCriminalHistory
                          ? 'yes'
                          : 'no'
                    }
                    onChange={(event) =>
                      updateApplicant(
                        'hasCriminalHistory',
                        event.target.value === '' ? null : event.target.value === 'yes',
                      )
                    }
                  >
                    <option value="">Choose</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>

                <label>
                  Do you agree to a drug test?*
                  <select
                    value={
                      applicant.agreesToDrugTest === null
                        ? ''
                        : applicant.agreesToDrugTest
                          ? 'yes'
                          : 'no'
                    }
                    onChange={(event) =>
                      updateApplicant(
                        'agreesToDrugTest',
                        event.target.value === '' ? null : event.target.value === 'yes',
                      )
                    }
                  >
                    <option value="">Choose</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>

                <label>
                  Upload Resume (PDF)*
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null
                      void handleResumeUpload(file)
                    }}
                  />
                </label>

                {uploadState.message ? (
                  <p className={uploadState.uploading ? 'upload-note' : 'upload-note done'}>
                    {uploadState.message}
                  </p>
                ) : null}

                {jobApplication.resumeFileUrl ? (
                  <p className="upload-link">
                    Resume URL: <a href={jobApplication.resumeFileUrl}>{jobApplication.resumeFileUrl}</a>
                  </p>
                ) : null}
              </>
            ) : null}

            {stepError ? <p className="error-banner">{stepError}</p> : null}

            <div className="form-actions">
              <button type="button" onClick={goToPrevious} disabled={currentStep === 0}>
                Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button type="button" className="primary" onClick={goToNext}>
                  Continue
                </button>
              ) : (
                <button type="button" className="primary" onClick={submitApplication}>
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </section>
      ) : (
        <section className="panel recruiter-layout">
          <div className="recruiter-list">
            <div className="list-header">
              <h2>Candidate Queue</h2>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Accepted">Accepted</option>
              </select>
            </div>

            {visibleSubmissions.length === 0 ? (
              <article className="empty-state">
                <h3>No applications yet</h3>
                <p>Switch to Applicant Side to submit a candidate and populate this dashboard.</p>
              </article>
            ) : (
              visibleSubmissions.map((item) => (
                <article
                  key={item.jobApplication.JobApplicationId}
                  className={
                    selectedSubmissionId === item.jobApplication.JobApplicationId
                      ? 'candidate-card active'
                      : 'candidate-card'
                  }
                >
                  <button
                    type="button"
                    onClick={() => setSelectedSubmissionId(item.jobApplication.JobApplicationId)}
                  >
                    <h3>{item.applicant.applicantName}</h3>
                    <p>{item.jobApplication.appliedPosition}</p>
                    <p>
                      Applied on {new Date(item.jobApplication.JobApplicationDate).toLocaleDateString()}
                    </p>
                  </button>
                </article>
              ))
            )}
          </div>

          <div className="recruiter-detail">
            {!selectedSubmission ? (
              <article className="empty-state">
                <h3>Select a candidate</h3>
                <p>Choose an applicant from the queue to review full details.</p>
              </article>
            ) : (
              <>
                <div className="detail-top">
                  <div>
                    <p className="kicker">Applicant</p>
                    <h2>{selectedSubmission.applicant.applicantName}</h2>
                    <p>{selectedSubmission.jobApplication.appliedPosition}</p>
                  </div>
                  <label>
                    Status
                    <select
                      value={selectedSubmission.jobApplication.JobApplicationStatus}
                      onChange={(event) =>
                        updateRecruiterStatus(
                          selectedSubmission.jobApplication.JobApplicationId,
                          event.target.value as JobApplication['JobApplicationStatus'],
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Interview">Interview</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Accepted">Accepted</option>
                    </select>
                  </label>
                </div>

                <div className="detail-grid">
                  <article>
                    <h3>Contact</h3>
                    <p>{selectedSubmission.applicant.emailAddress}</p>
                    <p>{selectedSubmission.applicant.phoneNumber}</p>
                    <p>{selectedSubmission.applicant.homeAddress}</p>
                  </article>

                  <article>
                    <h3>Application</h3>
                    <p>Start date: {selectedSubmission.jobApplication.availableStartDate || 'Not provided'}</p>
                    <p>Salary: {selectedSubmission.jobApplication.expectedSalary || 'Not provided'}</p>
                    <p>
                      Resume: {' '}
                      <a href={selectedSubmission.jobApplication.resumeFileUrl}>Open uploaded PDF</a>
                    </p>
                  </article>

                  <article>
                    <h3>Compliance</h3>
                    <p>
                      Criminal history:{' '}
                      {selectedSubmission.applicant.hasCriminalHistory ? 'Yes' : 'No'}
                    </p>
                    <p>
                      Drug test agreement:{' '}
                      {selectedSubmission.applicant.agreesToDrugTest ? 'Yes' : 'No'}
                    </p>
                    <p>Citizenship: {selectedSubmission.applicant.citizenshipStatus}</p>
                  </article>
                </div>

                <div className="detail-grid">
                  <article>
                    <h3>Education ({selectedSubmission.education.length})</h3>
                    {selectedSubmission.education.map((item) => (
                      <p key={item.educationId}>
                        {item.degreeReceived} - {item.schoolName}, {item.schoolLocation} ({item.yearsAttended})
                      </p>
                    ))}
                  </article>

                  <article>
                    <h3>Employment ({selectedSubmission.employmentHistory.length})</h3>
                    {selectedSubmission.employmentHistory.map((item) => (
                      <p key={item.EmploymentHistoryId}>
                        {item.workPosition} at {item.companyName}. Left because: {item.reasonForLeaving}
                      </p>
                    ))}
                  </article>

                  <article>
                    <h3>References ({selectedSubmission.references.length})</h3>
                    {selectedSubmission.references.map((item) => (
                      <p key={item.referenceId}>
                        {item.referenceName}, {item.referenceTitle} at {item.referenceCompany} ({item.referencePhone})
                      </p>
                    ))}
                  </article>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default App
