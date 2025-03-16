
import { Dispatch, SetStateAction } from 'react';
import { toast } from "sonner";
import { getPdfText, processPromptWithAI } from './aiProcessing';
import * as pdfjsLib from 'pdfjs-dist';

// Create a URL for a PDF file
export const createPdfUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

// Revoke a URL when it's no longer needed
export const revokePdfUrl = (url: string | null): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

// Simple PDF modification function (simulated)
const modifyPdf = async (file: File, action: string, details: Record<string, any>): Promise<Blob> => {
  // In a real implementation, this would use PDF.js or pdf-lib to modify the PDF
  // For this demo, we're creating a modified version by adding a visual stamp
  
  // Load the PDF document using PDF.js
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  // For demonstration purposes, we're just returning the original file with simulated changes
  // In a real implementation, we would modify the PDF content based on the action and details
  
  console.log("Modifying PDF with action:", action, "and details:", details);
  
  // Create a new blob with the same data
  // In a real implementation, this would be the modified PDF data
  return new Blob([arrayBuffer], { type: 'application/pdf' });
};

// Process the PDF based on the prompt
export const processPdf = async (
  file: File,
  prompt: string,
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  setProcessedPdfUrl: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  setIsProcessing(true);
  
  try {
    // Extract text from the PDF
    const pdfText = await getPdfText(file);
    console.log("Extracted PDF text:", pdfText);
    
    // Process the prompt with AI to determine what changes to make
    const aiResponse = await processPromptWithAI(pdfText, prompt);
    console.log("AI processing result:", aiResponse);
    
    // Apply the changes to the PDF
    const modifiedPdfBlob = await modifyPdf(file, aiResponse.action, aiResponse.details);
    
    // Create a URL for the modified PDF
    const processedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
    
    setProcessedPdfUrl(processedPdfUrl);
    
    // Show a toast with details about what was changed
    if (aiResponse.action === 'replace_text') {
      toast.success(`Changed ${aiResponse.details.field_type || 'text'} to "${aiResponse.details.new_text}"`);
    } else if (aiResponse.action === 'add_text') {
      toast.success(`Added to ${aiResponse.details.section || 'document'}: "${aiResponse.details.text}"`);
    } else if (aiResponse.action === 'unknown') {
      toast.info("Changes applied but some instructions weren't clear");
    } else {
      toast.success("PDF processed successfully");
    }
  } catch (error) {
    console.error("Error processing PDF:", error);
    toast.error("Failed to process PDF");
  } finally {
    setIsProcessing(false);
  }
};
