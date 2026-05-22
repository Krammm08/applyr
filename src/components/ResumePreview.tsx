import { useEffect, useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { ResumePDF } from "./ResumePDF";
import type {
  Applicant,
  JobApplication,
  Education,
  EmploymentHistory,
  ApplicantReference,
  Training,
  Certificate,
} from "../types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type ResumeTemplateId = "classic" | "compact" | "modern";

type ResumePreviewProps = {
  applicant: Applicant;
  jobApplication: JobApplication;
  education: Education[];
  employmentHistory: EmploymentHistory[];
  references: ApplicantReference[];
  trainings: Training[];
  certificates: Certificate[];
  previewFont: string;
  resumeTemplate: ResumeTemplateId;
};

const ResumePreview = (props: ResumePreviewProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  
  // Track the active generation pass to ignore stale asynchronous resolutions
  const generationIdRef = useRef(0);

  useEffect(() => {
    const currentGenerationId = ++generationIdRef.current;
    setIsCompiling(true);

    // Set up a tiny 250ms debounce before hammering the PDF Compiler engine
    const compileTimeout = setTimeout(async () => {
      try {
        // Force explicit evaluation of the layout structure package
        const docInstance = <ResumePDF {...props} />;
        const blobBlob = await pdf(docInstance).toBlob();
        const newBlobUrl = URL.createObjectURL(blobBlob);

        // Guard: If a newer change loop has already started, discard this stale thread
        if (currentGenerationId !== generationIdRef.current) {
          URL.revokeObjectURL(newBlobUrl);
          return;
        }

        setPdfUrl((oldUrl) => {
          if (oldUrl) URL.revokeObjectURL(oldUrl); // Prevent memory leaks
          return newBlobUrl;
        });
        
        setIsCompiling(false);
      } catch (err) {
        console.error("PDF Compilation failure:", err);
        if (currentGenerationId === generationIdRef.current) {
          setIsCompiling(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(compileTimeout);
    };
  }, [
    props.applicant,
    props.jobApplication,
    props.education,
    props.employmentHistory,
    props.references,
    props.trainings,
    props.certificates,
    props.previewFont,
    props.resumeTemplate
  ]);

  return (
    <div className="preview-scroll" aria-label="Resume preview document">
      <div className="canvas-pdf-container">
        
        {/* Subtle, floating sync chip */}
        {isCompiling && (
          <div className="pdf-sync-indicator">Updating layout...</div>
        )}

        {pdfUrl ? (
          <div className={`pdf-render-engine ${isCompiling ? "is-syncing" : ""}`}>
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={null}
              error={<div className="pdf-status-message error">Failed to parse PDF document structure.</div>}
              className="pdf-document"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="pdf-page-wrapper">
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={800}
                    loading={null} // Eradicates layout flashing within individual items
                  />
                </div>
              ))}
            </Document>
          </div>
        ) : (
          <div className="pdf-status-message">Generating Document...</div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;