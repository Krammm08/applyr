import React from 'react'
import type { ValidationError } from '../utils/validation'

interface ValidationErrorDisplayProps {
  errors: ValidationError[]
  fieldPath: string
}

/**
 * Displays validation errors for a specific field
 */
export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  fieldPath,
}) => {
  const fieldErrors = errors.filter(
    (err) => err.field === fieldPath || err.field.startsWith(fieldPath + '.')
  )

  if (fieldErrors.length === 0) {
    return null
  }

  return (
    <div className="validation-error-container" style={{ marginTop: '4px' }}>
      {fieldErrors.map((err, idx) => (
        <div
          key={idx}
          className="validation-error-message"
          style={{
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: idx < fieldErrors.length - 1 ? '4px' : 0,
          }}
        >
          ⚠️ {err.message}
        </div>
      ))}
    </div>
  )
}

interface ValidationErrorsSummaryProps {
  errors: ValidationError[]
  title?: string
}

/**
 * Displays a summary of all validation errors
 */
export const ValidationErrorsSummary: React.FC<ValidationErrorsSummaryProps> = ({
  errors,
  title = 'Validation Errors',
}) => {
  if (errors.length === 0) {
    return null
  }

  // Group errors by category
  const grouped: Record<string, ValidationError[]> = {}
  errors.forEach((err) => {
    const category = err.path[0]?.toString() || 'unknown'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(err)
  })

  return (
    <div className="validation-summary" style={{
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      padding: '12px 16px',
      marginBottom: '16px',
    }}>
      <h4 style={{ color: '#7f1d1d', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
        {title} ({errors.length})
      </h4>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {Object.entries(grouped).map(([category, categoryErrors]) => (
          <li key={category} style={{ color: '#991b1b', marginBottom: '4px' }}>
            <strong>{category}</strong>: {categoryErrors.map((e) => e.message).join('; ')}
          </li>
        ))}
      </ul>
    </div>
  )
}
