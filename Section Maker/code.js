// Show the UI
figma.showUI(__html__, { width: 400, height: 800 });

// Handle messages from the UI
figma.ui.onmessage = msg => {
  if (msg.type === 'create-sections') {
    const sections = msg.sections;
    const SECTION_SPACING = 200;
    
    let yPosition = 0;
    
    sections.forEach((section, index) => {
      // Create a section (Figma section node)
      const sectionNode = figma.createSection();
      sectionNode.name = section.name;
      
      // Position the section
      sectionNode.x = 0;
      sectionNode.y = yPosition;
      
      // Resize the section with custom dimensions
      sectionNode.resizeWithoutConstraints(section.width, section.height);
      
      // Parse color from hex and apply opacity
      const color = hexToRgb(section.color);
      sectionNode.fills = [{
        type: 'SOLID',
        color: { r: color.r / 255, g: color.g / 255, b: color.b / 255 },
        opacity: section.opacity
      }];
      
      // Add to current page
      figma.currentPage.appendChild(sectionNode);
      
      // Update y position for next section
      yPosition += section.height + SECTION_SPACING;
    });
    
    // Select the created sections for easy viewing
    figma.currentPage.selection = figma.currentPage.children.slice(-sections.length);
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    
    figma.closePlugin('Created ' + sections.length + ' section(s)');
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}