export interface EnquiryFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  service: string;
  description: string;
  budget: string;
  attachmentNote?: string;
}

export interface EnquirySubmissionResult {
  success: boolean;
  message: string;
  enquiryId?: string;
  whatsappUrl?: string;
  errors?: Record<string, string>;
}
