import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";

const { Text } = Typography;

const Form20 = ({application}) => {
	const handleExportPdf = async () => {
		console.log("Form 20 :",application);
		
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const marginLeft = 16;
		const marginRight = 16;
		const printableWidth = pageWidth - marginLeft - marginRight;
		const rightColWidth = 48; // fixed area for dotted fields on the right
		let y = 18;

		const addTitle = (t, size = 11, style = "bold") => {
			doc.setFont("helvetica", style);
			doc.setFontSize(size);
			doc.text(t, pageWidth / 2, y, { align: "center" });
			y += 6;
		};

		const addPara = (text, gap = 3.5, size = 10.2, style = "normal") => {
			doc.setFont("helvetica", style);
			doc.setFontSize(size);
			const lines = doc.splitTextToSize(text, printableWidth);
			doc.text(lines, marginLeft, y, { lineHeightFactor: 1.35 });
			y += lines.length * 5.2 + gap;
		};

		// Renders a numbered left description with an optional dotted field column on the right
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

		// New function for hierarchical layout with nested numbering
		// const addHierarchicalItem = (mainNum, nestedNum, desc, withRightDots = true, indentLevel = 0) => {
		// 	doc.setFont("helvetica", "normal");
		// 	doc.setFontSize(10.2);
			
		// 	const leftColumnWidth = printableWidth - 50; // 50mm reserved for right column
		// 	const rightColumnX = marginLeft + leftColumnWidth;
			
		// 	// Calculate indentation based on level
		// 	const baseIndent = marginLeft;
		// 	const indentPerLevel = 8; // 8mm per indent level
		// 	const currentIndent = baseIndent + (indentLevel * indentPerLevel);
			
		// 	// Create the text with proper spacing
		// 	let fullText = "";
		// 	if (mainNum && nestedNum) {
		// 		// For nested items like "5(A)" or "(a)"
		// 		fullText = `${mainNum}${nestedNum} ${desc}`;
		// 	} else if (mainNum) {
		// 		// For main items like "1."
		// 		fullText = `${mainNum} ${desc}`;
		// 	} else {
		// 		// For sub-items without main number
		// 		fullText = desc;
		// 	}
			
		// 	// Split text to fit in the available width (accounting for indentation)
		// 	const availableWidth = leftColumnWidth - (currentIndent - marginLeft);
		// 	const leftLines = doc.splitTextToSize(fullText, availableWidth);
			
		// 	// Draw the text with proper indentation
		// 	doc.text(leftLines, currentIndent, y, { lineHeightFactor: 1.35 });
			
		// 	// Add right column dots if needed
		// 	if (withRightDots) {
		// 		const blockHeight = leftLines.length * 5.2;
		// 		doc.text("....................................", rightColumnX, y, { align: "left" });
		// 		y += blockHeight + 3;
		// 	} else {
		// 		y += leftLines.length * 5.2 + 3;
		// 	}
		// };

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


		// Function for inline paragraphs with full width to dotted lines
		const addInlineParagraph = (text, indentLevel = 1, gap = 3.5) => {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(10.2);
			
			// Calculate indentation - paragraphs are indented more than nested items
			const baseIndent = marginLeft;
			const indentPerLevel = 8;
			const paragraphIndent = baseIndent + (indentLevel * indentPerLevel);
			
			// Use full width to dotted lines (same as main items)
			const leftColumnWidth = printableWidth - 50; // 50mm reserved for right column
			const availableWidth = leftColumnWidth - (paragraphIndent - marginLeft);
			
			const lines = doc.splitTextToSize(text, availableWidth);
			doc.text(lines, paragraphIndent, y, { lineHeightFactor: 1.35 });
			y += lines.length * 5.2 + gap;
		};

		// Headings
		addTitle("FORM 20", 11, "bold");
		addTitle("(Refer Rule 47 and Rule 53A)", 9.5, "italic");
		addTitle("APPLICATION FOR REGISTRATION OR TEMPORARY REGISTRATION", 10.5, "normal");
		addTitle("OF A MOTOR VEHICLE", 10.5, "normal");
		addPara("\t(To be made in duplicate if the vehicle is held under an agreement of Hire-Purchase/Lease/ Hypothecation and duplicate copy with the endorsement of the Registering Authority to be returned to the Financier simultaneously on Registration of motor vehicle)", 6);

		// To block
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.2);
		doc.text("To", marginLeft, y); y += 6;
		doc.text("The Licensing Authority,", marginLeft, y); y += 6;
		doc.text("..........................................................", marginLeft, y); y += 6;

		// const pageWidth = doc.internal.pageSize.getWidth() - 10;
		console.log("application?.VehicleDetail?.seatingCapacity",application?.VehicleDetail?.seating_capacity);
		console.log("application?.VehicleDetail?.standingCapacity",application?.VehicleDetail?.standing_capacity);
		console.log("application?.VehicleDetail?.sleeping",application?.VehicleDetail?.sleeping_capacity);
		console.log("application?.OwnerDetail?.pan_no",application?.OwnerDetail?.pan_no);
		console.log("application?.VehicleDetail?.cylinders",application?.VehicleDetail?.cylinders);
		

		const ownerName = application?.OwnerDetail?.owner_name || "";
		const relativeName = application?.OwnerDetail?.relative_name || "";
		const permanentAddress = application?.PermanentAddress?.house_no || "";
		const tempAddress = application?.CurrentAddress?.house_no || "";
		const ownershipType = application?.OwnershipType?.name || "";
		const mobileNumber = application?.OwnerDetail?.mobile_number || "";
		const PanNumber = application?.OwnerDetail?.pan_no || "";
		const vehicleChassis = application?.VehicleDetail?.chassis_no || "";
		const vehicleClass = application?.VehicleDetail?.VehicleClass?.name || "";
		const vehicalBodyType = application?.VehicleDetail?.VehicleBodyType?.name || "";
		const vehicalType = application?.VehicleDetail?.VehicleType?.name || "";
		const maker = application?.VehicleDetail?.Maker?.name || "";
		const manufacturemonth = application?.VehicleDetail?.Month?.name || "";
		const manufactureYear = application?.VehicleDetail?.Year?.name || "";
		const Cylinders = application?.VehicleDetail?.cylinders || "";
		const cubicCapacity = application?.VehicleDetail?.cubic_capacity || "";
		const horsePpower = application?.VehicleDetail?.horse_power || "";
		const wheelbase = application?.VehicleDetail?.wheelbase || "";
		const engineNo = application?.VehicleDetail?.engine_no || "";
		const StandingCapacity = application?.VehicleDetail?.standing_capacity || "";
		const sleepingCapacity = application?.VehicleDetail?.sleeping_capacity || "";
		const seatingCapacity = application?.VehicleDetail?.seating_capacity || "";
		
		// Debug logging for the variables
		console.log("Cylinders variable:", Cylinders);
		console.log("StandingCapacity variable:", StandingCapacity);
		console.log("sleepingCapacity variable:", sleepingCapacity);
		console.log("seatingCapacity variable:", seatingCapacity);
		const unledenSpace = application?.VehicleDetail?.unladen_weight || "";
		const color = application?.VehicleDetail?.color || "";
		const vehicalNumber = application?.VehicleDetail?.vehicle_no || "";
		const fuel = application?.VehicleDetail?.Fuel?.name || "";
		const vehicleCategory = application?.VehicleDetail?.vehicle_category_id || "";
		const registrationType = application?.RegistrationType?.name || "";
		
		// Numbered items - Page 1 using hierarchical layout
		addHierarchicalItem("1.", null, "Full Name of person to be registered as Registered owner", relativeName);
		addInlineParagraph("Son/Wife/Daughter of", 1, 2);
		
		addHierarchicalItem("2.", null, "Age of person to be registered as Registered owner", true);
		
		addHierarchicalItem("3.", null, "Permanent address", permanentAddress);
		addInlineParagraph("(Electoral Roll/ Life Insurance Policy/ Passport/ Pay slip issued by any office of the Central Government/ State Government or a local body / Any other document or documents as may be prescribed by the State Government/ Affidavit sworn before an Executive Magistrate or a First Class Judicial Magistrate or a Notary Public to be enclosed)", 1, 2);
		
		addHierarchicalItem("4.", null, "Temporary address/ Official address, if any", tempAddress);
		
		addHierarchicalItem("4A.", null, "Ownership type", ownershipType);
		
		// Ownership types with hierarchical numbering
		const ownershipTypes = [
			{ num: "1.", desc: "AUTONOMOUS BODY" },
			{ num: "2.", desc: "CENTRAL GOVERNMENT" },
			{ num: "3.", desc: "CHARITABLE TRUST" },
			{ num: "4.", desc: "DRIVING TRAINING SCHOOL" },
			{ num: "5.", desc: "DIVYANGJAN" },
			{ num: "6.", desc: "EDUCATIONAL INSTITUTE" },
			{ num: "7.", desc: "FIRM" },
			{ num: "8.", desc: "GOVERNMENT UNDERTAKING" },
			{ num: "9.", desc: "INDIVIDUAL" },
			{ num: "10.", desc: "LOCAL AUTHORITY" },
			{ num: "11.", desc: "MULTIPLE OWNER" },
			{ num: "12.", desc: "POLICE DEPARTMENT" },
			{ num: "13.", desc: "STATE GOVERNMENT" },
			{ num: "14.", desc: "STATE TRANSPORT CORPORATION OR DEPARTMENT" },
			{ num: "15.", desc: "OTHERS" },
		];
		
		// Store current Y position before ownership types
		const ownershipStartY = y;
		
		// Draw ownership types with compact spacing
		ownershipTypes.forEach((item, index) => {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(8.5);
			
			const leftColumnWidth = printableWidth - 50;
			const rightColumnX = marginLeft + leftColumnWidth;
			const baseIndent = marginLeft;
			const indentPerLevel = 8;
			const currentIndent = baseIndent + (1 * indentPerLevel); // indentLevel = 1
			
			const fullText = `${item.num} ${item.desc}`;
			const availableWidth = leftColumnWidth - (currentIndent - marginLeft);
			const leftLines = doc.splitTextToSize(fullText, availableWidth);
			
			// Use compact line height for ownership types
			doc.text(leftLines, currentIndent, y, { lineHeightFactor: 1.1 });
			
			// Compact spacing between items
			y += leftLines.length * 3.5 + 4; // Much smaller spacing
		});
		
		// Special case for DIVYANGJAN with nested items
		// addHierarchicalItem("", "(a)", "AVAILING GST CONCESSION", false, 2);
		// addHierarchicalItem("", "(b)", "WITHOUT AVAILING GST CONCESSION", false, 2);

		// Page 2 for items 5 - 28 using hierarchical layout
		doc.addPage();
		y = 18;
		
		addHierarchicalItem("5.", null, "Duration of stay at the present address", "");
		addHierarchicalItem("5", "(A)", "Mobile number of the owner of the vehicle", mobileNumber);
		
		addHierarchicalItem("6.", null, "PAN number (optional)", PanNumber);
		addHierarchicalItem("7.", null, "Place of birth", "");
		addHierarchicalItem("8.", null, "If place of birth is outside India, when migrated to India", "");
		
		addHierarchicalItem("9(A).", null, "Name of the nominee", "");
		addHierarchicalItem("9(B).", null, "Relationship with the nominee", "");
		
		addHierarchicalItem("10.", null, "Name and address of the Dealer or Manufacturer from whom the vehicle was purchased", false);
		addInlineParagraph("(sale certificate and certificate of road worthiness issued by the manufacturer to be enclosed)", 1, 2);
		
		addHierarchicalItem("11.", null, "If ex-army vehicle or imported vehicle, enclose proof", "");
		addHierarchicalItem("12.", null, "Class of vehicle (if motor cycle, whether with or without gear)", vehicleClass);
		
		addHierarchicalItem("13.", null, "The motor vehicle is", false);
		addHierarchicalItem("", null, "(a) a new vehicle,", "", 1);
		addHierarchicalItem("", null, "(b) ex-army vehicle,", "", 1);
		addHierarchicalItem("", null, "(c) imported vehicle", "", 1);
		addHierarchicalItem("", null, "(d) in use E-rickshaw or E-cart", "", 1);
		addHierarchicalItem("14.", null, "Type of body", vehicalBodyType);
		addHierarchicalItem("15.", null, "Type of vehicle", vehicalType);
		addHierarchicalItem("16.", null, "Maker's name", maker);
		addHierarchicalItem("17.", null, "Month and year of manufacture", `${manufacturemonth}/${manufactureYear}`);
		// Debug logging before addHierarchicalItem calls
		console.log("About to call addHierarchicalItem with Cylinders:", Cylinders, "Type:", typeof Cylinders);
		console.log("About to call addHierarchicalItem with seatingCapacity:", seatingCapacity, "Type:", typeof seatingCapacity);
		console.log("About to call addHierarchicalItem with StandingCapacity:", StandingCapacity, "Type:", typeof StandingCapacity);
		console.log("About to call addHierarchicalItem with sleepingCapacity:", sleepingCapacity, "Type:", typeof sleepingCapacity);
		
		addHierarchicalItem("18.", null, "Number of cylinders", Cylinders);
		addHierarchicalItem("19.", null, "Horse power", horsePpower);
		addHierarchicalItem("20.", null, "Cubic capacity", cubicCapacity);
		addHierarchicalItem("21.", null, "Maker's classification or if not known, wheel base", wheelbase);
		addHierarchicalItem("22.", null, "Chassis No. (Affix Pencil print)", vehicleChassis);
		addHierarchicalItem("23.", null, "Engine Number or Motor Number in case of Battery Operated Vehicles", engineNo);
		addHierarchicalItem("24.", null, "Seating capacity (including driver)", seatingCapacity);
		addHierarchicalItem("24", "A.", "Standing capacity", StandingCapacity);
		addHierarchicalItem("24", "B.", "Sleeper capacity", sleepingCapacity);
		addHierarchicalItem("25.", null, "Fuel used in the engine", fuel);
		addHierarchicalItem("26.", null, "Unladen weight", unledenSpace);
		addHierarchicalItem("27.", null, "Particulars of previous registration and registered number (if any)", vehicalNumber);
		
		// Page 3: Additional particulars
		doc.addPage();
		y = 18;
        addHierarchicalItem("28.", null, "Colour or colours of body wings and front end", color);
		addPara("I hereby declare that the motor vehicle has not been registered in any State in India.", 6, 10.2, "normal");

		addTitle("ADDITIONAL PARTICULARS TO BE COMPLETED ONLY IN THE CASE OF", 10.2, "bold");
		addTitle("TRANSPORT VEHICLE OTHER THAN MOTOR CAB", 10.2, "bold");

		addHierarchicalItem("29.", null, "Number, description, size and ply rating of tyres, as declared by the manufacturer", false);
		addHierarchicalItem("", "(a)", "(a) Front axle         \t=", true, 1);
		addHierarchicalItem("", "(b)", "(b) Rear axle          \t=", true, 1);
		addHierarchicalItem("", "(c)", "(c) Any other axle \t =", true, 1);
		addHierarchicalItem("", "(d)", "(d) Tandem axle   \t =", true, 1);
		
		addHierarchicalItem("30.", null, "Gross vehicle weight", false);
		addHierarchicalItem("", "(a)", "(a) as certified by manufacturer ............ Kgns.", false, 1);
		addHierarchicalItem("", "(b)", "(b) To be registered .................. Kgns.", false, 1);
		
		addHierarchicalItem("31.", null, "Maximum axle weight", false);
		addHierarchicalItem("", "(a)", "(a) Front axle .......................... Kgns.", false, 1);
		addHierarchicalItem("", "(b)", "(b) Rear axle .......................... Kgns.", false, 1);
		addHierarchicalItem("", "(c)", "(c) Any other axle .......................... Kgns.", false, 1);
		addHierarchicalItem("", "(d)", "(d) Tandem axle .......................... Kgns.", false, 1);
		
		addHierarchicalItem("32.", null, "Overall length, width, height, overhang", false);
		addHierarchicalItem("", "(a)", "(a) Overall length", "", 1);
		addHierarchicalItem("", "(b)", "(b) Overall width", "", 1);
		addHierarchicalItem("", "(c)", "(c) Overall height", "", 1);
		addHierarchicalItem("", "(d)", "(d) Over hang", "", 1);
		
		addInlineParagraph("The above particulars are to be filled in for a rigid frame motor vehicle of two or more axles for an articulated vehicle of three or more axles or, to the extent applicable, for trailer, where a second semi-trailer or additional semi-trailer are to be registered with an articulated motor vehicle. The following particulars are to be furnished for each such semi-trailer", 1, 4);
		
        addHierarchicalItem("33.", null, "Type of body", vehicalBodyType);
		addHierarchicalItem("34.", null, "Unladen weight", unledenSpace);
		addHierarchicalItem("35.", null, "Number, description and size of tyres on each axle", "");
		addHierarchicalItem("36.", null, "Maximum axle weight in respect of each axle", "");
		// Item 37 - Insurance certificate with right-aligned block
		const leftColumnWidth = printableWidth - 60; // reserve 60mm for right column
		const rightColumnX = marginLeft + leftColumnWidth;

		// Item 37 (left column)
		const item37Text = "The vehicle is covered by a valid certificate of Insurance under Chapter XI of the Act";
		const leftLines = doc.splitTextToSize(`37. ${item37Text}`, leftColumnWidth);
		doc.text(leftLines, marginLeft, y, { lineHeightFactor: 1.35 });

		// Certificate text (right column)
		const rawInsuranceText = 
		`	Insurance Certificate or 
			Cover Note No. ................
			Date ..........of.............. 
			(Name of company) 
			Valid from .......... to ..........`;

		// Replace one leading tab or 4 spaces from each line
		const leftMargin = "\t ";
		const insuranceText = rawInsuranceText
		.split("\n")
		.map(line => leftMargin + line.trimStart())
		.join("\n");

		const rightLines = doc.splitTextToSize(insuranceText, 65); // max width for right column
		doc.text(rightLines, rightColumnX, y, { lineHeightFactor: 1.35 });

		// Update Y
		const blockHeight = Math.max(leftLines.length, rightLines.length) * 6;
		y += blockHeight + 3;     
		
		// Page 4: Financier and inspection certificate
		doc.addPage();
		y = 18;
        addHierarchicalItem("38.", null, "The vehicle is exempted from insurance. The relevant order is enclosed", true);
		addHierarchicalItem("39.", null, "I have paid the prescribed fee of Rs.", true);
		addPara("Date ............................\t\t\t\t\tSignature or thumb impression of the dealer along with \n\t\t\t\t\t\t\t\t\t     the specimen signature of the owner", 8);
		
		addHierarchicalItem("", "", "Note : The motor vehicle above described is —", false, 0);
		addPara( "\t(i) Subject to Hire-Purchase agreement/ Lease agreement with ............................");
		addPara( "\t(ii) Subject to hypothecation in favour of ............................");
		// The last item should be full width (not indented)
		addPara( "\t(iii) Not held under Hire-Purchase agreement, or lease agreement or subject to Hypothecation Strike \nout whatever is inapplicable, if the vehicle is subject to any such agreement the signature of the Financier \nwith whom such agreement has been entered into is to be obtained.");
		// addPara("Strike out whatever is inapplicable, if the vehicle is subject to any such agreement the signature of the Financier with whom such agreement has been entered into is to be obtained.");
		const lineY = y;          // Y position for dotted lines
		const labelY = y + 5.5;   // Y position for labels (a bit lower)

		// Widths and positions
		const lineWidth = 80;     // Adjust based on your desired line length
		const spaceBetween = 16;  // Space between the two lines

		const leftX = marginLeft;
		const rightX = pageWidth - marginRight - lineWidth;

		// Draw dotted lines
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.text(".".repeat(45), leftX, lineY);   // Left dotted line
		doc.text(".".repeat(45), rightX, lineY);  // Right dotted line

		// Labels below
		doc.setFontSize(9.5); // slightly smaller font for captions
		doc.text(
		"Signature of financier with whom an Agreement of Hire-Purchase, Lease or Hypothecation has been entered into",
		leftX,
		labelY,
		{ maxWidth: lineWidth }
		);

		doc.text(
		"Signature or thumb impression of the registered owner",
		rightX,
		labelY,
		{ maxWidth: lineWidth }
		);

		// Update y for next section
		y = labelY + 8;

		y += 6;
		addTitle("CERTIFICATE OF INSPECTION OF MOTOR VEHICLE WHOSE BODY HAS BEEN", 10.2, "bold");
		addTitle("FABRICATED SEPARATELY TO THE PURCHASED CHASSIS", 10.2, "bold");
		y += 6;

		addPara("Certified that the particulars contained in the application are true and that the vehicle complies with the requirements of the Motor Vehicles Act, 1988, and the Rules made thereunder.");
		
		// Date and Signature fields - left aligned
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.2);
		doc.text("Date ............................", marginLeft, y);
		doc.text("Signature of the Inspecting Authority", pageWidth - marginRight - 65, y);
		y += 6;
		
		doc.text("Ref. No. ......................................", marginLeft, y);
		doc.text("Name ................................................", pageWidth - marginRight - 65, y);
		y += 6;
		
		doc.text("Designation .......................................", pageWidth - marginRight - 65, y);
		y += 6;
		doc.text("Office Endorsement Office of ", pageWidth - marginRight - 70, y);
		y += 6;
		doc.text("the ...................................................", pageWidth - marginRight - 65, y);
		y += 6;
		
		addPara("\tThe above said motor vehicle has been assigned the Registration Number .......... and registered in the \nname of the applicant and the vehicle is subject to an agreement of Hire-Purchase/Lease/Hypothecation with \tthe Financier referred above.");
		
		doc.text("Date ............................", marginLeft, y);
		doc.text("Signature of the Registering Authority", pageWidth - marginRight - 80, y);
		y += 8;
		
		// To section with indented note
		doc.text("To", marginLeft, y);
		y += 6;
		doc.text("The Financier ..........................................................", marginLeft, y);
		y += 6;
		addInlineParagraph("(To be sent by registered post acknowledgement due)", 1, 2);
		
		addPara("\tSpecimen signature or thumb-impression of the person to be registered as Registered Owner and Financier are to be obtained in original application for affixing and attestation by the Registering Authority with office seal in Forms 23 and 24 in such a manner that the part of impression of seal or a stamp and attestation shall fall upon each signature.");
		
		// Specimen signatures section - matching the image layout
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10.2);
		
		// Calculate positions for two-column layout
		const leftColumnX = marginLeft;
		const rightColumnX2 = pageWidth - marginRight - 80;
		
		// Headers
		doc.text("Specimen signature of the Financier", leftColumnX, y);
		doc.text("Specimen signature of the Registered Owner", rightColumnX2, y);
		y += 8;
		
		// Signature lines with proper numbering
		doc.text("(1) .........................................................", leftColumnX, y);
		doc.text("(1) .........................................................", rightColumnX2, y);
		y += 6;
		
		doc.text("(2) .........................................................", leftColumnX, y);
		doc.text("(2) .........................................................", rightColumnX2, y);
		y += 6;

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

export default Form20;