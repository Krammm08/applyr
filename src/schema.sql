-- 1. Create the base Applicant table first
CREATE TABLE Applicant (
    applicantId INT(10) AUTO_INCREMENT PRIMARY KEY,
    applicantName VARCHAR(100) NOT NULL,
    homeAddress VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    emailAddress VARCHAR(100) NOT NULL,
    linkedInUrl VARCHAR(255),
    citizenshipStatus VARCHAR(50) NOT NULL,
    hasCriminalHistory BOOLEAN NOT NULL,
    agreesToDrugTest BOOLEAN NOT NULL
);

-- 2. Create the Job Application table (Linked to Applicant)
CREATE TABLE JobApplication (
    JobApplicationId INT(10) AUTO_INCREMENT PRIMARY KEY,
    applicantId INT(10) NOT NULL,
    appliedPosition VARCHAR(100) NOT NULL,
    JobApplicationDate DATE NOT NULL,
    JobApplicationStatus VARCHAR(50) NOT NULL DEFAULT 'Pending',
    availableStartDate DATE,
    expectedSalary DECIMAL(10,2),
    resumeFileUrl VARCHAR(255),
    FOREIGN KEY (applicantId) REFERENCES Applicant(applicantId) ON DELETE CASCADE
);

-- 3. Create the School table
CREATE TABLE School (
    schoolId INT(10) AUTO_INCREMENT PRIMARY KEY,
    schoolName VARCHAR(100) NOT NULL,
    schoolLocation VARCHAR(100) NOT NULL
);

-- 4. Create the Education table (Linked to Applicant and School)
CREATE TABLE Education (
    educationId INT(10) AUTO_INCREMENT PRIMARY KEY,
    applicantId INT(10) NOT NULL,
    schoolId INT(10) NOT NULL,
    yearsAttended VARCHAR(50) NOT NULL,
    degreeReceived VARCHAR(100) NOT NULL,
    programName VARCHAR(100),
    FOREIGN KEY (applicantId) REFERENCES Applicant(applicantId) ON DELETE CASCADE,
    FOREIGN KEY (schoolId) REFERENCES School(schoolId) ON DELETE CASCADE
);

-- 5. Create the Company table
CREATE TABLE Company (
    companyId INT(10) AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(100) NOT NULL,
    workAddress VARCHAR(255) NOT NULL
);

-- 6. Create the Employment History table (Linked to Applicant and Company)
CREATE TABLE EmploymentHistory (
    EmploymentHistoryId VARCHAR(50) PRIMARY KEY,
    applicantId INT(10) NOT NULL,
    companyId INT(10) NOT NULL,
    workPosition VARCHAR(100) NOT NULL,
    reasonForLeaving VARCHAR(255) NOT NULL,
    FOREIGN KEY (applicantId) REFERENCES Applicant(applicantId) ON DELETE CASCADE,
    FOREIGN KEY (companyId) REFERENCES Company(companyId) ON DELETE CASCADE
);

-- 7. Create the References table (Linked to Applicant)
-- Note: Renamed from "References" to "ApplicantReference" because REFERENCES is a reserved SQL keyword.
CREATE TABLE ApplicantReference (
    referenceId VARCHAR(50) PRIMARY KEY,
    applicantId INT(10) NOT NULL,
    referenceName VARCHAR(100) NOT NULL,
    referenceTitle VARCHAR(100) NOT NULL,
    referenceCompany VARCHAR(100) NOT NULL,
    referencePhone VARCHAR(20) NOT NULL,
    referenceEmail VARCHAR(100),
    FOREIGN KEY (applicantId) REFERENCES Applicant(applicantId) ON DELETE CASCADE
);