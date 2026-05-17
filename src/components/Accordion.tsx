import { useState } from 'react'

const Accordion: React.FC<{
  title: string
  subtitle?: string
  children: React.ReactNode
}> = ({ title, subtitle, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <article className="accordion-item">
        <button
          type="button"
          className="accordion-trigger"
          aria-controls="section-template"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>{title}</span>
          <span className="accordion-icon" aria-hidden="true">
            {isOpen ? '-' : '+'}
          </span>
        </button>
        <div
          className={`accordion-panel${isOpen ? ' is-open' : ''}`}
          id="section-template"
          aria-hidden={!isOpen}
        >
          {children}
        </div>
      </article>
  )
}

const SectionRow: React.FC<{
  title: string
  subtitle?: string
  callback: () => void
}> = ({ title, subtitle, callback }) => {

  return (
  <button
          type="button"
          className="section-button simple"
          onClick={() => callback()}
        >
          <div className="section-button-content">
          <span className="row-title">{title}</span>
          <span className="row-subtitle">{subtitle}</span>
          </div>
          <span className="accordion-icon" aria-hidden="true">
            &gt;
          </span>
        </button>
  )
}

export { Accordion, SectionRow }