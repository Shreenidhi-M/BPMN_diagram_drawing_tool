/// <reference path="JsDiagram-vsdoc.js" />
var DiagramView = MindFusion.Diagramming.DiagramView;
var AbstractionLayer = MindFusion.AbstractionLayer;
var AnchorPattern = MindFusion.Diagramming.AnchorPattern;
var AnchorPoint = MindFusion.Diagramming.AnchorPoint;
var DiagramNode = MindFusion.Diagramming.DiagramNode;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ContainerNode = MindFusion.Diagramming.ContainerNode;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var MarkStyle = MindFusion.Diagramming.MarkStyle;
var Style = MindFusion.Diagramming.Style;
var Theme = MindFusion.Diagramming.Theme;
var FontStyle = MindFusion.Drawing.FontStyle;
var Font = MindFusion.Drawing.Font;
var Alignment = MindFusion.Diagramming.Alignment;
var Behavior = MindFusion.Diagramming.Behavior;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var ChangeItemCommand = MindFusion.Diagramming.ChangeItemCommand;
var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var Overview = MindFusion.Diagramming.Overview;
var NodeListView = MindFusion.Diagramming.NodeListView;
var Rect = MindFusion.Drawing.Rect;
var Shape = MindFusion.Diagramming.Shape;
var DashStyle = MindFusion.Drawing.DashStyle;
var Point = MindFusion.Drawing.Point;


var diagram, nodeList;
var backgroundColor, linkDashStyle, baseShape, headShape, headBrush;

window.onload = function(e){ 

     backgroundColor = "#f2ebcf";
	 linkDashStyle = DashStyle.Solid; 
	 baseShape = null;
	 headShape = "Triangle";
	 headBrush = "#7F7F7F";

	// create a Diagram component that wraps the "diagram" canvas
	var diagramView = DiagramView.create(document.getElementById("diagram"));
	diagram = diagramView.diagram;
	diagram.allowInplaceEdit = true;
	diagram.routeLinks = true;
	diagram.showGrid = true;
	diagram.undoEnabled = true;
	diagram.roundedLinks = true;
	diagram.bounds = new Rect(0, 0, 2000,2000);
	
	var theme = new Theme();
	var shapeNodeStyle = new Style();
	shapeNodeStyle.brush = { type: 'SolidBrush', color: '#f2ebcf' };
	shapeNodeStyle.stroke = "#7F7F7F";
	shapeNodeStyle.textColor = "#585A5C";
	shapeNodeStyle.fontName = "Verdana";
	shapeNodeStyle.fontSize = 3;
	theme.styles.set("std:ShapeNode", shapeNodeStyle);
	
	var linkStyle = new Style();
	linkStyle.stroke = "#7F7F7F";
	linkStyle.strokeThickness = 1.0;
	linkStyle.textColor = "#585A5C";
	linkStyle.fontName = "Verdana";
	linkStyle.fontSize = 3;
	theme.styles.set("std:DiagramLink", linkStyle);
	
	diagram.theme = theme;	

	diagram.addEventListener(Events.nodeCreated, onNodeCreated);
	diagram.addEventListener(Events.linkCreated, onLinkCreated);


	// create an NodeListView component that wraps the "nodeList" canvas
	nodeList = NodeListView.create(document.getElementById("nodeList"));	
    
	 var node = new ShapeNode();	
	 node.transparent = true;
	 node.text = "Text";
	 node.font = new Font("Verdana", 12);
	 nodeList.addNode(node, "Text");
	 
	 node = new ShapeNode();
	 node.shape = 'Decision';
	 node.brush = { type: 'SolidBrush', color: '#f2ebcf' };
	 nodeList.addNode(node, "Decision");
	 
	 node = new ShapeNode();
	 node.shape = 'RoundRect';
	 node.brush = { type: 'SolidBrush', color: '#f2ebcf' };
	 nodeList.addNode(node, "Rounded Rect");
	 
	 node = new ShapeNode();
	 node.shape = 'Circle';
	 node.brush = { type: 'SolidBrush', color: '#f2ebcf' };
	 nodeList.addNode(node, "Circle");
  	 
	 
	 node = new ContainerNode();
	 node.CaptionBackBrush = { type: 'SolidBrush', color: '#f2ebcf' };
	 node.brush = { type: 'SolidBrush', color: '#ffffff' };
	 node.rotationAngle = -90;
	 nodeList.addNode(node, "Container");	
		
	for (var shapeId in Shape.shapes)
	{
		// cycle through all shapes, add those that start with 'bpmn'
		var shape = Shape.shapes[shapeId];
		
		if (shapeId.startsWith("Bpmn"))
		{
		   var node = new MindFusion.Diagramming.ShapeNode(diagram);
		   node.shape = shapeId;
		   node.brush = { type: 'SolidBrush', color: '#f2ebcf' };
		   nodeList.addNode(node, shapeId.substring(4));
		}
	}	
		
	nodeList.addEventListener(Events.nodeSelected, onShapeSelected);

	onLoaded();
}

