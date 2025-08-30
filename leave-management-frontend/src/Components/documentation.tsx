// src/components/Documentation.tsx

import React, { useState, useEffect, useMemo } from 'react';
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
  { id: 'introduction',           title: 'Introduction',               allowedRoles: ['employee','hr','boss'], updatedAt: '2025-08-01', isPdf: false },
  { id: 'leave-application',      title: 'Leave Application Process',   allowedRoles: ['employee','hr'],      updatedAt: '2025-08-10', isPdf: false },
  { id: 'approval-workflow',      title: 'Approval Workflow',           allowedRoles: ['hr','boss'],         updatedAt: '2025-08-15', isPdf: false },
  { id: 'employee-management',    title: 'Employee Management',         allowedRoles: ['hr','boss'],         updatedAt: '2025-08-12', isPdf: false },
  { id: 'offer-letters',          title: 'Offer Letters',               allowedRoles: ['hr'],                 updatedAt: '2025-08-05', isPdf: false },
  { id: 'termination',            title: 'Termination Process',         allowedRoles: ['hr'],                 updatedAt: '2025-08-20', isPdf: false },
  { id: 'executive-dashboard',    title: 'Executive Dashboard Guide',   allowedRoles: ['boss'],               updatedAt: '2025-08-18', isPdf: false },
  { id: 'reports-analytics',      title: 'Reports & Analytics',         allowedRoles: ['boss'],               updatedAt: '2025-08-22', isPdf: false },
  { id: 'delegation-escalation',  title: 'Delegation & Escalation',     allowedRoles: ['boss'],               updatedAt: '2025-08-25', isPdf: false },
  { id: 'troubleshooting',        title: 'Troubleshooting & FAQs',      allowedRoles: ['employee','hr','boss'], updatedAt: '2025-08-08', isPdf: false },
  { id: 'contact-support',        title: 'Contact Support',             allowedRoles: ['employee','hr','boss'], updatedAt: '2025-08-02', isPdf: false },
];

const companyDocs: { filename: string; title: string; updatedAt: string }[] = [
  { filename: 'employee-handbook.pdf', title: 'Employee Handbook', updatedAt: '2025-07-30' },
  { filename: 'code-of-conduct.pdf',   title: 'Code of Conduct',   updatedAt: '2025-08-03' },
  { filename: 'benefits-guide.pdf',    title: 'Benefits Guide',    updatedAt: '2025-08-07' },
];

const Documentation: React.FC<DocumentationProps> = ({ userRole }) => {
  const [previewDoc, setPreviewDoc] = useState<{ path: string; isPdf: boolean } | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');

  const allowedDocs = useMemo(
    () => allDocs.filter(d => d.allowedRoles.includes(userRole)),
    [userRole]
  );

  const downloadFile = (path: string) => {
    const a = document.createElement('a');
    a.href = `/docs/${path}`;
    a.download = path;
    a.click();
  };

  const viewDoc = (path: string, isPdf: boolean) => {
    if (isPdf) {
      setPreviewDoc({ path, isPdf });
    } else {
      fetch(`/docs/${path}`)
        .then(res => res.text())
        .then(text => {
          setMarkdownContent(text);
          setPreviewDoc({ path, isPdf });
        });
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Documentation</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Available Documents</h3>
        <ul className="space-y-2">
          {allowedDocs.map(doc => (
            <li key={doc.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
              <div>
                <span className="font-medium">{doc.title}</span>
                <span className="text-sm text-gray-500 ml-2">({doc.updatedAt})</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => viewDoc(`${doc.id}${doc.isPdf ? '.pdf' : '.md'}`, doc.isPdf)}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <FaEye className="mr-1" /> View
                </button>
                <button
                  onClick={() => downloadFile(`${doc.id}${doc.isPdf ? '.pdf' : '.md'}`)}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <FaDownload className="mr-1" /> Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {userRole === 'employee' && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Company Received Documents</h3>
          <ul className="space-y-2">
            {companyDocs.map(cd => (
              <li key={cd.filename} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                <div>
                  <span className="font-medium">{cd.title}</span>
                  <span className="text-sm text-gray-500 ml-2">({cd.updatedAt})</span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => viewDoc(cd.filename, true)}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                  <button
                    onClick={() => downloadFile(cd.filename)}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <FaDownload className="mr-1" /> Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {previewDoc && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <button
            onClick={() => setPreviewDoc(null)}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Close Preview
          </button>
          {previewDoc.isPdf ? (
            <iframe
              src={`/docs/${previewDoc.path}`}
              title="PDF Preview"
              className="w-full h-[600px] border"
            />
          ) : (
            <div className="prose prose-indigo">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Documentation;
