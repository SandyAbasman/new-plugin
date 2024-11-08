figma.showUI(__html__, { width: 400, height: 600 });

interface FlowStep {
  text: string;
  x: number;
  y: number;
}

function createFlowNode(text: string, x: number, y: number) {
  // Create rectangle
  const rect = figma.createRectangle();
  rect.resize(200, 100);
  rect.x = x;
  rect.y = y;
  rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 1 } }];
  rect.cornerRadius = 8;

  // Add text
  const textNode = figma.createText();
  textNode.characters = text;
  textNode.fontSize = 14;
  textNode.textAlignHorizontal = "CENTER";
  textNode.textAlignVertical = "CENTER";
  textNode.resize(180, 80);
  textNode.x = x + 10;
  textNode.y = y + 10;

  return figma.group([rect, textNode], figma.currentPage);
}

function createArrow(startX: number, startY: number, length: number) {
  const arrow = figma.createLine();
  arrow.x = startX;
  arrow.y = startY;
  arrow.resize(length, 0);
  arrow.strokeWeight = 2;
  arrow.strokeCap = "ARROW_EQUILATERAL";
  arrow.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  return arrow;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-flow') {
    const requirements = msg.requirements.split('\n').filter(req => req.trim());
    
    if (requirements.length === 0) {
      figma.notify("Please add at least one step", { error: true });
      return;
    }

    // Create a new page for the flow
    const page = figma.createPage();
    page.name = "User Flow";
    figma.currentPage = page;

    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    const spacing = 300;
    let currentX = 0;
    const nodes: SceneNode[] = [];

    // Create flow nodes and arrows
    for (let i = 0; i < requirements.length; i++) {
      const step = requirements[i];
      
      // Create and group rectangle with text
      const group = createFlowNode(step, currentX, 0);
      group.name = `Step ${i + 1}`;
      nodes.push(group);

      // Create arrow if not the last step
      if (i < requirements.length - 1) {
        const arrow = createArrow(currentX + 200, 50, 100);
        nodes.push(arrow);
      }

      currentX += spacing;
    }

    // Select all nodes and zoom to fit
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.notify("User flow generated!");
  }

  // Don't close the plugin to allow multiple generations
};