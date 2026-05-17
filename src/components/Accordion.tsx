import { useState } from 'react'

const Accordion: React.FC<{
  title: string
  subtitle?: string
  children: React.ReactNode
}> = ({ title, subtitle, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`}>
      <div
        className="accordion-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="accordion-title">{title}</span>
        {subtitle && <span className="accordion-subtitle">{subtitle}</span>}
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  )
}

export default Accordion