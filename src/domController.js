export function addTextAreaHeightAdjusters(){
  const textAreas = document.querySelectorAll('textarea');
  textAreas.forEach((textArea) => {
    textArea.addEventListener('input', () => {
      textArea.style.height = 'auto'; // Reset the height
      let newHeight = textArea.scrollHeight;
      console.log(`newHeight is ${newHeight}`);

      // Optional: Adjust for padding and borders if needed
      const computedStyle = window.getComputedStyle(textArea);
      
      const lineHeight = parseInt(computedStyle.lineHeight);
      const padding = parseInt(computedStyle.paddingTop) + parseInt(computedStyle.paddingBottom);
      const border = parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);

      // Ensure minimum height is maintained if necessary
      newHeight = Math.max(newHeight, lineHeight + padding + border);

      textArea.style.height = `${newHeight}px`; // Set the new height
    });
  });
};