import { z, ZodError } from 'zod'
import type { ApplicationPayload } from '../validation/applicationSchema'

export type ValidationError = {
  field: string
  message: string
  path: (string | number)[]
}

export type ValidationResult = {
  success: boolean
  errors: ValidationError[]
  payload?: ApplicationPayload
}

/**
 * Validates a payload and returns detailed error information
 */
export const validateApplicationPayload = (
  payload: unknown,
  schema: z.ZodSchema
): ValidationResult => {
  try {
    const validated = schema.parse(payload)
    return {
      success: true,
      errors: [],
      payload: validated as ApplicationPayload,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const zodIssues = error.issues ?? []
      const errors: ValidationError[] = zodIssues.map((err) => {
        const path = err.path.filter(
          (segment): segment is string | number => typeof segment === 'string' || typeof segment === 'number'
        )

        return {
          field: path.join('.') || 'unknown',
          message: err.message,
          path,
        }
      })
      return {
        success: false,
        errors,
      }
    }
    return {
      success: false,
      errors: [
        {
          field: 'unknown',
          message: 'An unknown validation error occurred',
          path: [],
        },
      ],
    }
  }
}

/**
 * Groups validation errors by field path
 */
export const groupErrorsByField = (
  errors: ValidationError[]
): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {}
  errors.forEach((err) => {
    if (!grouped[err.field]) {
      grouped[err.field] = []
    }
    grouped[err.field].push(err.message)
  })
  return grouped
}

/**
 * Gets error messages for a specific field
 */
export const getFieldErrors = (
  errors: ValidationError[],
  fieldPath: string
): string[] => {
  return errors
    .filter((err) => err.field === fieldPath || err.field.startsWith(fieldPath + '.'))
    .map((err) => err.message)
}

/**
 * Checks if there are any errors for a specific field
 */
export const hasFieldError = (errors: ValidationError[], fieldPath: string): boolean => {
  return errors.some((err) => err.field === fieldPath || err.field.startsWith(fieldPath + '.'))
}
