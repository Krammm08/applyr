import { useState } from 'react'
import type {
  Applicant,
  ApplicantReference,
  Education,
  EmploymentHistory,
  JobApplication,
} from '../types'

type UploadState = {
  uploading: boolean
  message: string
}

type ResumeAccordionProps = {
  applicant: Applicant
  jobApplication: JobApplication
  education: Education[]
  employmentHistory: EmploymentHistory[]
  references: ApplicantReference[]
  uploadState: UploadState
  previewFont: string
  onPreviewFontChange: (fontFamily: string) => void
  updateApplicant: <K extends keyof Applicant>(key: K, value: Applicant[K]) => void
  updateApplication: <K extends keyof JobApplication>(key: K, value: JobApplication[K]) => void
  updateEducation: (index: number, field: keyof Education, value: string) => void
  updateEmployment: (index: number, field: keyof EmploymentHistory, value: string) => void
  updateReference: (index: number, field: keyof ApplicantReference, value: string) => void
  addEducation: () => void
  removeEducation: (index: number) => void
  reorderEducation: (fromIndex: number, toIndex: number) => void
  addEmployment: () => void
  removeEmployment: (index: number) => void
  reorderEmployment: (fromIndex: number, toIndex: number) => void
  addReference: () => void
  removeReference: (index: number) => void
  reorderReferences: (fromIndex: number, toIndex: number) => void
  handleResumeUpload: (file: File | null) => Promise<void>
}

