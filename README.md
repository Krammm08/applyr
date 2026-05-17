# Applyr Front-End Challenge

This project implements a complete multi-step candidate portal that maps directly to your SQL schema and includes both applicant and recruiter experiences.

## What Is Included

- Applicant side: 4-step wizard flow
  - Step 1: Contact Info + Job Application fields
  - Step 2: Education entries
  - Step 3: Employment History + References (dynamic add/remove blocks)
  - Step 4: Compliance questions + resume upload + submit
- Recruiter side: candidate queue, filtering by status, detail drill-down, and status updates.
- Cloud integration: direct PDF upload to Cloudinary and persisted file URL to `resumeFileUrl`.

## Schema Mapping

- `Applicant`: personal/contact/compliance fields
- `JobApplication`: position, dates, status, salary, resume URL
- `Education`: one-to-many from applicant
- `EmploymentHistory`: one-to-many from applicant
- `ApplicantReference`: one-to-many from applicant

Data is currently stored in front-end state to support challenge/demo use. You can connect the same object shape to your backend APIs later.

## Cloud Upload Setup (Cloudinary)

1. Create an unsigned upload preset in Cloudinary.
2. Add environment variables in a local `.env` file:

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

3. Start the app and upload a PDF on Step 4.

If env vars are missing, the UI shows a clear configuration warning instead of failing silently.

## Run Locally

1. Install dependencies:

npm install

2. Run dev server:

npm run dev

3. Build production bundle:

npm run build

## Suggested Next Back-End Step

Replace the in-memory submission array with API calls that write to your tables in this sequence:

1. `Applicant`
2. `JobApplication`
3. `School` + `Education`
4. `Company` + `EmploymentHistory`
5. `ApplicantReference`
