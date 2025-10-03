import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { extractApplicationData } from "@/utils/FormData";

const { Text } = Typography;

const Form22D = ({application}) => {

    const {
        maker,
        makerModel,
        registrationNumber,
        vehicleChassis,
        engineNo,
        norms,
        fuel,
        floorArea,
    } = extractApplicationData(application);

    const handleExportPdf = () => {
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginLeft = 15;
        const marginRight = 15;
        const printableWidth = pageWidth - marginLeft - marginRight;
        let y = 15;

        // Title section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("FORM 22D", pageWidth / 2, y, { align: "center" });

        y += 6;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text("[(Refer rule 47B (1)]", pageWidth / 2, y, { align: "center" });

        y += 7;
        doc.setFont("helvetica");
        doc.setFontSize(11);
        doc.text("ENDORSEMENT OF ALTERATION/RETROFITMENT", pageWidth / 2, y, { align: "center" });

        y += 6;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.text("PART I", pageWidth / 2, y, { align: "center" });

        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("(To be issued by the Motor Vehicle Owner)", pageWidth / 2, y, { align: "center" });

        y += 10;

        // Paragraph
        const para1 =
            "I hereby request the Registering Authority to endorse the alteration/ retrofitment carried out in my vehicle in the Certificate of Registration of my Motor Vehicle as per the details mentioned below:";
        const lines1 = doc.splitTextToSize(para1, printableWidth);
        doc.text(lines1, marginLeft, y);
        y += lines1.length * 5 + 6;

        // Table content
        const tableData = [
            ["1.", { content: "Motor Vehicle Details"},""],
            ["1.1", "Motor Vehicle Make and Model", `${maker} - ${makerModel}`],
            ["1.2", "Registration Number", `${registrationNumber}`],
            ["1.3", "Chassis number (Optional)", `${vehicleChassis}`],
            ["1.4", "Engine number/Motor number (in case of battery operated vehicles) (Optional)", `${engineNo}`],
            ["2.", { content: "Alteration/ Retrofitment Details"},""],
            ["2.1", "Nature of Alteration/ Retrofitment (Body Structure/ Fuel Source/Chassis replacement/Engine replacement)", ""],
            ["2.2", "Brief Details of alteration/retrofitment work carried out\nCompliance of Alteration/Retrofitment with the Applicable Rules", ""],
            ["3.1", 
                "Compliance Details of Alteration / retrofitment\n" +
                "(a) Name and address details (Name, address and Contact Details) of the Company who has carried out Alteration/retrofitment\n\n" +
                "(b) Compliance details in the formats (Form no. 22F) provided under rule 112A of CMVR 1989 as applicable.\n" +
                "(Applicable in case carried out by the OE manufacturer or his dealer or Authorised Workshop as allowed under Rule 112 of the CMVR 1989)", 
                ""],
            ["4.", "Reference number of permission for alteration /retro-fitment", ""]
        ];

        autoTable(doc,{
            startY: y,
            head: [["Sr. No", "Item", "Details"]],
            body: tableData,
            styles: {
                fontSize: 9,
                cellPadding: 2,
                valign: 'top'
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: 0,
                fontStyle: "bold",
                lineWidth: 0.1,
                lineColor: [0, 0, 0]
            },
            bodyStyles:{
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                textColor: 0,
            },
            didParseCell: (data) => {
                // Check if it’s a body cell AND last column
                if (data.section === "body" && data.column.index === data.table.columns.length - 1) {
                  data.cell.styles.fontStyle = "bold";
                }
            },
            theme: "grid",
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 90 },
                2: { cellWidth: 75 }
            }
        });

        let finalY = doc.lastAutoTable.finalY + 10;

        // Certificate text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("This is to certify that the adaptation mentioned above is correct.", marginLeft, finalY);

        finalY += 20;

        // Footer fields
        doc.text("Place: .................................", marginLeft, finalY);
        doc.text("Date: ..................................", marginLeft, finalY + 8);

        doc.text("(Signature of the Owner)", pageWidth - marginRight, finalY , { align: "right" });
        doc.text("Name: ..........................................", pageWidth - marginRight, finalY + 8, { align: "right" });
        doc.text("Mobile number: ............................", pageWidth - marginRight, finalY + 16, { align: "right" });

        doc.addPage();
        y = 15;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.text("PART II", pageWidth / 2, y, { align: "center" }); 
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("(To be filled by Registering Authority)", pageWidth / 2, y, { align: "center" });
        y += 10;
        
        
        doc.setFontSize(10.5);

        doc.setFont("helvetica", "bold");
        doc.text(`${registrationNumber}`, marginLeft + 90, y);
        y += 1;
        doc.setFont("helvetica", "normal");
        const para2 =
            "\tThe Motor Vehicle, bearing Registration Number ..............................., duly Altered/retrofitted, has been verified and cleared for endorsement entry into Registration Certificate.";
        const lines2 = doc.splitTextToSize(para2, printableWidth);
        doc.text(lines2, marginLeft, y);
        y += lines2.length * 5 + 10;

        finalY = y - 2;
        doc.text("Place: .................................", marginLeft, finalY);
        doc.text("Date: ..................................", marginLeft, finalY + 8);

        doc.text("(Signature of the Owner)", pageWidth - marginRight, finalY , { align: "right" });
        doc.text("Name: ..........................................", pageWidth - marginRight, finalY + 8, { align: "right" });
        doc.text("Mobile number: ............................", pageWidth - marginRight, finalY + 16, { align: "right" });

        // Export
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

export default Form22D;
