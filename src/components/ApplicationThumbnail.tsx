import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import ResumePreview from './ResumePreview'
import type {
  Applicant,
  ApplicantReference,
  Education,
  EmploymentHistory,
  JobApplication,
} from '../types'

type ApplicationThumbnailProps = {
  applicant: Applicant
  jobApplication: JobApplication
  education: Education[]
  employmentHistory: EmploymentHistory[]
  references: ApplicantReference[]
  previewFont: string
  resumeTemplate: 'classic' | 'compact' | 'modern'
}

const ApplicationThumbnail = ({
  applicant,
  jobApplication,
  education,
  employmentHistory,
  references,
  previewFont,
  resumeTemplate,
}: ApplicationThumbnailProps) => {
  const captureRef = useRef<HTMLDivElement | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const cacheKey = useMemo(
    () =>
      `applyr:thumbnail:${jobApplication.JobApplicationId}:${jobApplication.lastUpdated}:${previewFont}:${resumeTemplate}`,
    [jobApplication.JobApplicationId, jobApplication.lastUpdated, previewFont, resumeTemplate],
  )

  useEffect(() => {
    const cached = window.localStorage.getItem(cacheKey)
    if (cached) {
      setThumbnailUrl(cached)
    } else {
      setThumbnailUrl(null)
    }
  }, [cacheKey])

  useEffect(() => {
    if (thumbnailUrl || !captureRef.current) {
      return
    }

    let canceled = false

    const capture = async () => {
      const canvas = await html2canvas(captureRef.current as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 0.6,
      })
      if (canceled) {
        return
      }
      const dataUrl = canvas.toDataURL('image/png')
      window.localStorage.setItem(cacheKey, dataUrl)
      setThumbnailUrl(dataUrl)
    }

    const timeout = window.setTimeout(capture, 200)
    return () => {
      canceled = true
      window.clearTimeout(timeout)
    }
  }, [thumbnailUrl, cacheKey])

  return (
    <div className="thumbnail-preview">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt="Resume preview" className="thumbnail-image" />
      ) : (
        <div className="thumbnail-capture" ref={captureRef}>
          <ResumePreview
            applicant={applicant}
            jobApplication={jobApplication}
            education={education}
            employmentHistory={employmentHistory}
            references={references}
            previewFont={previewFont}
            resumeTemplate={resumeTemplate}
          />
        </div>
      )}
    </div>
  )
}

export default ApplicationThumbnail
