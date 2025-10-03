import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "../../../utils/FormData";

const { Text } = Typography;

const Form22A = ({application}) => {

  const {
    maker,
    vehicleChassis,
    engineNo,
    norms,
  } = extractApplicationData(application);

  const handleExportPdf = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 18;
    const marginRight = 18;
    const printableWidth = pageWidth - marginLeft - marginRight;
    let cursorY = 18;

    // ===== Title block =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FORM 22-A", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.text(
      "See Rules 47(g), 115, 124(2), 125C, 125F, 125G], 126A, 127",
      pageWidth / 2,
      cursorY,
      { align: "center" }
    );

    cursorY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12.5);

    const heading =
      "INITIAL CERTIFICATE OF COMPLIANCE WITH POLLUTION STANDARDS, SAFETY STANDARDS OF COMPONENTS AND ROAD WORTHINESS (FOR VEHICLES WHERE BODY IS FABRICATED SEPARATELY)";
    const subHeading = "PART I";
    const subHeadingdesc = "(To be issued by the manufacturer)";

    const headingLines = doc.splitTextToSize(heading, printableWidth);
    doc.text(headingLines, pageWidth / 2, cursorY, {
      align: "center",
      lineHeightFactor: 1.2,
    });
    cursorY += headingLines.length * 5.2 + 8;

    doc.setFont("helvetica", "bold");
    doc.text(subHeading, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;

    doc.setFont("helvetica", "normal");
    doc.text(subHeadingdesc, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 10;

    // ===== Address/Paragraph block =====
    doc.setFontSize(11);
    const addParagraph = (text) => {
      const lines = doc.splitTextToSize(text, printableWidth);
      doc.text(lines, marginLeft, cursorY, {
        align: "left",
        lineHeightFactor: 1.35,
      });
      cursorY += lines.length * 5 + 6;
    };
	doc.setFontSize(12);
    addParagraph(
      "Certified that the following vehicle complies with the provisions of the Motor Vehicles Act, 1988, and the rules made thereunder, including the following mass emission norms:"
    );

    // ===== Hierarchical Item block =====
  const addHierarchicalItem = (
    mainNum,
    nestedNum,
    desc,
    value = "",
    indentLevel = 0,
    leftBold = false
  ) => {
    // Left text
    doc.setFont("helvetica", leftBold ? "bold" : "normal");
    doc.setFontSize(12);

    const leftColumnWidth = printableWidth - 55; // space for right column
    const rightColumnX = marginLeft + leftColumnWidth;

    const baseIndent = marginLeft;
    const indentPerLevel = 8;
    const currentIndent = baseIndent + indentLevel * indentPerLevel;

    // Prepare left text
    let fullText = "";
    if (mainNum && nestedNum) fullText = `${mainNum}${nestedNum} ${desc}`;
    else if (mainNum) fullText = `${mainNum} ${desc}`;
    else fullText = desc;

    const availableWidth = leftColumnWidth - (currentIndent - marginLeft);
    const leftLines = doc.splitTextToSize(fullText, availableWidth);

    // Draw left side
    doc.text(leftLines, currentIndent, cursorY, { lineHeightFactor: 1.35 });

    // Metrics
    const lineHeight = 5.2;
    const leftHeight = leftLines.length * lineHeight;

    // Anchor Y on the LAST line of the left block
    const anchorY = cursorY + (Math.max(1, leftLines.length) - 1) * lineHeight;

    // Right column settings
    const rightColumnWidth = 50;
    const valueDotsGap = 1; // vertical space between value baseline and dotted line

    // Precompute full dotted line string to fill right column width
    doc.setFont("helvetica", "normal");
    const dotWidth = doc.getTextWidth(".");
    const dotsCount = Math.max(0, Math.floor(rightColumnWidth / dotWidth));
    const fullDots = dotsCount > 0 ? ".".repeat(dotsCount) : "";

    // Prepare value lines starting from anchor line
    const valueLines = value ? doc.splitTextToSize(String(value), rightColumnWidth) : [""];
    const numRightLines = Math.max(1, valueLines.length);

    for (let i = 0; i < numRightLines; i++) {
      const lineY = anchorY + i * lineHeight;

      // Draw full dotted guide first (with a small vertical gap below the value)
      if (fullDots) {
        doc.setFont("helvetica", "normal");
        doc.text(fullDots, rightColumnX, lineY + valueDotsGap, { lineHeightFactor: 1.35 });
      }

      // Then overlay the dynamic value on top (above the dotted line)
      const lineText = valueLines[i] || "";
      if (lineText) {
        doc.setFont("helvetica", "bold");
        doc.text(lineText, rightColumnX, lineY, { lineHeightFactor: 1.35 });
      }
    }

    // Compute total row height and advance cursor after the tallest block
    const rightHeight = (numRightLines - 1) * lineHeight + (anchorY - cursorY) + lineHeight + valueDotsGap;
    const rowHeight = Math.max(leftHeight, rightHeight);
    cursorY += rowHeight + 4;
  };


  addHierarchicalItem("", null, "Brand name of the vehicle", maker, true, 0) ;
  addHierarchicalItem("", null, "Chassis number", vehicleChassis, true, 0);
  addHierarchicalItem("", null, "Engine number / Motor number\n(in case of battery operated vehicles)",engineNo,true, );
  addHierarchicalItem("", null, "Sub-rule No. ....... of rule 115", "", true, 0);
  addHierarchicalItem("", null, "Emission norms\n(Bharat Stage-I/II/III etc.)", norms, true, 0);

  doc.setFont("helvetica", "normal");
    doc.text(
      "Signature of chassis manufacturer",
      pageWidth - marginRight,
      cursorY,
	  { align: "right", underline: true	 }
    );
    cursorY += 8;

	addParagraph("\tForm 22-A, Part-I shall be issued with the signature of the manufacturer dulyprinted in \nthe Form itself by affixing facsimile signature in ink under the hand and sealof the manufacturer.")

	doc.addPage();
	cursorY = 18;

	// ===== Title block Part II =====
	doc.setFont("helvetica", "bold");
	doc.setFontSize(12.5);
	const headingPart2 = "PART II";
	const headingPart2Desc = "(To be issued by the body builder)";

	doc.text(headingPart2, pageWidth / 2, cursorY, { align: "center" });
	cursorY += 6;
	doc.setFont("helvetica", "normal");

	doc.text(headingPart2Desc, pageWidth / 2, cursorY, { align: "center" });
	cursorY += 10;

	doc.setFontSize(11);
	addParagraph("\tCertified that the body of the following vehicle has been fabricated by us and the same complies \nwith the provisions of the Motor Vehicles Act, 1988, and the rules made the reunder:—");

  // ===== Hierarchical Item block Part II =====
  doc.setFont("helvetica", "bold");
  doc.text(`${maker}`, marginLeft + 63, cursorY);
  cursorY += 1;
  doc.setFont("helvetica", "normal");
	doc.text("1. Brand name of the vehicle ..........................................................................", marginLeft + 10, cursorY,)
	cursorY += 8

  doc.setFont("helvetica", "bold");
  doc.text(`${vehicleChassis}`, marginLeft + 40, cursorY);
  cursorY += 1;
  doc.setFont("helvetica", "normal");
	doc.text("2. Chassis No. ........................................................", marginLeft + 10, cursorY,)
	cursorY += 8

  doc.setFont("helvetica", "bold");
  doc.text(`${engineNo}`, marginLeft + 55, cursorY);
  cursorY += 1;
  doc.setFont("helvetica", "normal");
	doc.text("3. Engine No./Motor No. ...........................................", marginLeft + 10, cursorY,)
	cursorY += 8


	doc.text("*4. Bus Body Builder Accreditation Certificate Number ................ Date ............... valid up \n      to date ................", marginLeft + 10, cursorY,)
	cursorY += 12
	doc.text("*5. Vehicle Body construction (Bus/Road Ambulance/Motor Caravan/etc.) Type Approval \n     Certificate Number ................................. Date ....................... issued by the approved \n     Test Agency", marginLeft + 10, cursorY,)
	cursorY += 16
	doc.text("*Applicable for buses only \t\t\t\t\t\t\t\t(Signature of the body builder)", marginLeft, cursorY,)
	cursorY += 16

	addParagraph("Form 22-A Part II shall be issued with the signature of the body builder duly printed in the Form itself by affixing facsimile signature in ink under the hand and seal of the body builder.")
	addParagraph("Note : Part II shall be applicable for new model of buses manufactured on or after the 1st October, 2014 and for the existing models of buses manufactured on and after 1st October, 2016 and in case of Road Ambulances and Motor Caravans manufactured from the date of applicability of AIS-125 (Part 1):2014 and AIS-124:2014 respectively.")
	// ===== Hierarchical Item block Part II ====="

    // ===== Export PDF =====
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  };

  return (
    <Typography className="main">
      <Button type="primary" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </Typography>
  );
};

export default Form22A;
