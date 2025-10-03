import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";

const { Text } = Typography;

const Form20B = ({application}) => {
	const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const marginLeft = 18;
		const marginRight = 18;
		const printableWidth = pageWidth - marginLeft - marginRight;
		let cursorY = 18;

		// Title block
		doc.setFont("helvetica", "bold");
		doc.setFontSize(16);
		doc.text("FORM 20B", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 6;
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10.5);
		doc.text("[Refer Rule 53B(2)]", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 8;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(12.5);
		const heading =
			"APPLICATION FOR EXTENSION OF PERIOD OF";
        const subHeading =
            "TEMPORARY REGISTRATION";
		const headingLines = doc.splitTextToSize(heading, printableWidth);
		const subheadingLines = doc.splitTextToSize(subHeading, printableWidth);
		doc.text(headingLines, pageWidth / 2, cursorY, { align: "center", lineHeightFactor: 1.2 });
		cursorY += headingLines.length * 5.2;
		doc.text(subheadingLines, pageWidth / 2, cursorY, { align: "center", lineHeightFactor: 1.2 });
		cursorY += subheadingLines.length * 5.2 + 6;
		// Address block
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		cursorY += 6;
		doc.text("Temporary Registration Mark ......................................................................................................", marginLeft + 6, cursorY);
		cursorY += 6;
		// dotted placeholder lines
// Fetch owner name dynamically
		// Fetch owner name dynamically
		const ownerName = application?.OwnerDetail?.owner_name || "";

		// Print the owner name above the dotted line
		doc.setFont("helvetica", "bold");
		doc.text(ownerName, marginLeft + 35, cursorY);
		cursorY += 1; // move slightly down to leave space between name and line

		// Draw the dotted line below the name
		doc.setFont("helvetica", "normal");
		doc.text("Owner Name : .................................................................................................", marginLeft + 6, cursorY);
		cursorY += 6;

		doc.text("Date of grant of Temporary Registration .....................................................................................", marginLeft + 6, cursorY);
		cursorY += 6;
		doc.text("Initial Period of validity of Temporary Registration", marginLeft + 6, cursorY);
		cursorY += 6;
		doc.text("as per Form 23B from ...................... to ........................", marginLeft + 6, cursorY);
		cursorY += 6;
		doc.text("Periods of Extension sought :", marginLeft + 6, cursorY);
		cursorY += 6;
        doc.text("from ...................... to ........................", marginLeft + 6, cursorY);
		cursorY += 6;
        doc.text("from ...................... to ........................", marginLeft + 6, cursorY);
		cursorY += 6;
		doc.text("Reason for extension: For being fitted with a body/due to any unforeseen circumstances beyond \nthe control of the owner", marginLeft + 6, cursorY);
		cursorY += 12;
		doc.text("......................................................................................................................................................", marginLeft + 6, cursorY);
		cursorY += 6;
		doc.text("Fee Paid Details: ..........................................................................................................................", marginLeft + 6, cursorY);
		cursorY += 12;
		doc.text("Date \t\t\t\t\t\t\t\t\t\t\t\t\t[Signature of the owner]", marginLeft + 6, cursorY);

		const pdfBlob = await new Promise((resolve) => {
			const blob = doc.output('blob');
			resolve(blob);
		});
		const pdfUrl = URL.createObjectURL(pdfBlob);
		await new Promise((resolve) => {
			setTimeout(() => {
				window.open(pdfUrl);
				resolve();
			}, 1000);
		});
	};

	return (
		<Typography className="main">
			<Button type="primary" onClick={handleExportPdf}>Export PDF</Button>
		</Typography>
	);
};

export default Form20B;