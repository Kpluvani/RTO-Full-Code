import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";

const { Text } = Typography;

const Form40 = ({application}) => {

    const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const marginLeft = 18;
		const marginRight = 18;
		const printableWidth = pageWidth - marginLeft - marginRight;
		let y = 18;

        const addTitle = (t, size = 11, style = "bold") => {
			doc.setFont("helvetica", style);
			doc.setFontSize(size);
			doc.text(t, pageWidth / 2, y, { align: "center" });
			y += 6;
		};

        const addItem = (numText, desc, withRightDots = true) => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.2);
          
            const leftColumnWidth = printableWidth - 50; // 50mm reserved for right column
            const rightColumnX = marginLeft + leftColumnWidth;
          
            // Add number + description in left column
            const leftLines = doc.splitTextToSize(numText ? `${numText} ${desc}` : desc, leftColumnWidth);
            doc.text(leftLines, marginLeft, y, { lineHeightFactor: 1.35 });
          
            // Add right column dots if needed
            if (withRightDots) {
              const blockHeight = leftLines.length * 5.2; // approximate height
              doc.text("....................................", rightColumnX, y, { align: "left" });
              y += blockHeight + 3; // move Y below the row
            } else {
              y += leftLines.length * 5.2 + 3; // move Y below the row
            }
          };

          const addHierarchicalItem = (mainNum, nestedNum, desc, valueOrDots = true, indentLevel = 0) => {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(10.2);
			const leftColumnWidth = printableWidth - 50;
			const rightColumnX = marginLeft + leftColumnWidth;
			const rightColumnWidth = 50; // Width for right column

			// Indentation for hierarchical items
			const baseIndent = marginLeft;
			const indentPerLevel = 8;
			const currentIndent = baseIndent + indentLevel * indentPerLevel;

			// Full left text
			let fullText = "";
			if (mainNum && nestedNum) fullText = `${mainNum}${nestedNum} ${desc}`;
			else if (mainNum) fullText = `${mainNum} ${desc}`;
			else fullText = desc;

			const availableWidth = leftColumnWidth - (currentIndent - marginLeft);
			const leftLines = doc.splitTextToSize(fullText, availableWidth);
			doc.text(leftLines, currentIndent, y, { lineHeightFactor: 1.35 });

			// Determine if we should show dots and if there's a value to display
			const shouldShowDots = typeof valueOrDots === 'boolean' ? valueOrDots : true;
			const hasValue = (typeof valueOrDots === 'string' || typeof valueOrDots === 'number') && valueOrDots !== '' && valueOrDots !== null && valueOrDots !== undefined;

			let totalBlockHeight = leftLines.length * 5.2;
			let valueLines = [];

			// Handle value display with wrapping
			if (hasValue) {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10.2);
				
				// Split the value text to fit in the right column width
				valueLines = doc.splitTextToSize(valueOrDots.toString(), rightColumnWidth);
				
				// Update total block height to accommodate value lines
				totalBlockHeight = Math.max(totalBlockHeight, valueLines.length * 5.2);
				
				doc.setFont("helvetica", "normal");
			}

			// Right column: dotted line (only if shouldShowDots is true)
			if (shouldShowDots) {
				// Draw dotted lines for each line of content
				const numDottedLines = Math.ceil(totalBlockHeight / 5.2);
				for (let i = 0; i < numDottedLines; i++) {
					// Create longer dotted line to fill the right column properly
					const dottedLine = ".".repeat(45); // Longer dotted line
					doc.text(dottedLine, rightColumnX, y + (i * 5.2), { align: "left" });
				}
			}

			// Draw the value text AFTER the dotted lines (so it appears on top)
			if (hasValue) {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10.2);
				
				// Draw each line of the value
				valueLines.forEach((line, index) => {
					doc.text(line, rightColumnX, y + (index * 5.2) - 1); // Slightly above dotted line
				});
				
				doc.setFont("helvetica", "normal");
			}

			y += totalBlockHeight + 3; // move Y below the row
		};


          doc.setFont("helvetica", "bold");
          doc.setFontSize(12.5);
          doc.text("FORM 40", pageWidth / 2, y, { align: "center" });
          y += 6;
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10.5);
          doc.text("[Refer Rule 63(2)]", pageWidth / 2, y, { align: "center" });
          y += 8;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12.5);
          const heading =
            "APPLICATION FOR GRANT OR RENEWAL OF LETTER OF AUTHORITY";

          const headingLines = doc.splitTextToSize(heading, printableWidth);
          doc.text(headingLines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
          y += headingLines.length * 5.2 + 8;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);

          doc.text("To", marginLeft, y);
          y += 6;
          doc.text("\tThe Registering Authority,", marginLeft, y);
          y += 6;
          doc.text("\t..........................................................", marginLeft, y);
          y += 6;
          doc.text("\tI/We................... address .................... hereby submit the following information,", marginLeft, y);
          y += 10;

          doc.text("namely:—", marginLeft, y);
          y += 10;

          addHierarchicalItem("1.", null, "Name of the applicant", "");
          addHierarchicalItem("2.", null, "Son/wife/daughter of", "");
          addHierarchicalItem("3.", null, "Address (proof to be enclosed)", "");
          addHierarchicalItem("4.", null, "Qualification of the applicant", "");
          addHierarchicalItem("5.", null, "Experience in automobile workshop", "");
          addHierarchicalItem("6.", null, "Whether involved/connected directly or indirectly in  transport business", "");
          addHierarchicalItem("7.", null, "Machinery and equipment", "");
          addHierarchicalItem("8.", null, "Staff engaged in different cadres", false);
          addHierarchicalItem("", null, "\t(i) Manager", "");
          addHierarchicalItem("", null, "\t(ii) Foreman", "");
          addHierarchicalItem("", null, "\t(iii) Mechanic", "");
          addHierarchicalItem("", null, "\t(iv) Helpers", "");
          addHierarchicalItem("", null, "\t(v) Other administrative staff", "");
          addHierarchicalItem("9.", null, " Particulars of a person as required under clause (a) of sub-rule (3) of rule 63 of the Central Motor Vehicles Rules", false);
          addHierarchicalItem("", null, "\t(a) Name", "");
          addHierarchicalItem("", null, "\t(b) Age", "");
          addHierarchicalItem("", null, "\t(c) Qualification in automobile engineering", "");
          addHierarchicalItem("", null, "\t(d) Actual experience in automobile workshop", "");
          addHierarchicalItem("", null, "\t(e) Name of firm with full address", "");
          addHierarchicalItem("", null, "\t(f) Driving experience of various types of transport vehicles", "");
          addHierarchicalItem("", null, "\t\t(i) Driving licence number", "");
          addHierarchicalItem("", null, "\t\t(ii) Issued by", "");
          addHierarchicalItem("", null, "\t\t(iii) Date of issue", "");
          addHierarchicalItem("", null, "\t\t(iv) Type of vehicle", "");

          doc.addPage();
          y = 18;

          addHierarchicalItem("", null, "\t\t(v) Period of validity of driving licence", "");
          addHierarchicalItem("", null, "\t\t(vi) Endorsement on driving licence", "");
          addHierarchicalItem("10.", null, " Proof of land owned by or hired by the applicant", "");
          addHierarchicalItem("11.", null, " Whether garage is equipped with following facilities", false);
          addHierarchicalItem("", null, "\t(i) Water supply", "");
          addHierarchicalItem("", null, "\t(ii) Electricity", "");
          addHierarchicalItem("", null, "\t(iii) Toilet", "");
          addHierarchicalItem("", null, "\t(iv) Rest room", "");
          addHierarchicalItem("12.", null, "Sources of finance", "");
          addHierarchicalItem("13.", null, " If application is for the renewal of letter of authority,",false);
          addHierarchicalItem("", null, "furnish following particulars, namely :—", false);
          addHierarchicalItem("", null, "\t(i) Number of existing letters of authority", "");
          addHierarchicalItem("", null, "\t(ii) Date of issue", "");
          addHierarchicalItem("", null, "\t(iii) Period of validity", "");
          addHierarchicalItem("", null, "\t(iv) If application is not submitted within time, state the reasons", "");
          addHierarchicalItem("", null, "\t(v) Whether letter of authority suspended/cancelled/surrendered", false);
          doc.text("\t  earlier. Further details ...........................................................................................................................", marginLeft ,y);
          y += 8;
          doc.text("14. I hereby solemnly declare that the information given above is true and correct. Further, I hereby declare that \n  I shall abide by the rules, regulations and conditions attached to the letter of authority and as prescribed in the \n  Motor Vehicles Act, 1988, and the Central Motor Vehicles Rules, 1989." ,marginLeft ,y);
          
        y += 25;
        doc.text("Dated .........................",marginLeft ,y);
        doc.text("Signature of the applicant", pageWidth-marginRight, y, { align: "right" })

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

export default Form40;