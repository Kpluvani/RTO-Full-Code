import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { extractApplicationData } from "@/utils/FormData";

const Form22B = ({application}) => {

  console.log("Form22B application data:", application);
  const {
    maker,
    vehicleChassis,
    engineNo,
    norms,
    fuel,
    floorArea,
    height,
    wheelbase,
    seatingCapacity,
    standingCapacity,
    sleepingCapacity,
    grossVehicleWeight,
    makerModel,
    width,
    length,
  } = extractApplicationData(application);

  const safeText = (v) => (v === 0 ? "0" : (v || ""));
  const builderName = application?.Dealer?.name || application?.Party?.name || "";
  const builderPhone = application?.OwnerDetail?.mobile_number || "";
  const builderAddress = application?.PermanentAddress?.house_no || application?.CurrentAddress?.house_no || "";
  const builderLine = [builderName, builderAddress, builderPhone].filter(Boolean).join(", ");
  const chassisManufacturer = safeText(maker);
  const engineMakeModel = [safeText(maker), safeText(makerModel)].filter(Boolean).join(" ");

  const handleExportPdf = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 16 ;
    let cursorY = 18;

    // ===== Title block =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("FORM 22B", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.text("[Refer rule 47(1)(g)]", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PART-A", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.5);

    const subHeading =
    "Initial self-certificate of compliance of the bus body built on drive away chassis by the bus body builder to the provisions of the Code and Practice for Bus Body Design and Approval AIS:052, as amended from time to time";

    const subHeadingLines = doc.splitTextToSize(subHeading, pageWidth - 28);

    // Align left
    doc.text(subHeadingLines, marginLeft, cursorY, { lineHeightFactor: 1.3 });

    cursorY += subHeadingLines.length * 5 + 6;

    // ===== Table Content =====
    const tableRows = [
      ["1.", "Name, address and telephone number of the bus body builder", safeText(builderLine)],
      ["2.", "Accreditation certificate details like number, date and validity", ""],
      ["3.", "Details of chassis on which bus is built", ""],
      ["3.1", "Particulars of chassis manufacturer", safeText(chassisManufacturer)],
      ["3.2", "Chassis number", safeText(vehicleChassis)],
      ["3.3", "Type of chassis: Ladder/semi-integral/integral", ""],
      ["3.4", "Engine make and model", safeText(engineMakeModel)],
      ["3.5", "Position of engine on vehicle", ""],
      ["3.6", "Type of fuel", safeText(fuel)],
      ["3.7", "Engine number", safeText(engineNo)],
      ["3.8", "Wheel base", safeText(wheelbase)],
      ["3.9", "Type of transmission", ""],
      ["4.", "Details of bus body built on the chassis", ""],
      ["4.1", "Type/I/II/III/Mini/Midi Comfort category [NDX/SDX/DLX/ACX]", ""],
      ["4.2", "Details of seating etc.", ""],
      ["4.2 ", "(i) Designed seating", safeText(seatingCapacity)],
      ["4.2 ", "(ii) Seat reservation for women/senior citizen/person with disability", ""],
      ["4.2 ", "(iii) Standing capacity as applicable", safeText(standingCapacity)],
      ["4.2 ", "(iv) Enclose layout drawing", ""],
      ["4.3", "Weight in Kg", ""],
      ["4.3.1", "Chassis Weight", ""],
      ["4.3.2", "Kerb Bus Weight", ""],
      ["4.3.3", "Gross Vehicle Weight (GVW)", safeText(grossVehicleWeight)],
      ["5.", "Overall dimensions", ""],
      ["5 ", "(i)Length", safeText(length)],
      ["5 ", "(ii)Width", safeText(width)],
      ["5 ", "(iii) Height", safeText(height)],
      ["5 ", "(iv) Front overhang", ""],
      ["5 ", "(v) Rear overhang", ""],
      ["5 ", "(vi) Enclose drawing indicating dimensions", ""],
      ["6.", "Internal dimensions technical and safety requirements", ""],
      ["6.1", "Service door:", ""],
      ["6.1", "(i) Number of service doors", ""],
      ["6.1 ", "(ii) Type of service door (manual/power operated/automatic)", ""],
      ["6.1 ", "(iii) Location / position (dimensions to be furnished as per applicable requirements)", ""],
      ["6.2", "Window:", ""],
      ["6.2 ", "(i) Type of windows", ""],
      ["6.2 ", "(ii) Number of windows", ""],
      ["6.2 ", "(iii) Position/locations of windows", ""],
      ["6.2 ", "(iv) Dimensions of windows Enclose details of the windows provided.", ""],
      ["6.3", "Guard rail - Enclose details of guard rails", ""],
      ["6.4", "Emergency exits:", ""],
      ["6.4 ", "(i) Number of exits", ""],
      ["6.4 ", "(ii) Location of exits", ""],
      ["6.4 ", "(iii) Type of emergency exits", ""],
      ["6.5", "Emergency door:", ""],
      ["6.5 ", "(i) Dimensions", ""],
      ["6.5 ", "(ii) Position", ""],
      ["6.5 ", "(iii) Opening from inside or outside or both", ""],
      ["6.5 ", "(iv) Access", ""],
      ["6.5 ", "(v) Safety interlock", ""],
      ["6.5 ", "(vi) Warning alarm in open position", ""],
      ["6.6", "Emergency window:", ""],
      ["6.6 ", "(i) Type of emergency window", ""],
      ["6.6 ", "(ii) Dimensions", ""],
      ["6.6 ", "(iii) Position", ""],
      ["6.6 ", "(iv) Method of opening emergency window", ""],
      ["6.6 ", "(v) Number of emergency windows", ""],
      ["6.6 ", "(vi) Window glass breaking provision", ""],
      ["6.7", "Escape hatch:", ""],
      ["6.7 ", "(i) Type of emergency hatches", ""],
      ["6.7 ", "(ii) Dimensions, position", ""],
      ["6.7 ", "(iii) Number of emergency hatches", ""],
      ["6.7 ", "(iv) Method of opening", ""],
      ["6.7 ", "(v) Glass breaking provision", ""],
      ["6.8", "Details of method and procedure of marking of emergency exits", ""],
      ["6.9", "Details of safety signs", ""],
      ["6.10", "Step:", ""],
      ["6.10 ", "(i)Number of door steps", ""],
      ["6.10 ", "(ii) Height of the steps", ""],
      ["6.10 ", "(iii) Dimensions of the steps", ""],
      ["6.10 ", "(iv) Whether retractable/collapsible steps provided", ""],
      ["6.11", "Details of access space from service door to inward of the vehicle", ""],
      ["6.12", "Dimensions of floor area and height:", ""],
      ["6.12 ", "(i) Floor area", safeText(floorArea)],
      ["6.12 ", "(ii) Floor height", ""],
      ["6.13", "Details of gangway and access passage height, width and slope", ""],
      ["6.14", "Details of hand rails and hand holds in the gangways, passage area, service door area and emergency door area", ""],
      ["6.15", "Details of seats and seat layout\nEnclose layout of seats", ""],
      ["6.16", "Dimensions of passenger seats:", ""],
      ["6.16 ", "(i) Seat width", ""],
      ["6.16 ", "(ii) Back rest height", ""],
      ["6.16 ", "(iii) Arm rest width", ""],
      ["6.16 ", "(iv) Seat cushion depth", ""],
      ["6.16 ", "(v) Seat spacing", ""],
      ["6.16 ", "(vi) Seat base height", ""],
      ["6.16 ", "(vii) Torso angle", ""],
      [
        { 
          content: "Whether following are provided as stipulated in Bus Body Code ASI:52 Rev. I (Amended Time To Time)\nImportant Note: In case if the compliance is reported as 'No' then Vehicle Shall Not be registered", 
          colSpan: 2 
        }, 
        ""
      ],
      ["6.17", "Driver work area \n\nNote : Driver door, climb facility, hand holds, work area dimensions, position of steering wheel, placement of instrument panel, shroud for wiring harness, position of controls, heating/cooling/ventilation for the driver to be provided as specified in the bus body code.", "(Yes/No)"],
      ["6.18", "Standee passenger area \n\nNote : Standee passenger area to be determined and provided as specified in the bus body code.", "(Yes/No)"],
      ["6.19", "Designed Seating Capacity (including Driver)/Standing Capacity/Sleeper Capacity \n\nNote : Enclose a sheet indicating calculations of the seating standing and sleeper passenger capacity based on the procedure specified in the bus body code along with layout of seats, standees and sleeper area", "(Yes/No)"],
      ["6.20", "Public information system (audio/visual/audio visual)", "(Yes/No)"],
      ["6.21", "Materials used for body insulation", "(Yes/No)"],
      ["6.22", "Type approval of rear view mirrors", "(Yes/No)"],
      ["6.23", "Wind screen wiping system and driver field of vision \nType approval details of the wiping system components", "(Yes/No)"],
      ["6.24", "Pad material \nNote : Pad material specified in bus body code, or superior to that specified, to be provided", "(Yes/No)"],
      ["6.25", "Protection against fire risk", "(Yes/No)"],
      ["6.26", "First aid equipment", "(Yes/No)"],
      ["6.27", "Measured values of interior noise level", "(Yes/No)"],
      ["6.28", "Body structure strength:\nEnclose compliance report details", "(Yes/No)"],
      ["6.29", "Bus structure stability: \nEnclose compliance report details", "(Yes/No)"],
      ["6.30", "Doors : \nEnclose compliance report details of hinges and door handles \nNote : Door structures, door hinges, door handles and EPDM rubber sealing shall be provided as specified in the bus body code.", "(Yes/No)"],
      ["6.31", "Enclose Compliance report for door components", "(Yes/No)"],
      [
        { content: "Lighting, signaling and indicating system:", colSpan: 2 }, 
        "(Yes/No)"
      ],
      ["6.32", "(a) Type approval details of external lighting and signaling devices:\n(b) Installation details of external lighting and signaling devices:\n(c) Details of internal lighting:\nIndicate position of illumination devices, types of bulbs, photometric requirement, dash board tell-tale lighting and control lighting, driver cabin lighting, passenger compartment lighting and other area in lighting", "(Yes/No)"],
      [
        { content: "Electrical equipment and wiring", colSpan: 2 }, 
        "(Yes/No)"
      ],
      ["6.33", "Enclose documents to establish compliance in respect of electrical cables, fuses, terminal, connector and elements", "(Yes/No)"],
      ["6.34", "Details of electrical circuit safety: \nEnclose documents to establish compliance requirements", "(Yes/No)"],
    ];

    autoTable(doc, {
      startY: cursorY,
      head: [],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 9, valign: "top" },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 120 },
        2: { cellWidth: 40, halign: "center" },
      },
    });

    // ===== Self Declaration =====
    cursorY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Self-Declaration", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 6;
    doc.setFont("helvetica", "normal");
    const declarationText = "This is to certify that—\n\n\t(a) the body/structure of the above vehicle has been fabricated by us and the same complies with \n\t    the requirements of AIS:052 (Rev. 1) as amended from time to time and all the provisions \n\t    of the Motor Vehicles Act, 1988 and the rules made thereunder;\n\t(b) no alteration of chassis, its aggregates or components has been carried out.";
    const declLines = doc.splitTextToSize(declarationText, pageWidth - 28);
    doc.text(declLines, 14, cursorY);

    // ===== Open PDF =====
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

export default Form22B;
