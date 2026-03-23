/**
 * Auto CSV Export Utility
 *
 * Automatically appends new leads to a CSV file whenever a form is submitted.
 * Also provides a function to do a full export from the database.
 */

import fs from 'fs';
import path from 'path';

const CSV_FILENAME = 'leads_data.csv';
const CSV_PATH = path.join(process.cwd(), CSV_FILENAME);

const CSV_HEADERS = [
  'ID',
  'Business Name',
  'Email',
  'Phone',
  'Industry',
  'Address',
  'Services',
  'About',
  'Tagline',
  'Template Type',
  'Form Status',
  'Website Status',
  'Payment Status',
  'Deployment URL',
  'Paid At',
  'Created At',
];

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface LeadData {
  id: string;
  businessName: string;
  email: string;
  phone?: string | null;
  industry?: string | null;
  address?: string | null;
  services: string[];
  about: string;
  tagline?: string | null;
  templateType: string;
  status: string;
  websiteStatus?: string | null;
  paymentStatus?: string | null;
  deploymentUrl?: string | null;
  paidAt?: Date | string | null;
  createdAt: Date | string;
}

function leadToCSVRow(lead: LeadData): string {
  return [
    lead.id,
    escapeCSV(lead.businessName),
    escapeCSV(lead.email),
    escapeCSV(lead.phone),
    escapeCSV(lead.industry),
    escapeCSV(lead.address),
    escapeCSV(lead.services?.join(', ')),
    escapeCSV(
      lead.about
        ? lead.about.substring(0, 200) + (lead.about.length > 200 ? '...' : '')
        : ''
    ),
    escapeCSV(lead.tagline),
    escapeCSV(lead.templateType),
    lead.status,
    lead.websiteStatus || 'N/A',
    lead.paymentStatus || 'N/A',
    escapeCSV(lead.deploymentUrl),
    formatDate(lead.paidAt),
    formatDate(lead.createdAt),
  ].join(',');
}

/**
 * Ensures the CSV file exists with headers.
 * If it doesn't exist, creates it with the header row.
 */
function ensureCSVFile(): void {
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, CSV_HEADERS.join(',') + '\n', 'utf8');
    console.log(`[CSV] Created new CSV file: ${CSV_PATH}`);
  }
}

/**
 * Appends a single lead row to the CSV file.
 * Called automatically after each new form submission is processed.
 */
export function appendLeadToCSV(lead: LeadData): void {
  try {
    ensureCSVFile();
    const row = leadToCSVRow(lead) + '\n';
    fs.appendFileSync(CSV_PATH, row, 'utf8');
    console.log(`[CSV] Auto-appended lead: ${lead.businessName} (${lead.id})`);
  } catch (error) {
    console.error(`[CSV] Failed to append lead:`, error);
  }
}

/**
 * Updates an existing lead's row in the CSV (e.g., when payment status changes).
 * Rewrites the entire file with updated data for the matching ID.
 */
export function updateLeadInCSV(lead: LeadData): void {
  try {
    ensureCSVFile();
    const content = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = content.split('\n');
    const header = lines[0];
    const dataLines = lines.slice(1).filter((line) => line.trim() !== '');

    let found = false;
    const updatedLines = dataLines.map((line) => {
      // CSV row starts with the ID
      if (line.startsWith(lead.id + ',') || line.startsWith(lead.id + '"')) {
        found = true;
        return leadToCSVRow(lead);
      }
      return line;
    });

    if (!found) {
      // Lead not in CSV yet, append it
      updatedLines.push(leadToCSVRow(lead));
    }

    const newContent = [header, ...updatedLines].join('\n') + '\n';
    fs.writeFileSync(CSV_PATH, newContent, 'utf8');
    console.log(`[CSV] Updated lead: ${lead.businessName} (${lead.id})`);
  } catch (error) {
    console.error(`[CSV] Failed to update lead:`, error);
  }
}

/**
 * Full export: fetches all leads from DB and writes a complete CSV.
 * Used by the /api/admin/export-csv endpoint.
 */
export async function fullExportToCSV(prisma: any): Promise<string> {
  const leads = await prisma.formSubmission.findMany({
    include: {
      generatedWebsite: {
        select: {
          id: true,
          deploymentUrl: true,
          status: true,
          paymentStatus: true,
          paidAt: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const rows = leads.map((lead: any) => {
    const website = lead.generatedWebsite;
    return leadToCSVRow({
      id: lead.id,
      businessName: lead.businessName,
      email: lead.email,
      phone: lead.phone,
      industry: lead.industry,
      address: lead.address,
      services: lead.services || [],
      about: lead.about,
      tagline: lead.tagline,
      templateType: lead.templateType,
      status: lead.status,
      websiteStatus: website?.status,
      paymentStatus: website?.paymentStatus,
      deploymentUrl: website?.deploymentUrl,
      paidAt: website?.paidAt,
      createdAt: lead.createdAt,
    });
  });

  const csvContent = [CSV_HEADERS.join(','), ...rows].join('\n');

  // Also update the local file
  fs.writeFileSync(CSV_PATH, csvContent + '\n', 'utf8');
  console.log(`[CSV] Full export complete: ${leads.length} leads`);

  return csvContent;
}

export { CSV_FILENAME, CSV_PATH };
