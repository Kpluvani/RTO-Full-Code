import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Text } = Typography;

const Form66 = () => {
	const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const margin = 12;
		const tableWidth = pageWidth - margin * 2;
		let cursorY = 18;

		// Title block
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.text("FORM 66", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 6;
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10);
		doc.text("[Refer 175(7)]", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 6;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.5);
		doc.text("FORM FOR AUDIT AND ASSESSMENT REPORT OF", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 6;
		doc.text("AN AUTOMATED TESTING STATION", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 6;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(9.8);
		doc.text("(Pre-commissioning)", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 8;

		const head = { fillColor: [255,255,255], textColor: 0, fontStyle: "bold", halign: "center", valign: "middle", lineColor: [120,120,120], lineWidth: 0.25 };
		const styles = { fontSize: 9, cellPadding: 2.5, lineColor: [120,120,120], lineWidth: 0.25 };

		// Audit and Assessment details
		autoTable(doc, {
			startY: cursorY,
			body: [
				["Audit and Assessment Number", "", "Date of Audit and Assessment", ""],
				["Auditing Agency and Auditor’s Name", "", "Auditor’s Signature", ""],
				["Station Name", "", "Station Number", ""],
				[{content: 'Preliminary Registration Certificate Number'},{content:"",colSpan:'3'}],
				["Address", "", "Contact Number", ""],
			],
			theme: "grid",
			styles,
			headStyles: head,
			columnStyles: { 0: { cellWidth: 62 }, 1: { cellWidth: tableWidth/2 - 62 }, 2: { cellWidth: 62 }, 3: { cellWidth: tableWidth/2 - 62 } },
			margin: { left: margin, right: margin },
			showHead: "firstPage",
		});
		cursorY = doc.lastAutoTable.finalY + 4;

		// 1. Test equipment completeness and calibration (with Available and Functional split)
		autoTable(doc, {
			startY: cursorY,
			head: [[{ content: "1. Test equipment completeness and calibration", colSpan: 6, styles: { halign: "left" } }]],
			body: [],
			theme: "grid",
			styles,
			headStyles: head,
			margin: { left: margin, right: margin },
		});
		cursorY = doc.lastAutoTable.finalY;

		autoTable(doc, {
			startY: cursorY,
			head: [
				["Sl.\nNo.",
				"Equipment",
				{ content: "Available\n(Yes/No)", colSpan: 1 },
				{ content: "Functional\n(Yes/No)", colSpan: 1 },
				"Date of\ncalibration",
			]],
			body: [
				["a.", "Roller brake tester", "", "", ""],
				["b.", "Axle Weight Measurement", "", "", ""],
				["c.", "Suspension tester", "", "", ""],
				["d.", "Side slip tester", "", "", ""],
				["e.", "Joint Play tester", "", "", ""],
				["f.", "Automatic Steering Gear Play Detector", "", "", ""],
				["g.", "Automatic Head light tester", "", "", ""],
				["h.", "Opacimeter", "", "", ""],
				["i.", "Exhaust gas analyzer", "", "", ""],
				["j.", "Speedometer Tester/ Speed Governor Tester", "", "", ""],
				["k.", "Sound level meter", "", "", ""],
			],
			theme: "grid",
			styles,
			headStyles: head,
			columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: tableWidth - (12 + 28 + 28 + 32) }, 2: { cellWidth: 28 }, 3: { cellWidth: 28 }, 4: { cellWidth: 32 } },
			margin: { left: margin, right: margin },
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		autoTable(doc, {
			startY: cursorY,
			body: [[{ content: "Remarks:", styles: { halign: "left" ,minCellHeight: 28 } }]],
			theme: "grid",
			styles,
			margin: { left: margin, right: margin },
			showHead: "never",
		});

		// 2. Details of manpower employed
		doc.addPage();
		cursorY = 18;
		autoTable(doc, {
			startY: cursorY,
			head: [[{ content: "2. Details of manpower employed", colSpan: 5, styles: { halign: "left" } }]],
			body: [],
			theme: "grid",
			styles,
			headStyles: head,
			margin: { left: margin, right: margin },
		});
		cursorY = doc.lastAutoTable.finalY;

		autoTable(doc, {
			startY: cursorY,
			head: [["Sl.\nNo.", "Designation", "Number of Staff\nemployed", "Compliance with rules\n(Yes/No)", "Remarks"]],
			body: [
				["a.", "Centre Head/Manager", "", "", ""],
				["b.", "IT in charge/ System Analyst", "", "", ""],
				["c.", "Data Entry Operator", "", "", ""],
				["d.", "Driver (LMV/HMV)", "", "", ""],
				["e.", "Lane In charge/ Supervisor", "", "", ""],
				["f.", "Lane Operator", "", "", ""],
				["g.", "Maintenance Technician", "", "", ""],
			],
			theme: "grid",
			styles,
			headStyles: head,
			columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: tableWidth - (12 + 28 + 38 + 25) }, 2: { cellWidth: 28 }, 3: { cellWidth: 38 }, 4: { cellWidth: 25 } },
			margin: { left: margin, right: margin },
		});
		cursorY = doc.lastAutoTable.finalY + 2;

		autoTable(doc, {
			startY: cursorY,
			body: [[{ content: "Remarks:", styles: { halign: "left", minCellHeight: 10 } }]],
			theme: "grid",
			styles,
			margin: { left: margin, right: margin },
			showHead: "never",
		});

		// 3. Additional checks
		autoTable(doc, {
			startY: doc.lastAutoTable.finalY + 6,
			head: [[{ content: "3. Additional checks", colSpan: 4, styles: { halign: "left" } }]],
			body: [],
			theme: "grid",
			styles,
			headStyles: head,
			margin: { left: margin, right: margin },
		});

		autoTable(doc, {
			startY: doc.lastAutoTable.finalY,
			head: [["Sl.\nNo.", "Check", "Yes", "No"]],
			body: [
				["a.", "IT system as per prescribed guidelines", "", ""],
				["b.", "Test result data masked and encrypted", "", ""],
				["c.", "CCTV cameras installed and functional", "", ""],
				["d.", "Test data kept in secure facility and uploaded on VAHAN", "", ""],
				["e.", "Lane screens do not display any test results", "", ""],
				["f.", "Infrastructure facilities as per guidelines", "", ""],
				["g.", "Appointment booking only through electronic portal", "", ""],
				["h.", "Fire safety clearance", "", ""],
				["i.", "Adequate provision for parking and security of the Vehicles", "", ""],
			],
			theme: "grid",
			styles,
			headStyles: head,
			columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: tableWidth - (12 + 20 + 20) }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 } },
			margin: { left: margin, right: margin },
		});

		autoTable(doc, {
			startY: doc.lastAutoTable.finalY + 2,
			body: [[{ content: "Result (Approved/ Not Approved):", styles: { halign: "left" } }]],
			theme: "grid",
			styles,
			margin: { left: margin, right: margin },
			showHead: "never",
		});

		autoTable(doc, {
			startY: doc.lastAutoTable.finalY,
			body: [[{ content: "Corrective actions required (in case of non-approval):", styles: { halign: "left", minCellHeight: 12 } }]],
			theme: "grid",
			styles,
			margin: { left: margin, right: margin },
			showHead: "never",
		});

		const blob = doc.output("blob");
		const url = URL.createObjectURL(blob);
		window.open(url);
	};

	return (
		<Typography className="main">
			<Button type="primary" onClick={handleExportPdf}>Export PDF</Button>
		</Typography>
	);
};

export default Form66;