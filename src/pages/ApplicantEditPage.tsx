import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Applicant } from "../types";
import type { AuthSession } from "../services/auth";

type ApplicantEditPageProps = {
	applicant: Applicant;
	authSession: AuthSession | null;
	onSaveApplicant: (payload: {
		applicantName: string;
		homeAddress: string;
		phoneNumber: string;
		emailAddress: string;
		linkedInUrl: string;
		citizenshipStatus: string;
		hasCriminalHistory: boolean | null;
		currentPassword: string;
		newPassword: string;
	}) => Promise<void>;
};

const ApplicantEditPage = ({
	applicant,
	authSession,
	onSaveApplicant,
}: ApplicantEditPageProps) => {
	const navigate = useNavigate();
	const [applicantName, setApplicantName] = useState(applicant.applicantName);
	const [homeAddress, setHomeAddress] = useState(applicant.homeAddress);
	const [phoneNumber, setPhoneNumber] = useState(applicant.phoneNumber);
	const [emailAddress, setEmailAddress] = useState(applicant.emailAddress);
	const [linkedInUrl, setLinkedInUrl] = useState(applicant.linkedInUrl);
	const [citizenshipStatus, setCitizenshipStatus] = useState(
		applicant.citizenshipStatus,
	);
	const [hasCriminalHistory, setHasCriminalHistory] = useState<boolean | null>(
		applicant.hasCriminalHistory,
	);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		setApplicantName(applicant.applicantName);
		setHomeAddress(applicant.homeAddress);
		setPhoneNumber(applicant.phoneNumber);
		setEmailAddress(applicant.emailAddress);
		setLinkedInUrl(applicant.linkedInUrl);
		setCitizenshipStatus(applicant.citizenshipStatus);
		setHasCriminalHistory(applicant.hasCriminalHistory);
	}, [applicant]);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setError("");
		setMessage("");

		if (newPassword && newPassword !== confirmPassword) {
			setError("New passwords do not match.");
			return;
		}

		try {
			await onSaveApplicant({
				applicantName,
				homeAddress,
				phoneNumber,
				emailAddress,
				linkedInUrl,
				citizenshipStatus,
				hasCriminalHistory,
				currentPassword,
				newPassword,
			});
			setMessage("Applicant profile updated.");
			navigate("/", { replace: true });
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Unable to update applicant profile.",
			);
		}
	};

	return (
		<div className="page-shell">
			<header className="topbar">
				<div>
					<p className="kicker">Applicant Profile</p>
				</div>
			</header>

			<section className="panel">
				<form className="form-grid" onSubmit={handleSubmit}>
					<div className="flex-column2">
						<div className="col">
							<label>
								Applicant Name
								<input
									value={authSession?.user.name || applicant.applicantName}
									disabled
								/>
							</label>
							<label>
								<span>
									New Full Name <span className="required-asterisk">*</span>
								</span>
								<input
									value={applicantName}
									onChange={(event) => setApplicantName(event.target.value)}
								/>
							</label>
							<label>
								<span>
									Home Address <span className="required-asterisk">*</span>
								</span>
								<input
									value={homeAddress}
									onChange={(event) => setHomeAddress(event.target.value)}
								/>
							</label>
							<label>
								<span>
									Phone Number <span className="required-asterisk">*</span>
								</span>
								<input
									value={phoneNumber}
									onChange={(event) => setPhoneNumber(event.target.value)}
								/>
							</label>
							<label>
								<span>
									Email Address <span className="required-asterisk">*</span>
								</span>
								<input
									type="email"
									value={emailAddress}
									onChange={(event) => setEmailAddress(event.target.value)}
								/>
							</label>
							<label>
								LinkedIn URL
								<input
									value={linkedInUrl}
									onChange={(event) => setLinkedInUrl(event.target.value)}
								/>
							</label>
						</div>
						<div className="col">
							<label>
								<span>
									Citizenship Status{" "}
									<span className="required-asterisk">*</span>
								</span>
								<select
									value={citizenshipStatus}
									onChange={(event) => setCitizenshipStatus(event.target.value)}
								>
									<option value="">Choose status</option>
									<option value="Citizen">Citizen</option>
									<option value="Permanent Resident">Permanent Resident</option>
									<option value="Visa">Visa</option>
									<option value="Other">Other</option>
								</select>
							</label>
							<label>
								<span>
									Has Criminal History{" "}
									<span className="required-asterisk">*</span>
								</span>
								<select
									value={
										hasCriminalHistory === null
											? ""
											: hasCriminalHistory
												? "yes"
												: "no"
									}
									onChange={(event) =>
										setHasCriminalHistory(
											event.target.value === ""
												? null
												: event.target.value === "yes",
										)
									}
								>
									<option value="">Choose</option>
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
							</label>
						</div>
						<div className="col">
							<label>
								<span>
									Current Password <span className="required-asterisk">*</span>
								</span>
								<input
									type="password"
									value={currentPassword}
									onChange={(event) => setCurrentPassword(event.target.value)}
								/>
							</label>
							<label>
								New Password
								<input
									type="password"
									value={newPassword}
									onChange={(event) => setNewPassword(event.target.value)}
								/>
							</label>
							<label>
								<span>
									Confirm New Password{" "}
									<span className="required-asterisk">*</span>
								</span>
								<input
									type="password"
									value={confirmPassword}
									onChange={(event) => setConfirmPassword(event.target.value)}
								/>
							</label>

							{error ? <p className="auth-error">{error}</p> : null}
							{message ? <p className="upload-note done">{message}</p> : null}
						</div>
					</div>
				</form>
				<div className="form-actions">
					<button
						type="button"
						className="outline-button"
						onClick={() => navigate("/")}
					>
						Cancel
					</button>
					<button type="submit" className="primary-button">
						Save Changes
					</button>
				</div>
			</section>
		</div>
	);
};

export default ApplicantEditPage;
