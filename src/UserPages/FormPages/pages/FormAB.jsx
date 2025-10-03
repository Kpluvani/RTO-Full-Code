import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Text } = Typography;

const FormAB = ({application}) => {
	console.log("Application data in FormAB:", application);
	const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const margin = 12;
		const tableWidth = pageWidth - margin * 2;
		let cursorY = 20;

		// Title
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.text("FORM-A", pageWidth / 2, cursorY, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.text("NOTIFICATION REGARDING \"RECALL\" INFORMATION", pageWidth / 2, cursorY + 6, { align: "center" });
		cursorY += 12;

		// Top section as table (To | Date | Reference No.)
		autoTable(doc, {
			startY: cursorY,
			body: [
				[
					{ content: "To\nGovernment of India", rowSpan: 2, styles: { halign: "left", valign: "top" } },
					{ content: "Date:", styles: { halign: "left" } },
					"",
				],
				[
					{ content: "Reference No.:", styles: { halign: "left" } },
					"",
					""
				],
			],
			theme: "grid",
			styles: { fontSize: 10 },
			columnStyles: { 0: { cellWidth: tableWidth - 70 }, 1: { cellWidth: 32 }, 2: { cellWidth: 38 } },
			margin: { left: margin, right: margin },
			showHead: "never",
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Manufacturer contact details
		autoTable(doc, {
			startY: cursorY,
			head: [[{ content: "Manufacturer’s/importer/retrofitter Contact Details", styles: { halign: "left", fontStyle: "bold" ,lineWidth: 0.1,lineColor: [200, 200, 200] }, colSpan: 2 }]],
			body: [
				[{ content: "Manufacturer’s/importer/retrofitter Name", styles: { halign: "left" } }, ""],
				[{ content: "Address & Telephone Number", styles: { halign: "left" } }, ""],
			],
			theme: "grid",
			styles: { fontSize: 10 },
			headStyles:{
				fillColor:[255,255,255],
				textColor:[0,0,0],
				valign: 'middle',
				halign:'center',
			},
			columnStyles: { 0: { cellWidth: 85 }, 1: { cellWidth: tableWidth - 85 } },
			margin: { left: margin, right: margin },
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Product Details header
		autoTable(doc, {
			startY: cursorY,
			head: [[{ content: "Product Details", styles: { halign: "center", fontStyle: "bold", valign: 'middle' }, colSpan: 6 }]],
			body: [],
			theme: "grid",
			styles: { fontSize: 10 },
			headStyles:{
				fillColor: [255, 255, 255],   // white background
				textColor: [0, 0, 0],         // black text
				fontStyle: 'bold',
				halign: 'center',
				valign: 'middle',
				lineWidth: 0.1,               // ensures border is visible
				lineColor: [200, 200, 200]
			},
			margin: { left: margin, right: margin },
		});
		cursorY = doc.lastAutoTable.finalY;

		console.log(application?.Vehicaldetail?.MakerModel?.name);

		const vehicleDetail = application?.VehicleDetail || {};
			const productName = [{
			vehical_name: vehicleDetail?.MakerModel?.name || '',
			vehical_category: vehicleDetail?.VehicleCategory?.name || '',
			vehical_variant: vehicleDetail?.VehicleType?.name || '',
			mfg_from: vehicleDetail?.mfg_from ? new Date(vehicleDetail.mfg_from).toLocaleDateString('en-GB') : '',
			mfg_to: vehicleDetail?.mfg_to ? new Date(vehicleDetail.mfg_to).toLocaleDateString('en-GB') : '',
			remarks: ''
		}];


		// Product Details grid with FROM/TO subcolumns
		autoTable(doc, {
			startY: cursorY,
			head: [[
				"Vehicle Name",
				"Vehicle Category (ex.\n2-wheeler/\n4 Wheeler)",
				"Vehicle Variant",
				{ content: "Manufacturing Period\n(DD/MM/YYYY)", colSpan: 2 },
				"Remarks"
			],[
				"",
				"",
				"",
				"(FROM)",
				"(TO)",
				""
			]],
			body: productName.map(item => [
				item.vehical_name,
				item.vehical_category,
				item.vehical_variant,
				item.mfg_from,
				item.mfg_to,
				item.remarks
			]),
			theme: "grid",
			styles: { fontSize: 9, halign: "center", valign: "middle", lineWidth: 0.1, lineColor: [200, 200, 200] },
			headStyles:{
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
				halign: 'center',
				valign: 'middle',
				lineWidth: 0.1,
				lineColor: [200, 200, 200]
			},
			columnStyles: {
				0: { cellWidth: 38 },
				1: { cellWidth: 40 },
				2: { cellWidth: 32 },
				3: { cellWidth: 30 },
				4: { cellWidth: 30 },
				5: { cellWidth: tableWidth - (38 + 40 + 32 + 30 + 30) },
			},
			margin: { left: margin, right: margin },
		});
		cursorY = doc.lastAutoTable.finalY + 2;


		// VIN Numbers Range row
		autoTable(doc, {
			startY: cursorY,
			body: [[
				{ content: "VIN Numbers Range (Vehicle Identification No.) of target 'Recall' vehicles (for Domestic Market):", styles: { halign: "left" } },
				""
			]],
			theme: "grid",
			styles: { fontSize: 10 },
			columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: tableWidth - 120 } },
			margin: { left: margin, right: margin },
			showHead: "never",
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Total number row
		autoTable(doc, {
			startY: cursorY,
			body: [[{ content: "Total number of target 'Recall' vehicles:", styles: { halign: "left" } }, "" ]],
			theme: "grid",
			styles: { fontSize: 10 },
			columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: tableWidth - 90 } },
			margin: { left: margin, right: margin },
			showHead: "never",
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Description of defect multi-line box
		autoTable(doc, {
			startY: cursorY,
			body: [ [ { content: "Description of defect:", styles: { halign: "left" } } ], [ [" "] ], [ [" "] ] ],
			theme: "grid",
			styles: { fontSize: 10, cellHeight: 8 },
			margin: { left: margin, right: margin },
			showHead: "never",
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Remedial Actions multi-line box
		autoTable(doc, {
			startY: cursorY,
			body: [ [ { content: "Remedial Actions:", styles: { halign: "left" } } ], [ [" "] ], [ [" "] ] ],
			theme: "grid",
			styles: { fontSize: 10, cellHeight: 8 },
			margin: { left: margin, right: margin },
			showHead: "never",
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Proposal date + Campaign end date
		autoTable(doc, {
			startY: cursorY,
			body: [
				[ { content: "Proposal of Date of 'Recall' Announcement:", styles: { halign: "left" } }, "" ],
				[ { content: "Campaign End Date:", styles: { halign: "left" } }, "" ],
			],
			theme: "grid",
			styles: { fontSize: 10 },
			columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: tableWidth - 90 } },
			margin: { left: margin, right: margin },
			showHead: "never",
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Any other relevant information (two lines)
		autoTable(doc, {
			startY: cursorY,
			body: [ [ { content: "Any other relevant information:", styles: { halign: "left" } } ], [ [" "] ], [ [" "] ] ],
			theme: "grid",
			styles: { fontSize: 10, cellHeight: 8 },
			margin: { left: margin, right: margin },
			showHead: "never",
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		// Authorized Signatory with Date cells
		autoTable(doc, {
			startY: cursorY,
			body: [[ { content: "Authorized Signatory", styles: { halign: "left" } }, { content: "Date:", styles: { halign: "left" } }, "" ]],
			theme: "grid",
			styles: { fontSize: 10 },
			columnStyles: { 0: { cellWidth: tableWidth - 60 }, 1: { cellWidth: 20 }, 2: { cellWidth: 40 } },
			margin: { left: margin, right: margin },
			showHead: "never",
		});

		// --- Second Page: FORM-B & ANNEXURE-XIII ---
		doc.addPage();
		const pageWidth2 = doc.internal.pageSize.getWidth();
		const margin2 = margin;
		const textWidth = pageWidth2 - margin2 * 2;
		let y2 = 20;

		// FORM-B title
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11.5);
		doc.text("FORM-B", pageWidth2 / 2, y2, { align: "center" });
		y2 += 8;

		// a-d bullet items with dotted lines
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.5);
		const bullets = [
			"a.\tThe number of recall products involved in each recall : .................................",
			"b.\tThe number of vehicles on which the recall activity under each recall has\n\t\tbeen carried out during the previous period : ...............................................",
			"c.\tExpected date for completion of recall activity : .................................................",
			"d.\tAny other relevant information as required by the Designated Officer: :\n\t\t...............................................................",
		];
		bullets.forEach((line) => {
			const lines = doc.splitTextToSize(line, textWidth);
			doc.text(lines, margin2, y2, { lineHeightFactor: 1.35 });
			y2 += lines.length * 5.2 + 2;
		});

		// ANNEXURE-XIII title and rule
		y2 += 6;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.text("ANNEXURE-XIII", pageWidth2 / 2, y2, { align: "center" });
		y2 += 6;
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10);
		doc.text("[Refer rule 150A]", pageWidth2 / 2, y2, { align: "center" });
		y2 += 8;

		// Main Annexure heading
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		const annexureHeading = "PROCEDURE FOR INVESTIGATION OF MOTOR VEHICLE ACCIDENTS";
		doc.text(doc.splitTextToSize(annexureHeading, textWidth), pageWidth2 / 2, y2, { align: "center" });
		y2 += 10;

		// Helper to draw numbered item with subheading and paragraph
		const addNumbered = (num, subheading, body) => {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(10.5);
			const headText = `${num}.  ${subheading}`;
			doc.text(headText, margin2, y2);
			y2 += 6;
			doc.setFont("helvetica", "normal");
			doc.setFontSize(10.5);
			const lines = doc.splitTextToSize(body, textWidth);
			doc.text(lines, margin2, y2, { lineHeightFactor: 1.35 });
			y2 += lines.length * 5.2 + 4;
		};

		addNumbered(
			1,
			"Investigation of road accident cases by the Police",
			"Immediately on receipt of the information of a road accident, the Investigating Officer of Police shall inspect the site of accident, take photographs/videos of scene of the accident and the vehicle(s) involved in the accident and prepare a site plan, drawn to scale, as to indicate the layout and width, etc., of the road(s) or place(s), as the case may be, the position of vehicle(s), and person(s) involved, and such other facts as may be relevant. In injury cases, the Investigating Officer shall also take the photographs of the injured in the hospital. The Investigating Officer shall conduct spot enquiry by examining the eyewitnesses/bystanders."
		);

		addNumbered(
			2,
			"Intimation of accident to the Claims Tribunal and Insurance Company within forty-eight (48) hours",
			"The Investigating Officer shall intimate the accident to the Claims Tribunal within forty-eight (48) hours of the accident, by submitting the First Accident Report (FAR) in Form-I. If the particulars of insurance policy are available, the intimation of the accident in Form-I shall also be given to the Nodal Officer of the concerned Insurance Company of the offending vehicle. A copy of Form-I shall also be provided to the victim(s), the State Legal Services Authority, Insurer and shall also be uploaded on the website of State Police, if available."
		);

		addNumbered(
			3,
			"Rights of victims of Road Accident and Flow Chart of the Scheme mentioned in Form II to be furnished by the Investigating Officer to the Victim(s)",
			"The Investigating Officer shall furnish the description of the rights of victim(s) of road accidents and flow chart of the Scheme mentioned in Form-II, to the victim(s), or their legal representatives, within ten (10) days of the accident. The Investigating Officer shall also file a copy of Form-II along with the Detailed Accident Report (DAR)."
		);

		addNumbered(
			4,
			"Driver’s Form to be submitted by the driver to the Investigating Officer",
			"The Investigating Officer shall provide a blank copy of Form-III to the driver of the vehicle(s) involved in the accident and the driver shall furnish the relevant information in Form-III to the Investigating Officer, within thirty (30) days of the accident."
		);

		addNumbered(
			5,
			"Owner’s Form to be submitted by the owner",
			"The Investigating Officer shall provide a blank copy of Form-IV to the owner(s) of the vehicle(s) involved in the accident and the owner(s) shall furnish the relevant information in Form-IV to the investigating Officer, within thirty (30) days of the accident."
		);

		// Open PDF
		const pdfBlob = await new Promise((resolve) => {
			const blob = doc.output("blob");
			resolve(blob);
		});
		const pdfUrl = URL.createObjectURL(pdfBlob);
		await new Promise((resolve) => {
			setTimeout(() => {
				window.open(pdfUrl);
				resolve();
			}, 300);
		});
	};

	return (
		<Typography className="main">
			<Button type="primary" onClick={handleExportPdf}>Export PDF</Button>
		</Typography>
	);
};

export default FormAB;