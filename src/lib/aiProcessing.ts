
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

// Extract text from PDF
export const getPdfText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    if (fullText.trim() === '') {
      // If we couldn't extract any text, use a placeholder
      return "This PDF appears to be an image-based document or has no extractable text.";
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

// Process the prompt with AI
export const processPromptWithAI = async (
  pdfText: string,
  prompt: string
): Promise<{ action: string; details: Record<string, any> }> => {
  // In a real implementation, we would:
  // 1. Send the PDF text and prompt to an AI service (like OpenAI)
  // 2. Parse the AI response to determine what action to take
  // 3. Return the action and details
  
  try {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample logic to interpret some common prompts
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('change my name') || promptLower.includes('update my name')) {
      let newName = "Unknown";
      
      // Try to extract the new name from the prompt
      const nameParts = prompt.match(/(?:to|with)\s+([A-Za-z\s]+)(?:\.|\s|$)/);
      if (nameParts && nameParts[1]) {
        newName = nameParts[1].trim();
      }
      
      return {
        action: 'replace_text',
        details: {
          old_text: 'Name',
          new_text: newName,
          field_type: 'name'
        }
      };
    } else if (promptLower.includes('add job responsibility') || promptLower.includes('add responsibility')) {
      let responsibility = "New responsibility";
      
      // Try to extract the responsibility from the prompt
      const responsParts = prompt.split(/:\s*/);
      if (responsParts.length > 1) {
        responsibility = responsParts[1].trim();
      }
      
      return {
        action: 'add_text',
        details: {
          text: responsibility,
          section: 'responsibilities'
        }
      };
    } else if (promptLower.includes('update my title') || promptLower.includes('change my title')) {
      let newTitle = "Unknown title";
      
      // Try to extract the new title from the prompt
      const titleParts = prompt.match(/(?:to|with)\s+([A-Za-z\s]+)(?:\.|\s|$)/);
      if (titleParts && titleParts[1]) {
        newTitle = titleParts[1].trim();
      }
      
      return {
        action: 'replace_text',
        details: {
          old_text: 'Job Title',
          new_text: newTitle,
          field_type: 'job title'
        }
      };
    } else if (promptLower.includes('update my email') || promptLower.includes('change my email')) {
      let newEmail = "email@example.com";
      
      // Try to extract the new email from the prompt
      const emailParts = prompt.match(/(?:to|with)\s+([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?:\.|\s|$)/);
      if (emailParts && emailParts[1]) {
        newEmail = emailParts[1].trim();
      }
      
      return {
        action: 'replace_text',
        details: {
          old_text: 'Email',
          new_text: newEmail,
          field_type: 'email'
        }
      };
    } else if (promptLower.includes('remove') || promptLower.includes('delete')) {
      // Try to extract what to remove
      let sectionToRemove = "section";
      
      if (promptLower.includes('education')) {
        sectionToRemove = "education";
      } else if (promptLower.includes('experience')) {
        sectionToRemove = "experience";
      } else if (promptLower.includes('skill')) {
        sectionToRemove = "skills";
      }
      
      return {
        action: 'remove_text',
        details: {
          section: sectionToRemove
        }
      };
    } else {
      // Default fallback for unrecognized prompts
      return {
        action: 'unknown',
        details: {
          prompt: prompt
        }
      };
    }
  } catch (error) {
    console.error("Error processing prompt with AI:", error);
    throw new Error("Failed to process prompt with AI");
  }
};
