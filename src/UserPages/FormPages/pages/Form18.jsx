import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";

const { Text } = Typography;

const Form18 = () => {
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
		doc.text("FORM 18", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 6;
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10.5);
		doc.text("[Refer Rule 38(1)]", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 8;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(12.5);
		const heading =
			"INTIMATION OF LOSS OR DESTRUCTION OF A TRADE CERTIFICATE\nAND APPLICATION FOR DUPLICATE";
		const headingLines = doc.splitTextToSize(heading, printableWidth);
		doc.text(headingLines, pageWidth / 2, cursorY, { align: "center", lineHeightFactor: 1.2 });
		cursorY += headingLines.length * 5.2 + 6;

		// Address block
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		doc.text("To", marginLeft, cursorY);
		cursorY += 8;
		doc.text("The Registering Authority,", marginLeft + 6, cursorY);
		cursorY += 8;
		// dotted placeholder lines
		doc.text(".........................................................", marginLeft + 6, cursorY);
		cursorY += 8;
		doc.text(".........................................................", marginLeft + 6, cursorY);
		cursorY += 12;

		// Body paragraphs
		const p1 =
			"The trade certificate issued to me/us bearing number .................... and valid up to ............ has been mutilated/soiled/lost/destroyed* in the following circumstances and is not in my possession for the reasons specified below:—";
		const p2 = "I/We surrender the *mutilated/soiled trade certificate.";
		const p3 =
			"I/We hereby declare that to my/our knowledge the trade certificate has not been either suspended or cancelled under the provisions of the Rules and that the above certificate is not in the use of anyone else. I undertake to surrender the trade certificate if it is found by me or restored to me.";
		const p4 =
			"I/We hereby deposit the fee of Rs. ............ and apply for the issue of duplicate trade certificate.";

		const addParagraph = (text) => {
			const lines = doc.splitTextToSize(text, printableWidth);
			doc.text(lines, marginLeft, cursorY, { align: "left", lineHeightFactor: 1.35 });
			cursorY += lines.length * 5 + 6;
		};

		addParagraph(p1);
		addParagraph(p2);
		addParagraph(p3);
		addParagraph(p4);

		// Signature and address block (right aligned)
		const rightBlockX = pageWidth - marginRight;
		doc.text("Signature or thumb impression of the applicant", rightBlockX, cursorY + 4, {
			align: "right",
		});
		cursorY += 12;
		doc.text("Address: .................................................................", rightBlockX, cursorY, {
			align: "right",
		});
		cursorY += 6;
		doc.text(".................................................................", rightBlockX, cursorY, {
			align: "right",
		});

		// Date on the left
		doc.text("Date ............................", marginLeft, cursorY + 10);

		// Footnote
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10);
		doc.text("* Strike out whichever is inapplicable.", marginLeft, doc.internal.pageSize.getHeight() - 18);

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

export default Form18;