//sets the default node shape of the diagram to the selected one
function onShapeSelected(sender, e)
{
	var selectedNode = e.node;
	if (selectedNode)
		diagram.defaultShape = selectedNode.shape;
}

//create the BPMN diagram
function onLoaded()
{
	
	var colorBkgr = document.querySelector("#colorBkgr");
	colorBkgr.value = backgroundColor;
	colorBkgr.addEventListener("input", updateBackground, false);
	colorBkgr.addEventListener("change", updateBackground, false);  

	// Create a sample diagram
	
	var clientLane = diagram.factory.createContainerNode(new Rect(145, -130, 20, 300));
	clientLane.rotationAngle = 270;  
	clientLane.text = "Client";
	clientLane.captionBackBrush = { type: 'SolidBrush', color: '#f2ebcf' };
	
	var invoicingLane = diagram.factory.createContainerNode(new Rect(85, -25, 140, 300));
	invoicingLane.rotationAngle = 270;  
	invoicingLane.text = "Invoicing";
	invoicingLane.captionBackBrush = { type: 'SolidBrush', color: '#f2ebcf' };

		
	var ellipse = diagram.factory.createShapeNode(new Rect(20, 110, 12, 12	));
	ellipse.shape = 'Ellipse';
	ellipse.brush = { type: 'SolidBrush', color: '#a3c686' };
	invoicingLane.add(ellipse);
	
	var appText = diagram.factory.createShapeNode(new Rect(16, 115, 20, 20	));
	appText.transparent = true;
	appText.text = "Application";
	invoicingLane.add(appText);
	
	var decision = diagram.factory.createShapeNode(new Rect(50, 110, 12, 12	));
	decision.shape = 'Decision';
	decision.brush = { type: 'SolidBrush', color: '#f5ded0' };
	invoicingLane.add(decision);
	
	var corrCheck = diagram.factory.createShapeNode(new Rect(80, 109, 26, 14	));
	corrCheck.shape = 'RoundRect';
	corrCheck.text = "Checking for Corrections";
	corrCheck.brush = { type: 'SolidBrush', color: '#a1d0d8' };
	invoicingLane.add(corrCheck);
	
	var database = diagram.factory.createShapeNode(new Rect(84, 131, 18, 20	));
	database.shape = 'Database';
	database.text = "\n\n\nBill for Goods";
	database.brush = { type: 'SolidBrush', color: '#e9ca91' };
	invoicingLane.add(database);
	
	var decision1 = diagram.factory.createShapeNode(new Rect(125, 110, 12, 12	));
	decision1.shape = 'Decision';
	decision1.brush = { type: 'SolidBrush', color: '#f5ded0' };
	invoicingLane.add(decision1);
	
	var textNode = diagram.factory.createShapeNode(new Rect(133, 109, 40, 14	));
	textNode.transparent = true;
	textNode.text = "Application correct?";	
	invoicingLane.add(textNode);
	
	var requestData = diagram.factory.createShapeNode(new Rect(118, 82, 26, 14	));
	requestData.shape = 'RoundRect';
	requestData.text = "Request Specified Data";
	requestData.brush = { type: 'SolidBrush', color: '#a1d0d8' };
	invoicingLane.add(requestData);
	
	var bpmnStartMessage = diagram.factory.createShapeNode(new Rect(164, 83, 12, 12	));
	bpmnStartMessage.shape = 'BpmnStartMessage';
	bpmnStartMessage.brush = { type: 'SolidBrush', color: '#ffcc80' };
	invoicingLane.add(bpmnStartMessage);
	
	textNode = diagram.factory.createShapeNode(new Rect(157, 90, 24, 14	));
	textNode.transparent = true;
	textNode.text = "Email client";	
	invoicingLane.add(textNode);
	
	var bpmnInclusive = diagram.factory.createShapeNode(new Rect(196, 83, 12, 12	));
	bpmnInclusive.shape = 'BpmnInclusive';
	bpmnInclusive.brush = { type: 'SolidBrush', color: '#f5ded0' };
	invoicingLane.add(bpmnInclusive);
	
	var bpmnEndMessage1 = diagram.factory.createShapeNode(new Rect(196, 58, 12, 12	));
	bpmnEndMessage1.shape = 'BpmnEndMessage';
	bpmnEndMessage1.brush = { type: 'SolidBrush', color: '#ffcc80' };
	invoicingLane.add(bpmnEndMessage1);
	
	var bpmnEndMessage = diagram.factory.createShapeNode(new Rect(225, 83, 12, 12	));
	bpmnEndMessage.shape = 'BpmnEndMessage';
	bpmnEndMessage.brush = { type: 'SolidBrush', color: '#ffcc80' };
	invoicingLane.add(bpmnEndMessage);
	
	var bpmnEndCancel = diagram.factory.createShapeNode(new Rect(254, 83, 12, 12	));
	bpmnEndCancel.shape = 'BpmnEndCancel';
	bpmnEndCancel.brush = { type: 'SolidBrush', color: '#ea684f' };
	invoicingLane.add(bpmnEndCancel);
	
	textNode = diagram.factory.createShapeNode(new Rect(248, 90, 24, 14	));
	textNode.transparent = true;
	textNode.text = "Client Refusal";	
	invoicingLane.add(textNode);
	
	var bpmnIntermTimer = diagram.factory.createShapeNode(new Rect(225, 108, 12, 12	));
	bpmnIntermTimer.shape = 'BpmnIntermediateTimer';
	bpmnIntermTimer.brush = { type: 'SolidBrush', color: '#ffcc80' };
	invoicingLane.add(bpmnIntermTimer);
	
	textNode = diagram.factory.createShapeNode(new Rect(220, 115, 24, 14	));
	textNode.transparent = true;
	textNode.text = "2 Days";	
	invoicingLane.add(textNode);
	
	var bpmnTerminate = diagram.factory.createShapeNode(new Rect(254, 108, 12, 12	));
	bpmnTerminate.shape = 'BpmnEndTerminate';
	bpmnTerminate.brush = { type: 'SolidBrush', color: '#ea684f' };
	invoicingLane.add(bpmnTerminate);
	
	textNode = diagram.factory.createShapeNode(new Rect(249, 115, 24, 14	));
	textNode.transparent = true;
	textNode.text = "No Answer";	
	invoicingLane.add(textNode);
	
	var newApp = diagram.factory.createShapeNode(new Rect(118, 137, 26, 14	));
	newApp.shape = 'RoundRect';
	newApp.text = "Form a New Application for Shipment";
	newApp.brush = { type: 'SolidBrush', color: '#a1d0d8' };
	invoicingLane.add(newApp);
	
	var pkgGoods = diagram.factory.createShapeNode(new Rect(158, 137, 26, 14	));
	pkgGoods.shape = 'RoundRect';
	pkgGoods.text = "Prepare Package";
	pkgGoods.brush = { type: 'SolidBrush', color: '#a1d0d8' };
	invoicingLane.add(pkgGoods);
	
	var bpmnEndMessage2 = diagram.factory.createShapeNode(new Rect(165, 168, 12, 12));
	bpmnEndMessage2.shape = 'BpmnEndMessage';
	bpmnEndMessage2.brush = { type: 'SolidBrush', color: '#ea684f' };
	invoicingLane.add(bpmnEndMessage2);
	
	textNode = diagram.factory.createShapeNode(new Rect(163, 176, 18, 12));
	textNode.transparent = true;
	textNode.text = "Invoice";	
	invoicingLane.add(textNode);
	

	
	var link = diagram.factory.createDiagramLink(ellipse, decision);	
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(decision, corrCheck);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(corrCheck, database);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(corrCheck, decision1);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(decision1, requestData);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.text = "No";
	link.textAlignment = MindFusion.Diagramming.Alignment.Near;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(decision1, newApp);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.text = "Yes";
	link.textAlignment = MindFusion.Diagramming.Alignment.Near;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(requestData, bpmnStartMessage);
	link.headShape = "Triangle";
	link.baseShape = "Circle";
	link.headShapeSize = 3.0;
	link.baseShapeSize = 3.0;
	link.strokeDashStyle = DashStyle.Dash;	
	link.headBrush = { type: 'SolidBrush', color: '#FFFFFF' };
	
	link = diagram.factory.createDiagramLink(requestData, clientLane);
	link.headShape = "Triangle";
	link.baseShape = "Circle";
	link.headShapeSize = 3.0;
	link.baseShapeSize = 3.0;
	link.text = "Request From Client";
	link.strokeDashStyle = DashStyle.Dash;
	link.headBrush = { type: 'SolidBrush', color: '#FFFFFF' };
	
	link = diagram.factory.createDiagramLink(bpmnEndMessage1, clientLane);
	link.headShape = "Triangle";
	link.baseShape = "Circle";
	link.headShapeSize = 3.0;
	link.baseShapeSize = 3.0;
	link.text = "Cargo Description";
	link.strokeDashStyle = DashStyle.Dash;
	link.headBrush = { type: 'SolidBrush', color: '#FFFFFF' };
	
	link = diagram.factory.createDiagramLink(bpmnEndMessage1, clientLane);
	link.headShape = "Triangle";
	link.baseShape = "Circle";
	link.headShapeSize = 3.0;
	link.baseShapeSize = 3.0;
	link.text = "Refusal";
	link.strokeDashStyle = DashStyle.Dash;
	link.startPoint = new Point(202, 58);
	link.endPoint = new Point(202, 30);
	link.textAlignment = MindFusion.Diagramming.Alignment.Near;
	link.headBrush = { type: 'SolidBrush', color: '#FFFFFF' };
	
	link = diagram.factory.createDiagramLink(bpmnStartMessage, bpmnInclusive);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(bpmnInclusive, bpmnEndMessage);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(bpmnInclusive, bpmnEndMessage1);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(bpmnEndMessage, bpmnEndCancel);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(bpmnInclusive, bpmnIntermTimer);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.startPoint = new Point(202, 95);
	link.ndPoint = new Point(225, 114);
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(bpmnIntermTimer, bpmnTerminate);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(newApp, pkgGoods);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	link = diagram.factory.createDiagramLink(pkgGoods, bpmnEndMessage2);
	link.headShape = "Triangle";
	link.baseShape = "Circle";
	link.headShapeSize = 3.0;
	link.baseShapeSize = 3.0;
	link.strokeDashStyle = DashStyle.Dash;
	link.headBrush = { type: 'SolidBrush', color: '#FFFFFF' };
	
	link = diagram.factory.createDiagramLink(pkgGoods, clientLane);
	link.headShape = "Triangle";
	link.baseShape = "Circle";
	link.headShapeSize = 3.0;
	link.baseShapeSize = 3.0;
	link.text = "Invoice for Payment";
	link.strokeDashStyle = DashStyle.Dash;
	link.startPoint = new Point(184, 144);
	link.endPoint = new Point(280, 30);
	link.headBrush = { type: 'SolidBrush', color: '#FFFFFF' };
	
	link = diagram.factory.createDiagramLink(decision, bpmnEndMessage1);
	link.headShape = "Triangle";
	link.headShapeSize = 3.0;
	link.startPoint = new Point(56, 110);
	link.endPoint = new Point(196, 64);
	link.headBrush = { type: 'SolidBrush', color: '#7F7F7F' };
	
	diagram.routeAllLinks();
	
	
}

