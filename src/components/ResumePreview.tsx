import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type {
  Applicant,
  ApplicantReference,
  Education,
  EmploymentHistory,
  JobApplication,
} from '../types'

type ResumePreviewProps = {
  applicant: Applicant
  jobApplication: JobApplication
  education: Education[]
  employmentHistory: EmploymentHistory[]
  references: ApplicantReference[]
  previewFont: string
}

const getDisplayValue = (value: string, fallback = 'Not provided') =>
  value.trim() ? value : fallback

const getYesNo = (value: boolean | null) => {
  if (value === null) {
    return 'Not provided'
  }
  return value ? 'Yes' : 'No'
}

type SectionBlock = {
  title: string
  lines: string[]
  isEmpty: boolean
}

type PageBlock = {
  showHeader: boolean
  sections: SectionBlock[]
}

const MAX_LINES_PER_PAGE = 46
const HEADER_LINES = 6

const chunkSectionsIntoPages = (
  sections: SectionBlock[],
): PageBlock[] => {
  const pages: PageBlock[] = []
  let current: PageBlock = { showHeader: true, sections: [] }
  let remaining = MAX_LINES_PER_PAGE - HEADER_LINES

  const pushPage = () => {
    pages.push(current)
    current = { showHeader: false, sections: [] }
    remaining = MAX_LINES_PER_PAGE
  }

  sections.forEach((section) => {
    const lines = section.lines.length ? section.lines : ['Not provided']
    const sectionIsEmpty = section.lines.length === 0
    let start = 0

    while (start < lines.length) {
      if (remaining < 2) {
        pushPage()
      }

      const availableLines = Math.max(remaining - 1, 1)
      const chunk = lines.slice(start, start + availableLines)
      const titleSuffix = start === 0 ? '' : ' (cont.)'

      current.sections.push({
        title: `${section.title}${titleSuffix}`,
        lines: chunk,
        isEmpty: sectionIsEmpty,
      })

      remaining -= 1 + chunk.length
      start += chunk.length

      if (start < lines.length) {
        pushPage()
      }
    }
  })

  pages.push(current)
  return pages
}

const ResumePreview = ({
  applicant,
  jobApplication,
  education,
  employmentHistory,
  references,
  previewFont,
}: ResumePreviewProps) => {
  const resumeLink = jobApplication.resumeFileUrl
  const pageStyle = {
    ['--resume-font' as const]: previewFont,
  } as CSSProperties
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const target = containerRef.current
    if (!target) {
      return
    }

    const updateScale = () => {
      const available = target.clientWidth - 16
      const pageWidth = pageRef.current?.offsetWidth ?? available
      const nextScale = pageWidth > 0 ? Math.min(1, available / pageWidth) : 1
      setScale(Number.isFinite(nextScale) ? nextScale : 1)
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  const sections: SectionBlock[] = [
    {
      title: 'Application Details',
      lines: [
        `Start date: ${getDisplayValue(jobApplication.availableStartDate)}`,
        `Expected salary: ${getDisplayValue(jobApplication.expectedSalary)}`,
        `Citizenship: ${getDisplayValue(applicant.citizenshipStatus)}`,
        resumeLink ? `Resume: ${resumeLink}` : 'Resume: Not uploaded yet.',
      ],
      isEmpty: false,
    },
    {
      title: 'Education',
      lines:
        education.length === 0
          ? []
          : education.map(
              (item) =>
                `${getDisplayValue(item.degreeReceived, 'Degree')} - ${getDisplayValue(
                  item.schoolName,
                  'School',
                )}, ${getDisplayValue(item.schoolLocation, 'Location')} (${getDisplayValue(
                  item.yearsAttended,
                  'Years',
                )})`,
            ),
      isEmpty: education.length === 0,
    },
    {
      title: 'Employment',
      lines:
        employmentHistory.length === 0
          ? []
          : employmentHistory.map(
              (item) =>
                `${getDisplayValue(item.workPosition, 'Role')} at ${getDisplayValue(
                  item.companyName,
                  'Company',
                )} - ${getDisplayValue(item.workAddress, 'Location')}`,
            ),
      isEmpty: employmentHistory.length === 0,
    },
    {
      title: 'References',
      lines:
        references.length === 0
          ? []
          : references.map(
              (item) =>
                `${getDisplayValue(item.referenceName, 'Name')}, ${getDisplayValue(
                  item.referenceTitle,
                  'Title',
                )} at ${getDisplayValue(item.referenceCompany, 'Company')} (${getDisplayValue(
                  item.referencePhone,
                  'Phone',
                )})`,
            ),
      isEmpty: references.length === 0,
    },
    {
      title: 'Compliance',
      lines: [
        `Criminal history: ${getYesNo(applicant.hasCriminalHistory)}`,
        `Drug test agreement: ${getYesNo(applicant.agreesToDrugTest)}`,
      ],
      isEmpty: false,
    },
  ]

  const pages = chunkSectionsIntoPages(sections)

  return (
    <div
      className="preview-scroll"
      aria-label="Resume preview document"
      ref={containerRef}
    >
      <div
        className="preview-pages"
        style={{ transform: `scale(${scale})` }}
      >
        {pages.map((page, pageIndex) => (
          <article
            className="preview-page"
            style={pageStyle}
            key={`page-${pageIndex}`}
            ref={pageIndex === 0 ? pageRef : undefined}
          >
            <div className="preview">
              {page.showHeader ? (
                <div className="preview-header">
                  <div>
                    <p className="preview-kicker">Live Resume Preview</p>
                    <h2 className="preview-name">
                      {getDisplayValue(applicant.applicantName, 'Your Name')}
                    </h2>
                    <p className="preview-role">
                      {getDisplayValue(jobApplication.appliedPosition, 'Target Role')}
                    </p>
                  </div>
                  <div className="preview-meta">
                    <p>{getDisplayValue(applicant.emailAddress, 'email@example.com')}</p>
                    <p>{getDisplayValue(applicant.phoneNumber, '(555) 000-0000')}</p>
                    <p>{getDisplayValue(applicant.homeAddress, 'City, State')}</p>
                  </div>
                </div>
              ) : null}

              {page.sections.map((section, sectionIndex) => (
                <section className="preview-section" key={`section-${pageIndex}-${sectionIndex}`}>
                  <div className="preview-section-header">
                    <h3>{section.title}</h3>
                    <span className="preview-section-rule" />
                  </div>
                  {section.isEmpty ? (
                    <p className="preview-empty">No entries yet.</p>
                  ) : (
                    <ul className="preview-list">
                      {section.lines.map((line, lineIndex) => (
                        <li key={`line-${pageIndex}-${sectionIndex}-${lineIndex}`}>{line}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ResumePreview
