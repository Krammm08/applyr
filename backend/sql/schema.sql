CREATE TABLE Applicant (
  applicantId VARCHAR(50) PRIMARY KEY NOT NULL,
  applicantName VARCHAR(80) NOT NULL,
  homeAddress VARCHAR(100) NOT NULL,
  phoneNumber VARCHAR(20) NOT NULL,
  emailAddress VARCHAR(255) UNIQUE NOT NULL,
  linkedInUrl VARCHAR(80),
  citizenshipStatus VARCHAR(20) NOT NULL,
  hasCriminalHistory BOOLEAN NOT NULL,
  passwordHash VARCHAR(255) NOT NULL
);

CREATE TABLE JobApplication (
  JobApplicationId VARCHAR(50) PRIMARY KEY NOT NULL,
  applicantId VARCHAR(50) NOT NULL,
  appliedPosition VARCHAR(60) NOT NULL,
  JobApplicationDate DATE NOT NULL,
  JobApplicationStatus VARCHAR(20) NOT NULL DEFAULT 'Pending',
  availableStartDate DATE NULL,
  expectedSalary DECIMAL(10,2) NULL,
  resumeFileUrl VARCHAR(255) NULL,
  agreesToDrugTest BOOLEAN NOT NULL DEFAULT 0,
  agreedToTerms BOOLEAN NOT NULL DEFAULT 1,
  dateAgreed DATE NOT NULL DEFAULT (CURRENT_DATE),
  lastUpdated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicantId) REFERENCES Applicant(applicantId)
);

CREATE TABLE Company (
  companyId VARCHAR(50) PRIMARY KEY NOT NULL,
  companyName VARCHAR(80) NOT NULL,
  companyAddress VARCHAR(100) NOT NULL,
  companyPhone VARCHAR(16) NOT NULL
);

CREATE TABLE School (
  schoolId VARCHAR(50) PRIMARY KEY NOT NULL,
  schoolName VARCHAR(80) NOT NULL,
  schoolLocation VARCHAR(100) NOT NULL
);

CREATE TABLE EmploymentHistory (
  EmploymentHistoryId VARCHAR(50) PRIMARY KEY NOT NULL,
  applicantId VARCHAR(50) NOT NULL,
  companyId VARCHAR(50) NOT NULL,
  workPosition VARCHAR(80) NOT NULL,
  reasonForLeaving VARCHAR(80),
  startDate DATE NULL,
  endDate DATE NULL,
  isEmployed BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (applicantId) REFERENCES Applicant(applicantId),
  FOREIGN KEY (companyId) REFERENCES Company(companyId)
);

CREATE TABLE Education (
  educationId VARCHAR(50) PRIMARY KEY NOT NULL,
  applicantId VARCHAR(50) NOT NULL,
  schoolId VARCHAR(50) NOT NULL,
  startYear YEAR NULL,
  endYear YEAR NULL,
  degreeReceived VARCHAR(30) NOT NULL,
  programName VARCHAR(30) NOT NULL,
  FOREIGN KEY (applicantId) REFERENCES Applicant(applicantId),
  FOREIGN KEY (schoolId) REFERENCES School(schoolId)
);

CREATE TABLE Reference (
  referenceId VARCHAR(50) PRIMARY KEY NOT NULL,
  JobApplicationId VARCHAR(50) NOT NULL,
  referenceName VARCHAR(80) NOT NULL,
  referenceTitle VARCHAR(80) NOT NULL,
  referenceCompany VARCHAR(80) NOT NULL,
  referencePhone VARCHAR(20) NOT NULL,
  referenceEmail VARCHAR(255) UNIQUE NOT NULL,
  FOREIGN KEY (JobApplicationId) REFERENCES JobApplication(JobApplicationId)
);
