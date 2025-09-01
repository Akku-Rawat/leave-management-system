import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaDownload, FaEye } from 'react-icons/fa';

interface DocFile {
  id: string;
  title: string;
  allowedRoles: ('employee' | 'hr' | 'boss')[];
  updatedAt: string;
  isPdf: boolean;
}

interface DocumentationProps {
  userRole: 'employee' | 'hr' | 'boss';
}

const allDocs: DocFile[] = [
  { id: 'introduction', title: 'Introduction', allowedRoles: ['employee','hr','boss'], updatedAt: '2025-08-01', isPdf: false },
  { id: 'leave-application', title: 'Leave Process', allowedRoles: ['employee','hr'], updatedAt: '2025-08-10', isPdf: false },
  { id: 'termination', title: 'Termination Document', allowedRoles: ['boss'], updatedAt: '2025-08-20', isPdf: false},
];

const Documentation: React.FC<DocumentationProps> = ({ userRole }) => {
  const [previewDoc, setPreviewDoc] = useState<{ path: string; isPdf: boolean } | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [expandedAvailable, setExpandedAvailable] = useState(true);
  const [expandedUpload, setExpandedUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [shareMethod, setShareMethod] = useState<'employeeId' | 'companyEmail' | ''>('');
  const [shareValue, setShareValue] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  const allowedDocs = useMemo(() => allDocs.filter(doc => doc.allowedRoles.includes(userRole)), [userRole]);

  useEffect(() => {
    if (previewDoc && !previewDoc.isPdf) {
      fetch(`/docs/${previewDoc.path}`)
        .then(res => res.text())
        .then(text => setMarkdownContent(text));
    }
  }, [previewDoc]);

  useEffect(() => {
    if (previewDoc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setMarkdownContent('');
    }
  }, [previewDoc]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewDoc) setPreviewDoc(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [previewDoc]);

  const onModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      setPreviewDoc(null);
    }
  };

  const toggleAvailable = () => setExpandedAvailable(a => !a);
  const toggleUpload = () => setExpandedUpload(a => !a);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setUploadedFile(e.target.files[0]);
      setShareMessage('');
      if (!expandedUpload) setExpandedUpload(true);
    }
  };

  const handleShare = () => {
    if (!uploadedFile) {
      setShareMessage('Please upload a file before sharing.');
      return;
    }
    if (!shareMethod || !shareValue.trim()) {
      setShareMessage('Please select share method and enter recipient.');
      return;
    }
    setShareMessage(`File "${uploadedFile.name}" shared via ${shareMethod === 'employeeId' ? 'Employee ID' : 'Company Email'}: ${shareValue}`);
    setUploadedFile(null);
    setShareMethod('');
    setShareValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleShare();
    }
  };

  const downloadFile = (path: string) => {
    const a = document.createElement('a');
    a.href = `/docs/${path}`;
    a.download = path;
    a.click();
  };

  const viewDocument = (path: string, isPdf: boolean) => {
    setPreviewDoc({ path, isPdf });
  };

  return (
    <div className="p-6 bg-gray-50 flex flex-col space-y-6 h-full overflow-hidden">

      {/* Available Documents */}
      <section className="bg-white rounded shadow p-4 flex flex-col">
        <div className="flex justify-between items-center cursor-pointer" onClick={toggleAvailable}>
          <h2 className="text-2xl font-bold">Available Documents</h2>
          <button className="text-blue-600 font-semibold" aria-expanded={expandedAvailable}>
            {expandedAvailable ? 'Collapse ▲' : 'Expand ▼'}
          </button>
        </div>
        <div className={`overflow-auto transition-[max-height] duration-300 ease-in-out ${expandedAvailable ? 'max-h-80 mt-4' : 'max-h-0 mt-0'}`}>
          <ul className="divide-y divide-gray-200">
            {allowedDocs.map(doc => (
              <li key={doc.id} className="flex justify-between items-center py-2 px-1">
                <div>
                  <span className="font-semibold">{doc.title}</span> <span className="text-sm text-gray-500 ml-2">({doc.updatedAt})</span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => viewDocument(`${doc.id}${doc.isPdf ? ".pdf" : ".md"}`, doc.isPdf)} className="text-blue-600 hover:underline flex items-center space-x-1">
                    <FaEye /> <span>View</span>
                  </button>
                  <button onClick={() => downloadFile(`${doc.id}${doc.isPdf ? ".pdf" : ".md"}`)} className="text-green-600 hover:underline flex items-center space-x-1">
                    <FaDownload /> <span>Download</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Upload and Share Section | only for HR and Boss */}
      {(userRole === 'hr' || userRole === 'boss') && (
        <section className="bg-white rounded shadow p-4 flex flex-col">
          <div className="flex justify-between items-center cursor-pointer" onClick={toggleUpload}>
            <h2 className="text-2xl font-bold">Upload & Share Documents</h2>
            <button className="text-blue-600 font-semibold" aria-expanded={expandedUpload}>
              {expandedUpload ? 'Collapse ▲' : 'Expand ▼'}
            </button>
          </div>
          <div className={`overflow-auto transition-[max-height] duration-300 ease-in-out ${expandedUpload ? 'max-h-80 mt-4' : 'max-h-0 mt-0'}`}>
            <div className="space-y-6">
              <div>
                <label htmlFor="upload-file" className="block mb-2 font-semibold">Upload Document</label>
                <input id="upload-file" type="file" onChange={handleFileChange} className="block w-full border p-2 rounded" />
                {uploadedFile && <p className="mt-2 text-green-600 font-semibold">Selected: {uploadedFile.name}</p>}
              </div>

              {uploadedFile && (
                <>
                  <div>
                    <label className="block mb-1 font-semibold">Share With</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="shareMethod" value="employeeId" checked={shareMethod === 'employeeId'} onChange={() => setShareMethod('employeeId')} className="form-radio" />
                        <span>Employee ID</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="shareMethod" value="companyEmail" checked={shareMethod === 'companyEmail'} onChange={() => setShareMethod('companyEmail')} className="form-radio" />
                        <span>Company Email</span>
                      </label>
                    </div>
                    {shareMethod && (
                      <input
                        type="text"
                        value={shareValue}
                        onChange={e => setShareValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={shareMethod === 'employeeId' ? 'Enter Employee ID' : 'Enter Company Email'}
                        className="block w-full border p-2 rounded mt-2"
                      />
                    )}
                  </div>
                  <button onClick={handleShare} className="mt-3 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
                    Share Document
                  </button>
                  {shareMessage && <p className="mt-2 text-green-600 font-semibold">{shareMessage}</p>}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" 
          onClick={onModalClick} 
          ref={modalRef} 
          aria-modal="true" 
          role="dialog"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] relative overflow-hidden">
            <button 
              onClick={() => setPreviewDoc(null)} 
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none" 
              aria-label="Close preview"
            >
              &times;
            </button>
            {previewDoc.isPdf ? (
              <iframe 
                src={`/docs/${previewDoc.path}`} 
                title="PDF Preview" 
                className="w-full h-[75vh] border" 
              />
            ) : (
              <div className="overflow-auto max-h-[75vh] px-6 py-4 prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;
