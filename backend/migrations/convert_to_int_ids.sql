-- Migration: convert core PKs/FKs to INT AUTO_INCREMENT
-- WARNING: Make a full backup before running. Test on a copy first.
-- This script assumes JobApplicationId remains a UUID (varchar) and is NOT converted.
-- It is written for MariaDB/MySQL. Adjust constraint names if different in your DB.

SET autocommit=0;
START TRANSACTION;

-- 1) Drop constraints referencing tables that will be altered.
-- You may need to adjust constraint names if they differ.
-- Applicant-related constraints
ALTER TABLE `ApplicantCertificate` DROP FOREIGN KEY IF EXISTS `fk_ApplicantCert_App`;
ALTER TABLE `ApplicantCertificate` DROP FOREIGN KEY IF EXISTS `fk_ApplicantCert_Cert`;
ALTER TABLE `ApplicantTraining` DROP FOREIGN KEY IF EXISTS `fk_ApplicantTrain_App`;
ALTER TABLE `ApplicantTraining` DROP FOREIGN KEY IF EXISTS `fk_ApplicantTrain_Train`;
ALTER TABLE `Education` DROP FOREIGN KEY IF EXISTS `fk_Education_App`;
ALTER TABLE `Education` DROP FOREIGN KEY IF EXISTS `fk_Education_School`;
ALTER TABLE `EmploymentHistory` DROP FOREIGN KEY IF EXISTS `fk_EmpHistory_App`;
ALTER TABLE `EmploymentHistory` DROP FOREIGN KEY IF EXISTS `fk_EmpHistory_Company`;
ALTER TABLE `JobApplication` DROP FOREIGN KEY IF EXISTS `fk_JobApp_Applicant`;
ALTER TABLE `ApplicationResumeSettings` DROP FOREIGN KEY IF EXISTS `fk_ResumeSet_JobApp`;
ALTER TABLE `Reference` DROP FOREIGN KEY IF EXISTS `fk_Ref_JobApp`;

-- 2) Convert primary key columns to INT AUTO_INCREMENT where needed.
-- If a column already is INT AUTO_INCREMENT, these ALTERs will be fast/no-op. If some values are non-numeric, these will fail.

-- Applicant (should already be INT)
ALTER TABLE `Applicant` MODIFY COLUMN `applicantId` INT(10) NOT NULL AUTO_INCREMENT;

-- Certificate
ALTER TABLE `Certificate` MODIFY COLUMN `certificateId` INT(10) NOT NULL AUTO_INCREMENT;

-- Training
ALTER TABLE `Training` MODIFY COLUMN `trainingId` INT(10) NOT NULL AUTO_INCREMENT;

-- School
ALTER TABLE `School` MODIFY COLUMN `schoolId` INT(10) NOT NULL AUTO_INCREMENT;

-- Education
ALTER TABLE `Education` MODIFY COLUMN `educationId` INT(10) NOT NULL AUTO_INCREMENT;

-- Company
ALTER TABLE `Company` MODIFY COLUMN `companyId` INT(10) NOT NULL AUTO_INCREMENT;

-- EmploymentHistory
ALTER TABLE `EmploymentHistory` MODIFY COLUMN `EmploymentHistoryId` INT(10) NOT NULL AUTO_INCREMENT;

-- Reference
ALTER TABLE `Reference` MODIFY COLUMN `referenceId` INT(10) NOT NULL AUTO_INCREMENT;

-- Note: JobApplication intentionally remains varchar(36) UUID.
-- ApplicationResumeSettings.JobApplicationId and Reference.JobApplicationId remain varchar(36).

-- 3) Convert foreign key columns to INT where they point to INT PKs.
-- Important: ensure existing values are numeric or map them beforehand.

ALTER TABLE `ApplicantCertificate` MODIFY COLUMN `applicantId` INT(10) NOT NULL;
ALTER TABLE `ApplicantCertificate` MODIFY COLUMN `certificateId` INT(10) NOT NULL;

ALTER TABLE `ApplicantTraining` MODIFY COLUMN `applicantId` INT(10) NOT NULL;
ALTER TABLE `ApplicantTraining` MODIFY COLUMN `trainingId` INT(10) NOT NULL;

ALTER TABLE `Education` MODIFY COLUMN `applicantId` INT(10) NOT NULL;
ALTER TABLE `Education` MODIFY COLUMN `schoolId` INT(10) NOT NULL;

ALTER TABLE `EmploymentHistory` MODIFY COLUMN `applicantId` INT(10) NOT NULL;
ALTER TABLE `EmploymentHistory` MODIFY COLUMN `companyId` INT(10) NOT NULL;

-- JobApplication.applicantId -> INT
ALTER TABLE `JobApplication` MODIFY COLUMN `applicantId` INT(10) NOT NULL;

-- ApplicationResumeSettings.JobApplicationId remains varchar(36)
-- Reference.JobApplicationId remains varchar(36) (references JobApplication)

-- 4) Recreate foreign keys (names match those used in schema file)
ALTER TABLE `ApplicantCertificate`
  ADD CONSTRAINT `fk_ApplicantCert_App` FOREIGN KEY (`applicantId`) REFERENCES `Applicant` (`applicantId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ApplicantCert_Cert` FOREIGN KEY (`certificateId`) REFERENCES `Certificate` (`certificateId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `ApplicantTraining`
  ADD CONSTRAINT `fk_ApplicantTrain_App` FOREIGN KEY (`applicantId`) REFERENCES `Applicant` (`applicantId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ApplicantTrain_Train` FOREIGN KEY (`trainingId`) REFERENCES `Training` (`trainingId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `Education`
  ADD CONSTRAINT `fk_Education_App` FOREIGN KEY (`applicantId`) REFERENCES `Applicant` (`applicantId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Education_School` FOREIGN KEY (`schoolId`) REFERENCES `School` (`schoolId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `EmploymentHistory`
  ADD CONSTRAINT `fk_EmpHistory_App` FOREIGN KEY (`applicantId`) REFERENCES `Applicant` (`applicantId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_EmpHistory_Company` FOREIGN KEY (`companyId`) REFERENCES `Company` (`companyId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `JobApplication`
  ADD CONSTRAINT `fk_JobApp_Applicant` FOREIGN KEY (`applicantId`) REFERENCES `Applicant` (`applicantId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ApplicationResumeSettings`
  ADD CONSTRAINT `fk_ResumeSet_JobApp` FOREIGN KEY (`JobApplicationId`) REFERENCES `JobApplication` (`JobApplicationId`) ON DELETE CASCADE;

ALTER TABLE `Reference`
  ADD CONSTRAINT `fk_Ref_JobApp` FOREIGN KEY (`JobApplicationId`) REFERENCES `JobApplication` (`JobApplicationId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT;
SET autocommit=1;

-- Post-migration notes:
-- 1) If your application stored string ids in client-side caches/localStorage, you may need to reconcile those with the new numeric ids when syncing.
-- 2) Review any stored procedures, triggers, or application code that assume varchar ids and update them to use INT where appropriate.
-- 3) Test creating new rows and verify `LAST_INSERT_ID()` returns numeric ids and that child records reference them correctly.
-- 4) If any ALTER failed due to non-numeric values, restore backup and run a data-cleaning step to map old string ids to numeric ids before retrying.
