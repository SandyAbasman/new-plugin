"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 400, height: 600 });
function createFlowNode(text, x, y) {
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
function createArrow(startX, startY, length) {
    const arrow = figma.createLine();
    arrow.x = startX;
    arrow.y = startY;
    arrow.resize(length, 0);
    arrow.strokeWeight = 2;
    arrow.strokeCap = "ARROW_EQUILATERAL";
    arrow.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    return arrow;
}
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const spacing = 300;
        let currentX = 0;
        const nodes = [];
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
});