//assign the selected color to the newly created node
function onNodeCreated(sender, args)
{
	var node = args.node;
	node.brush = { type: 'SolidBrush', color: backgroundColor };
	
	
	if( node instanceof ContainerNode )
	{
		node.captionBackBrush = { type: 'SolidBrush', color: backgroundColor };
	    node.brush = { type: 'SolidBrush', color: '#ffffff' };
	}		
	
	
}

//create links with the selected style values
function onLinkCreated(sender, args)
{
	var link = args.link;
	link.strokeDashStyle = linkDashStyle;
	link.headShape = headShape;
	link.baseShape = baseShape;
	link.headShapeSize = 3.0;
	link.baseShapeSize = 3.0;
	link.headBrush = { type: 'SolidBrush', color: headBrush };
	link.baseBrush = { type: 'SolidBrush', color: '#FFFFFF' };
	link.textAlignment = MindFusion.Diagramming.Alignment.Near;
}



function onSequence()
{
	var btnSrc = document.getElementById("sequence").src; 	
	linkDashStyle = DashStyle.Solid;
	headShape = "Triangle";
	baseShape = null;
	headBrush = "#7F7F7F";
	document.getElementById("sequence").src = "sequenceOn.png";
	document.getElementById("message").src = "messageOff.png";
	document.getElementById("association").src = "associationOff.png";
}

function onMessage()
{
	var btnSrc = document.getElementById("message").src; 
	linkDashStyle = DashStyle.Dash;
	headShape = "Triangle";
	baseShape = "Circle";
	headBrush = "white";
	document.getElementById("message").src = "messageOn.png";
	document.getElementById("sequence").src = "sequenceOff.png";
	document.getElementById("association").src = "associationOff.png";
		
}

function onAssociation()
{
	var btnSrc = document.getElementById("association").src; 
	linkDashStyle = DashStyle.Dash;
	headShape = null;
	baseShape = null;
	document.getElementById("association").src = "associationOn.png";
	document.getElementById("sequence").src = "sequenceOff.png";
	document.getElementById("message").src = "messageOff.png";
		
}

function updateBackground(event) {
   backgroundColor = event.target.value;
   var selectedItem = diagram.selection.items[0];
		if(selectedItem)
			selectedItem.brush = { type: 'SolidBrush', color: backgroundColor };  
}

function clearItems()
{
	diagram.clearAll();
}

function save()
{
	localStorage.setItem('bpmn', diagram.toJson());
}

function load()
{
	var bpmn = localStorage.getItem('bpmn');
	if(bpmn)
		diagram.fromJson(bpmn);
}





