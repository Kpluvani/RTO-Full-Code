import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "@/utils/FormData";

const { Text } = Typography;

const Form22 = ({application}) => {
	console.log("Form22 application data:", application);
	
	const {
		makerModel,
		vehicleChassis,
		engineNo,
		fuel,
		norms,
	} = extractApplicationData(application);

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
		doc.text("FORM 22", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 6;
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10.5);
		doc.text("[Refer Rule 47(1)(g)]", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 8;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(12.5);

		const heading =
			"ROAD-WORTHINESS CERTIFICATE \nFor \nCompliance to Emission and Noise Standards";
        
        const subHeadingdec =
            // This line is not bolded because we do not set the font to bold before rendering it.
            "(To be issued by the Manufacturer or Importer or Registered Association in case of E-rickshaw or E-cart, along with the vehicle)";
		
        const headingLines = doc.splitTextToSize(heading, printableWidth);
		const subheadingLinesdec = doc.splitTextToSize(subHeadingdec, printableWidth);

		doc.text(headingLines, pageWidth / 2, cursorY, { align: "center", lineHeightFactor: 1.2 });
		cursorY += headingLines.length * 5.2;

        cursorY += 2;
        doc.setFont("helvetica", "normal");

		doc.text(subheadingLinesdec, pageWidth / 2, cursorY, { align: "center", lineHeightFactor: 1.2 });
		cursorY += subheadingLinesdec.length * 5.2 + 6;

		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		cursorY += 6;
		doc.text("\tIt is certified that the following vehicle complies with the provisions of the Motor Vehicles Act, \n1988, and the rules made thereunder:", marginLeft + 6, cursorY);
		cursorY += 12;

		doc.setFont("helvetica", "bold");
		doc.text(`${makerModel}`, marginLeft + 85, cursorY);
		cursorY += 1;
		doc.setFont("helvetica", "normal");
        doc.text("1.  Model/Commercial Name of the vehicle : ....................................................................................", marginLeft + 6, cursorY);
		cursorY += 6;
		
		doc.setFont("helvetica", "bold");
		doc.text(`${vehicleChassis}`, marginLeft + 45, cursorY);
		cursorY += 1;
		doc.setFont("helvetica", "normal");
        doc.text("2.  Chassis number : .........................................................................................................................\n\t(Example: - Vehicle Identification Number (VIN) or ATIN or PIN/Trailer Identification Number)", marginLeft + 6, cursorY);
		cursorY += 12;
        
		doc.setFont("helvetica", "bold");
		doc.text(`${engineNo}`, marginLeft + 133, cursorY);
		cursorY += 1;
		doc.setFont("helvetica", "normal");
		doc.text("3.  Engine number (Motor number, in case of Battery-Operated Vehicles): ....................................", marginLeft + 6, cursorY);
		cursorY += 6;
		
		doc.setFont("helvetica", "bold");
		doc.text(`${norms}`, marginLeft + 60, cursorY);
		cursorY += 1;
		doc.setFont("helvetica", "normal");
        doc.text("4. Applicable Emission norms : ........................................................................................................\n\t(Example :-Bharat Stage-IV/VI /TREM-III /Equivalent, as permitted under the Act, Select NA \n\tfor Battery Operated Vehicle)", marginLeft + 6, cursorY);
		cursorY += 16;
        doc.text("5. Emission, Sound Level for Horn and Pass by noise values of the above vehicle model, obtained \n  during Type Approval Testing as per Central Motor Vehicle Rules, 1989 are given below:", marginLeft + 6, cursorY);
		cursorY += 15;
        doc.text("\t(i) Type Approval certificate No. : ..................................................", marginLeft + 6, cursorY);
		cursorY += 6;

		doc.setFont("helvetica", "bold");
		doc.text(`${fuel}`, marginLeft + 47, cursorY);
		cursorY += 1;
		doc.setFont("helvetica", "normal");
        doc.text("\t(ii) Type of Fuel : .................................................................................\n\t     (Example : Petrol/Diesel/CNG/LPG/Dual/Biofuel/Hybrid etc.)", marginLeft + 6, cursorY);
		cursorY += 12;
        doc.text("\t(iii) Emission values for vehicles:", marginLeft + 6, cursorY);
		cursorY += 6;

		// New page for TABLE
		doc.addPage();
		cursorY = 18;

		// Table title
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10.5);
		doc.text("TABLE", pageWidth / 2, cursorY, { align: "center" });
		cursorY += 5.5;
		doc.setFont("helvetica", "normal");
		doc.text(
			"Positive Ignition Engine or Compression Ignition Engine Vehicles",
			pageWidth / 2,
			cursorY,
			{ align: "center" }
		);
		cursorY += 8;

		// Table grid settings
		const colWidths = [7, 65, 66, 36]; // total 188 ~ printableWidth (pageWidth-36)
		const startX = marginLeft;
		let rowY = cursorY;
		const rowHeight = 7;
		const headerHeight = 10;

		const drawRect = (x, y, w, h) => doc.rect(x, y, w, h);
		const drawText = (txt, x, y, opts = {}) => doc.text(txt, x, y, opts);

		// Header row 1
		drawRect(startX, rowY, colWidths[0], headerHeight);
		drawRect(startX + colWidths[0], rowY, colWidths[1], headerHeight);
		drawRect(startX + colWidths[0] + colWidths[1], rowY, colWidths[2], headerHeight);
		drawRect(startX + colWidths[0] + colWidths[1] + colWidths[2], rowY, colWidths[3], headerHeight);
		doc.setFont("helvetica", "bold");
		drawText("No.", startX + 1, rowY + 5);
		drawText("Pollutant (as applicable)", startX + colWidths[0] + 2, rowY + 5);
		drawText("Units (as applicable)", startX + colWidths[0] + colWidths[1] + 2, rowY + 5);
		drawText("Value (up to 3\ndecimal places)", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, rowY + 3.5);
		rowY += headerHeight;

		doc.setFont("helvetica", "normal");

		const rows = [
			["1.", "Carbon Monoxide (CO)", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["2.", "Hydrocarbon, (THC / HC)", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["3.", "Non-Methane Hydrocarbon (NMHC)", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["4.", "Oxides of Nitrogen (NOx)", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["5.", "HC + NOx", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["6.", "THC + NOx", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["7.", "Methane (CH4)", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["8.", "Ammonia (NH3)", "PPM", ""],
			["9.", "Mass of Particulate Matter (PM)", "mg/km or mg/kWh or g/kWh or  g/kWh", ""],
			["10.", "Number of Particles (PN)", "Numbers/km or Numbers/kWh", ""],
		];

        rows.forEach((r) => {
            // Wrap text per column
            const srText = r[0];
            const polLines = doc.splitTextToSize(r[1], colWidths[1] - 3);
            const unitLines = doc.splitTextToSize(r[2], colWidths[2] - 3);
            const valueLines = doc.splitTextToSize(r[3] || "", colWidths[3] - 3);

            const maxLines = Math.max(1, polLines.length, unitLines.length, valueLines.length);
            const perLine = 4.6; // approx height per line
            const padding = 2.4; // vertical padding
            const cellHeight = Math.max(rowHeight, maxLines * perLine + padding);

            // cell boxes with computed height
            drawRect(startX, rowY, colWidths[0], cellHeight);
            drawRect(startX + colWidths[0], rowY, colWidths[1], cellHeight);
            drawRect(startX + colWidths[0] + colWidths[1], rowY, colWidths[2], cellHeight);
            drawRect(startX + colWidths[0] + colWidths[1] + colWidths[2], rowY, colWidths[3], cellHeight);

            // text baseline
            const baseY = rowY + 4.6;
            drawText(srText, startX + 1.5, baseY);
            doc.text(polLines, startX + colWidths[0] + 2, baseY, { lineHeightFactor: 1.2 });
            doc.text(unitLines, startX + colWidths[0] + colWidths[1] + 2, baseY, { lineHeightFactor: 1.2 });
            if ((r[3] || "").length > 0) {
                doc.text(valueLines, startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, baseY, { lineHeightFactor: 1.2 });
            }

            rowY += cellHeight; // advance by the tallest cell height for this row
        });

		cursorY = rowY + 6;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		const notes = [
			"(iv) Noise level (A-weighted):",
			"(a) Horn (for all vehicles other than agricultural tractors and construction equipment vehicles) as installed on the vehicle ............... dB(A);",
			"(b) Sound level of pass by (for all vehicles) ............... dB(A);",
			"(c) Driver-operated or Operator’s ear level— (as applicable for agricultural tractors and construction equipment vehicles) ............... dB(A).",
		];
		notes.forEach((n) => {
            const lines = doc.splitTextToSize(n, printableWidth);
            doc.text(lines, marginLeft, cursorY, { lineHeightFactor: 1.35 });
            cursorY += lines.length * 5.2 + 2; // Adjust spacing based on line count
        });
        
        const rawNotes = `
        Note 1: This Form shall be issued with the signature of the manufacturer or importer or registered association, as the case may be. A facsimile signature or printed in Form itself is not acceptable in ink under the hand and seal, as the case may be.
        Note 2: In the case of multiple combinations, values pertaining to any one test result shall be printed for V2, V3 classes - average value of the test results for the subject vehicles may only be listed.
        Note 3: While printing Form 22, the relevant pollutants in the Table as applicable for the subject vehicles may only be listed.
        `;

        // Step 1: Extract Note blocks using regex
        const noteMatches = rawNotes.match(/Note \d+:.*?(?=(Note \d+:|$))/gs);

        noteMatches.forEach((fullNote) => {
        // Extract the bold part (e.g., "Note 1:") and the rest
        const match = fullNote.match(/^(Note \d+:)([\s\S]*)$/);
        if (!match) return;

        const [, boldPart, normalPart] = match;

        // Step 2: Print the bold "Note X:"
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.2);
        doc.text(boldPart, marginLeft, cursorY);

        // Step 3: Print the remaining paragraph, wrapped under it
        doc.setFont("helvetica", "normal");

        const wrappedText = doc.splitTextToSize(normalPart.trim(), printableWidth);
        cursorY += 5.2;
        doc.text(wrappedText, marginLeft, cursorY, { lineHeightFactor: 1.35 });

        // Step 4: Update Y position
        cursorY += wrappedText.length * 5.2 + 4; // extra spacing after each note
        });

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

export default Form22;