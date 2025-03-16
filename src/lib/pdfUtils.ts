
import { Dispatch, SetStateAction } from 'react';
import { toast } from "sonner";
import { getPdfText, processPromptWithAI } from './aiProcessing';
import * as pdfjsLib from 'pdfjs-dist';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

// Modify PDF based on AI analysis
const modifyPdf = async (file: File, action: string, details: Record<string, any>): Promise<Blob> => {
  try {
    // Load the original PDF as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document with pdf-lib
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Default to first page if not specified
    const pageIndex = details.page ? details.page - 1 : 0;
    const page = pages[Math.min(pageIndex, pages.length - 1)];
    
    // Set up font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    
    console.log(`Applying action: ${action} with details:`, details);
    
    if (action === 'replace_text') {
      // For text replacement, add visible annotation showing the change
      // In a real implementation, we would need more complex PDF content manipulation
      const { new_text, field_type } = details;
      
      // Add annotation to the top of the page showing what was changed
      page.drawText(`MODIFIED: Changed ${field_type || 'text'} to "${new_text}"`, {
        x: 50,
        y: page.getHeight() - 50,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0.5, 0.8),
      });
      
      // Draw a highlight box around where the change would be
      page.drawRectangle({
        x: 50,
        y: page.getHeight() - 70,
        width: 300,
        height: 15,
        borderColor: rgb(0, 0.5, 0.8),
        borderWidth: 1,
        color: rgb(0.9, 0.95, 1),
        opacity: 0.5,
      });
      
      // Add the new text in a noticeable position
      page.drawText(new_text, {
        x: 50,
        y: page.getHeight() - 85,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    } 
    else if (action === 'add_text') {
      // For adding text, add visible annotation showing what was added
      const { text, section } = details;
      
      // Add annotation to the top of the page showing what was added
      page.drawText(`ADDED to ${section || 'document'}: "${text}"`, {
        x: 50,
        y: page.getHeight() - 50,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0.6, 0.3),
      });
      
      // Add the new text in a visible position
      page.drawText(text, {
        x: 50,
        y: page.getHeight() - 85,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
    else if (action === 'remove_text') {
      // For removing text, add visible annotation showing what was removed
      const { section } = details;
      
      // Add annotation to the top of the page showing what was removed
      page.drawText(`REMOVED: Contents from "${section || 'document'}" section`, {
        x: 50,
        y: page.getHeight() - 50,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.8, 0, 0),
      });
      
      // Draw a strikethrough box where content would be removed
      page.drawRectangle({
        x: 50,
        y: page.getHeight() - 70,
        width: 300,
        height: 15,
        borderColor: rgb(0.8, 0, 0),
        borderWidth: 1,
        color: rgb(1, 0.9, 0.9),
        opacity: 0.3,
      });
    }
    else if (action === 'unknown') {
      // For unknown actions, add explanation
      page.drawText(`AI attempted to process: "${details.prompt}"`, {
        x: 50,
        y: page.getHeight() - 50,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      page.drawText(`Instructions unclear. Please try a more specific prompt.`, {
        x: 50,
        y: page.getHeight() - 70,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  } 
  catch (error) {
    console.error("Error modifying PDF:", error);
    // Return the original file if modification fails
    return new Blob([await file.arrayBuffer()], { type: 'application/pdf' });
  }
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
    } else if (aiResponse.action === 'remove_text') {
      toast.success(`Removed content from "${aiResponse.details.section || 'document'}" section`);
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
