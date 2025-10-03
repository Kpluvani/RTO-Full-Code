import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";

const { Text } = Typography;

const Form65 = () => {
	const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const marginLeft = 18;
		const marginRight = 18;
		const printableWidth = pageWidth - marginLeft - marginRight;
		let y = 20;

		// Titles
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.text("FORM 65", pageWidth / 2, y, { align: "center" });
		y += 6;
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10);
		doc.text("[Refer rule 180(5)]", pageWidth / 2, y, { align: "center" });
		y += 7;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.2);
		doc.text("APPLICATION FORM FOR ISSUE OF DUPLICATE PRELIMINARY", pageWidth / 2, y, { align: "center" });
		y += 5.2;
		doc.text("REGISTRATION CERTIFICATE / REGISTRATION CERTIFICATE FOR", pageWidth / 2, y, { align: "center" });
		y += 5.2;
		doc.text("AUTOMATED TESTING STATION", pageWidth / 2, y, { align: "center" });
		y += 10;

		// Address To block
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.5);
		doc.text("To", marginLeft, y);
		y += 6;
		doc.text("The Registering Authority", marginLeft, y);
		y += 6;
		doc.text("..........................................................", marginLeft, y);
		y += 10;

		// Body para 1
		const para1 =
			"The Preliminary Registration Certificate / Registration Certificate of my/ our Automated Testing Station, the certificate Number ...................................... has been lost/destroyed/completely written off/soiled/torn/mutilated in the following circumstances:";
		const lines1 = doc.splitTextToSize(para1, printableWidth);
		doc.text(lines1, marginLeft, y, { lineHeightFactor: 1.35 });
		y += lines1.length * 5.2 + 6;

		// Dotted description area
		doc.text(".................................................................................................................................", marginLeft, y);
		y += 6;
		doc.text(".................................................................................................................................", marginLeft, y);
		y += 10;

		// Declarations (numbered with asterisk 1/We style)
		doc.setFont("helvetica", "normal");
		const declarations = [
			"*I/We hereby declare that to the best of my/ our knowledge the Preliminary Registration Certificate/Registration certificate has not been suspended or cancelled under the provisions of the Act or Rules made thereunder and the circumstances explained above are true.",
			"I/We do hereby apply for the issue of a duplicate Preliminary Registration Certificate/ Registration certificate.",
			"I/We hereby declare that I/ We on ......................... (date) have filed a complaint (copy enclosed) with the police about the loss of Preliminary Registration Certificate / Registration certificate immediately after the loss has been noticed.",
			"I/We hereby declare that I/ We shall intimate and surrender the certificate to the Registering Authority in case the lost certificate is found in future.",
		];
		declarations.forEach((p) => {
			const pls = doc.splitTextToSize(p, printableWidth);
			doc.text(pls, marginLeft, y, { lineHeightFactor: 1.35 });
			y += pls.length * 5.2 + 3.5;
		});

		// Signature block on right
		const rightX = pageWidth - marginRight;
		y += 6;
		doc.text("Name...............................................", rightX, y, { align: "right" });
		y += 6;
		doc.text("Date:................................................", rightX, y, { align: "right" });
		y += 6;
		doc.text("Signature...........................................", rightX, y, { align: "right" });

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

export default Form65;