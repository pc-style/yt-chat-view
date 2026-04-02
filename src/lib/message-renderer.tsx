import type { MessagePart } from "@/types/youtube";

/**
 * Renders a chat message with rich content support (emojis, text)
 * 
 * @param message - Plain text fallback message
 * @param messageParts - Optional array of rich message parts (text, emoji)
 * @returns React elements for rendering the message with inline emojis
 */
export function renderMessage(message: string, messageParts?: MessagePart[]): React.ReactNode {
  // Fallback to plain text if no parts available
  if (!messageParts || messageParts.length === 0) {
    return message;
  }
  
  return messageParts.map((part, idx) => {
    if (part.type === 'emoji' && part.emojiData?.unicode) {
      // Render emoji with Unicode character
      return <span key={idx}>{part.emojiData.unicode}</span>;
    }
    
    if (part.type === 'emoji' && part.emojiData?.name) {
      // Fallback to emoji code if unicode not available
      return <span key={idx}>{part.value}</span>;
    }
    
    // Render text parts
    return <span key={idx}>{part.value}</span>;
  });
}
