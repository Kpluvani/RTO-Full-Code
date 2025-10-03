import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "@/utils/FormData";
import { FaSleigh } from "react-icons/fa6";

const { Text } = Typography;

const Form51 = ({application}) => {

    const handleExportPdf = async () => {
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginLeft = 18;
        const marginRight = 18;
        const printableWidth = pageWidth - marginLeft - marginRight;
        let y = 18;


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

            let totalBlockHeight = leftLines.length * 3.5;
            let valueLines = [];

            // Handle value display with wrapping
            if (hasValue) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10.2);
                
                // Split the value text to fit in the right column width
                valueLines = doc.splitTextToSize(valueOrDots.toString(), rightColumnWidth);
                
                // Update total block height to accommodate value lines
                totalBlockHeight = Math.max(totalBlockHeight, valueLines.length * 3.5);
                
                doc.setFont("helvetica", "normal");
            }

            // Right column: dotted line (only if shouldShowDots is true)
            if (shouldShowDots) {
                // Draw dotted lines for each line of content
                const numDottedLines = Math.ceil(totalBlockHeight / 3.5);
                for (let i = 0; i < numDottedLines; i++) {
                    // Create longer dotted line to fill the right column properly
                    const dottedLine = ".".repeat(45); // Longer dotted line
                    doc.text(dottedLine, rightColumnX, y + (i * 3.5), { align: "left" });
                }
            }

            // Draw the value text AFTER the dotted lines (so it appears on top)
            if (hasValue) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10.2);
                
                // Draw each line of the value
                valueLines.forEach((line, index) => {
                    doc.text(line, rightColumnX, y + (index * 3.5) - 1);
                });
                
                doc.setFont("helvetica", "normal");
            }

            y += totalBlockHeight + 3; // move Y below the row
        };

    const addTwoColumnBlock = (leftText, rightText, leftRatio = 0.4) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.2);

        const gap = 6;
        const leftWidth = Math.max(10, (printableWidth * leftRatio) - gap);
        const rightWidth = Math.max(10, printableWidth - leftWidth - gap);
        const leftX = marginLeft;
        const rightX = marginLeft + leftWidth + gap;

        const leftLines = doc.splitTextToSize(leftText, leftWidth);
        const rightLines = doc.splitTextToSize(rightText, rightWidth);

        const lineHeight = 5.2;
        const leftHeight = Math.max(1, leftLines.length) * lineHeight;
        const rightHeight = Math.max(1, rightLines.length) * lineHeight;

        doc.text(leftLines, leftX, y, { lineHeightFactor: 1.35 });
        doc.text(rightLines, rightX, y, { lineHeightFactor: 1.35 });

        y += Math.max(leftHeight, rightHeight) + 3;
    };
          
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.text("FORM 51", pageWidth / 2, y, { align: "center" });
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.text("[Refer Rule 141]", pageWidth / 2, y, { align: "center" });
    y += 8;
    
    
    doc.setFont("helvetica", "normal");
    doc.text("Certificate of insurance in respect of.........................................................................................", marginLeft, y);
    y += 6;
    doc.text("Certificate No. ....................", marginLeft, y);
    doc.text("Policy No. ........................", pageWidth - marginRight, y , { align : "right" });
    y += 10;

    addHierarchicalItem("1.", null, "Registration mark of the vehicle insured","");
    addHierarchicalItem("2.", null, "Description of the vehicle","");
    addHierarchicalItem("3.", null, " Make and year of manufacture","");
    addHierarchicalItem("4.", null, "Engine number or motor number in the case of Battery",false);
    addHierarchicalItem("", null, "\tOperated Vehicles","");
    addHierarchicalItem("", null, "\tChassis number","");
    addHierarchicalItem("4A", null, "FASTag ID","");
    addHierarchicalItem("5", null, "Carrying capacity","");
    addHierarchicalItem("5A", null, "Seating capacity (including driver)","");
    addHierarchicalItem("5B", null, " Standing capacity","");
    addHierarchicalItem("5C", null, "Sleeper capacity","");
    addHierarchicalItem("6", null, "Name and address of the insured","");
    addHierarchicalItem("6A", null, "Validated Mobile number of the vehicle owner","");
    addHierarchicalItem("7", null, "Effective date and time of commencement of insurance","");
    addHierarchicalItem("8", null, " Date of expiry of insurance","");
    addHierarchicalItem("9", null, "Persons or classes of persons entitled to drive:—","");

    y += 4;
    addTwoColumnBlock("Stage carriage/contract carriage/private servicevehicle","Any person including insured :\nPROVIDED that a person driving holds an effective driving licence at the time of the accident and is not disqualified from holding or obtaining such a licence: \nPROVIDED ALSO th son holding an effective learner’s licence may also drive the vehicle when not used for the transport of passengers at the time of the accident and that such a person satisfies the requirements of rule 3 of the Central Motor Vehicles Rules, 1989.")
    addTwoColumnBlock("Goods carriage","Any person including insured : \nPROVIDED that a person driving holds an effective driving licence at the time of the accident and is not disqualified from holding taining such a licence: \nPROVIDED ALSO that the person holding an effective learner’s licence may also drive the vehicle when not used for the transport of goods at the time of the accident and that such a person satisfies the requirements of rule 3 of the Central Motor Vehicles Rules, 1989.");
    addTwoColumnBlock("Non-transport vehicles","Any person including insured :\nPROVIDED that a person driving holds an effective driving licence at the time of the accident and is not disqualified from holding or obtaining such a isq licence:");
    doc.addPage();
    y = 18;
    addTwoColumnBlock("","PROVIDED ALSO that the person holding an at the per effective learner’s licence may also drive the vehicle and that such a person satisfies the requirements of rule 3 of the Central Motor Vehicles Rules, 1989.");
    addTwoColumnBlock("10. Limitations as to use:— \nStage carriage/contract carriage/goods carriage/ private service vehicle","The policy covers use only under a permit within the meaning of the Motor Vehicles Act, 1988, or such a carriage falling under sub-section (3) of section 66 of the Motor Vehicles Act, 1988.\nThe policy does not cover use for—\n(a) organised racing\n(b) speed testing.");
    addTwoColumnBlock("11. Private service vehicle and   non-transport vehicle", "The policy covers use for any purpose other than—\n(a) hire or reward,\n(b) organised racing, or\n(c) speed testing");
    addTwoColumnBlock("12. All vehicles","The policy does not cover liability for death, bodily injury or damage as excluded in section 150(2)(ii) and (iii); (b) and (c) of the Motor Vehicles Act, 1988.");
    
    doc.text("\tWe hereby certify that the policy to which this certificate relates as well as the certificates of insurance are\n issued in accordance with the provisions of Chapter X or XI of the Motor Vehicles Act, 1988.", marginLeft, y)
    y += 12;
    doc.text("Authorised insurer", pageWidth-marginRight , y,{ align : "right"});
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

export default Form51;