const ResumeAccordion = ({
  applicant,
  jobApplication,
  education,
  employmentHistory,
  references,
  uploadState,
  previewFont,
  onPreviewFontChange,
  updateApplicant,
  updateApplication,
  updateEducation,
  updateEmployment,
  updateReference,
  addEducation,
  removeEducation,
  reorderEducation,
  addEmployment,
  removeEmployment,
  reorderEmployment,
  addReference,
  removeReference,
  reorderReferences,
  handleResumeUpload,
}: ResumeAccordionProps) => {
  const [openSection, setOpenSection] = useState('contact')
  const [dragEducationIndex, setDragEducationIndex] = useState<number | null>(null)
  const [dragEmploymentIndex, setDragEmploymentIndex] = useState<number | null>(null)
  const [dragReferenceIndex, setDragReferenceIndex] = useState<number | null>(null)

  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? '' : sectionId))
  }

  const handleDragStart = (
    setter: (value: number | null) => void,
    index: number,
    event: React.DragEvent<HTMLButtonElement>,
  ) => {
    setter(index)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = (setter: (value: number | null) => void) => {
    setter(null)
  }

  const handleDrop = (
    fromIndex: number | null,
    toIndex: number,
    reorder: (from: number, to: number) => void,
    setter: (value: number | null) => void,
  ) => {
    if (fromIndex === null || fromIndex === toIndex) {
      return
    }
    reorder(fromIndex, toIndex)
    setter(null)
  }

  return (
    <div className="accordion" aria-label="Resume input sections">

      <article className="accordion-item">
        <button
          type="button"
          className="accordion-trigger"
          aria-expanded={openSection === 'template'}
          aria-controls="section-template"
          onClick={() => toggleSection('template')}
        >
          <span>Resume Template</span>
          <span className="accordion-icon" aria-hidden="true">
            {openSection === 'template' ? '-' : '+'}
          </span>
        </button>
        <div
          className={`accordion-panel${openSection === 'template' ? ' is-open' : ''}`}
          id="section-template"
          aria-hidden={openSection !== 'template'}
        >
          <div className="form-grid">
            <label>
              Resume Font
              <select
                value={previewFont}
                onChange={(event) => onPreviewFontChange(event.target.value)}
              >
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Garamond">Garamond</option>
                <option value="Arial">Arial</option>
                <option value="Calibri">Calibri</option>
              </select>
            </label>
          </div>
        </div>
      </article>

      <article className="accordion-item">
        <button
          type="button"
          className="accordion-trigger"
          aria-expanded={openSection === 'contact'}
          aria-controls="section-contact"
          onClick={() => toggleSection('contact')}
        >
          <span>Contact Info</span>
          <span className="accordion-icon" aria-hidden="true">
            {openSection === 'contact' ? '-' : '+'}
          </span>
        </button>
        <div
          className={`accordion-panel${openSection === 'contact' ? ' is-open' : ''}`}
          id="section-contact"
          aria-hidden={openSection !== 'contact'}
        >
          <div className="form-grid">
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
          </div>
        </div>
      </article>

      <article className="accordion-item">
        <button
          type="button"
          className="accordion-trigger"
          aria-expanded={openSection === 'education'}
          aria-controls="section-education"
          onClick={() => toggleSection('education')}
        >
          <span>Education</span>
          <span className="accordion-icon" aria-hidden="true">
            {openSection === 'education' ? '-' : '+'}
          </span>
        </button>
        <div
          className={`accordion-panel${openSection === 'education' ? ' is-open' : ''}`}
          id="section-education"
          aria-hidden={openSection !== 'education'}
        >
          <div className="form-grid">
              {education.map((entry, index) => (
                <article
                  className={`repeat-block${dragEducationIndex === index ? ' is-dragging' : ''}`}
                  key={entry.educationId}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() =>
                    handleDrop(dragEducationIndex, index, reorderEducation, setDragEducationIndex)
                  }
                >
                  <button
                    type="button"
                    className="repeat-handle"
                    aria-label={`Reorder education ${index + 1}`}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(setDragEducationIndex, index, event)
                    }
                    onDragEnd={() => handleDragEnd(setDragEducationIndex)}
                  >
                    ::
                  </button>
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
          </div>
          <button type="button" className="add-button" onClick={addEducation}>
            + Add Education Entry
          </button>
        </div>
      </article>

      <article className="accordion-item">
        <button
          type="button"
          className="accordion-trigger"
          aria-expanded={openSection === 'experience'}
          aria-controls="section-experience"
          onClick={() => toggleSection('experience')}
        >
          <span>Experience</span>
          <span className="accordion-icon" aria-hidden="true">
            {openSection === 'experience' ? '-' : '+'}
          </span>
        </button>
        <div
          className={`accordion-panel${openSection === 'experience' ? ' is-open' : ''}`}
          id="section-experience"
          aria-hidden={openSection !== 'experience'}
        >
          <p className="section-caption">Employment History</p>
          <div className="form-grid">
              {employmentHistory.map((entry, index) => (
                <article
                  className={`repeat-block${dragEmploymentIndex === index ? ' is-dragging' : ''}`}
                  key={entry.EmploymentHistoryId}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() =>
                    handleDrop(dragEmploymentIndex, index, reorderEmployment, setDragEmploymentIndex)
                  }
                >
                  <button
                    type="button"
                    className="repeat-handle"
                    aria-label={`Reorder employment ${index + 1}`}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(setDragEmploymentIndex, index, event)
                    }
                    onDragEnd={() => handleDragEnd(setDragEmploymentIndex)}
                  >
                    ::
                  </button>
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
                      onChange={(event) => updateEmployment(index, 'reasonForLeaving', event.target.value)}
                    />
                  </label>
                </article>
              ))}
          </div>
          <button type="button" className="add-button" onClick={addEmployment}>
            + Add Employment Block
          </button>

          <p className="section-caption">References</p>
          <div className="form-grid">
              {references.map((entry, index) => (
                <article
                  className={`repeat-block${dragReferenceIndex === index ? ' is-dragging' : ''}`}
                  key={entry.referenceId}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() =>
                    handleDrop(dragReferenceIndex, index, reorderReferences, setDragReferenceIndex)
                  }
                >
                  <button
                    type="button"
                    className="repeat-handle"
                    aria-label={`Reorder reference ${index + 1}`}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(setDragReferenceIndex, index, event)
                    }
                    onDragEnd={() => handleDragEnd(setDragReferenceIndex)}
                  >
                    ::
                  </button>
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
          </div>
          <button type="button" className="add-button" onClick={addReference}>
            + Add Reference Block
          </button>
        </div>
      </article>

      <article className="accordion-item">
        <button
          type="button"
          className="accordion-trigger"
          aria-expanded={openSection === 'compliance'}
          aria-controls="section-compliance"
          onClick={() => toggleSection('compliance')}
        >
          <span>Compliance & Upload</span>
          <span className="accordion-icon" aria-hidden="true">
            {openSection === 'compliance' ? '-' : '+'}
          </span>
        </button>
        <div
          className={`accordion-panel${openSection === 'compliance' ? ' is-open' : ''}`}
          id="section-compliance"
          aria-hidden={openSection !== 'compliance'}
        >
          <div className="form-grid">
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
          </div>

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
        </div>
      </article>
    </div>
  )
}

export default ResumeAccordion
