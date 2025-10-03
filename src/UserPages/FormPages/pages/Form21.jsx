import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "@/utils/FormData";

// PDF Generation Constants
const PDF_CONFIG = {
	pageWidth: 210, // A4 width in mm
	marginLeft: 16,
	marginRight: 16,
	startY: 18,
	fontSizes: {
		title: 11,
		subtitle: 9.5,
		normal: 10.2,
		small: 8
	},
	lineHeight: 5.2,
	lineGap: 3,
	rightColumnOffset: 135
};

const Form21 = ({ application }) => {
	const {
		ownerName,
		mobileNumber,
		relativeName,
		permanentAddress,
		tempAddress,
		vehicleChassis,
		maker,
		makerModel,
		vehicleClass,
		engineNo,
		cylinders,
		manufactureMonth,
		manufactureYear,
		seatingCapacity,
		sleepingCapacity,
		standingCapacity,
		horsePower,
		unladenWeight,
		colors,
		vehicalBodyType,
		grossVehicleWeight,
	} = extractApplicationData(application);

	console.log("standingCapacity", standingCapacity);
	const pan = application?.OwnerDetail?.pan_no || "";
	
	const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const { pageWidth, marginLeft, marginRight, startY, fontSizes, lineHeight, lineGap, rightColumnOffset } = PDF_CONFIG;
		const printableWidth = pageWidth - marginLeft - marginRight;
		let y = startY;

		// Optimized PDF helper functions
		const setFont = (style = "normal", size = fontSizes.normal) => {
			doc.setFont("helvetica", style);
			doc.setFontSize(size);
		};

		const safeText = (value) => String(value || "");

		const addTitle = (text, size = fontSizes.title, style = "bold") => {
			setFont(style, size);
			doc.text(text, pageWidth / 2, y, { align: "center" });
			y += 6;
		};

		const addPara = (text, gap = 3.5, size = fontSizes.normal, style = "normal") => {
			setFont(style, size);
			const lines = doc.splitTextToSize(text, printableWidth);
			doc.text(lines, marginLeft, y, { lineHeightFactor: 1.35 });
			y += lines.length * lineHeight + gap;
		};

		const addItem = (numText, desc, withRightDots = true) => {
			setFont("normal", fontSizes.normal);
			const leftColumnWidth = printableWidth - 50;
			const rightColumnX = marginLeft + leftColumnWidth;

			const leftLines = doc.splitTextToSize(numText ? `${numText} ${desc}` : desc, leftColumnWidth);
			doc.text(leftLines, marginLeft, y, { lineHeightFactor: 1.35 });

			if (withRightDots) {
				doc.text("....................................", rightColumnX, y, { align: "left" });
			}
			y += leftLines.length * lineHeight + lineGap;
		};

		const addFieldWithValue = (label, value, number = "") => {
			setFont("bold", fontSizes.normal);

			const rightColumnX = marginLeft + (printableWidth - 50); // same as addItem
			const rightColumnWidth = 50; // space reserved for value
			const displayValue = safeText(value);

			// Wrap the value if it's too long
			const valueLines = doc.splitTextToSize(displayValue, rightColumnWidth);
			doc.text(valueLines, rightColumnX, y, { lineHeightFactor: 1.35 });

			const blockHeight = valueLines.length * lineHeight; // calculate height used by value

			y += 1; // small offset before dots
			setFont("normal", fontSizes.normal);
			addItem(number, label, true); // this moves y further for the left side text

			// Adjust y if valueLines taller than leftLines
			y += Math.max(0, blockHeight - lineHeight);
		};

		// Title block
		addTitle("FORM 21", fontSizes.title, "bold");
		addTitle("[Refer Rule 47(a) and (b)]", fontSizes.subtitle, "italic");
		addTitle("SALE CERTIFICATE", fontSizes.title, "normal");
		addPara("To be issued by manufacturer or dealer or registered E-rickshaw or E-cart Association (in case of E-rickshaw or E-cart) or officer of Defence Department (in case of military auctioned vehicles) for presentation alongwith the application for registration of motor vehicle.");

		// Part headings and content
		addTitle("Part I : In case of application for registration of fully built", fontSizes.normal, "bold");
		addTitle("motor vehicle made by owner", fontSizes.normal, "bold");


		addPara("\tCertified that .............................. (brand name of the vehicle) has been delivered by us to .............................. on .............................. (date)");

		addTitle("Part II : In case of application for registration of fully built", fontSizes.normal, "bold");
		addTitle("motor vehicle made by dealer", fontSizes.normal, "bold");
		addPara("\tCertified that .............................. (brand name of the vehicle) has been agreed to be sold by us to .............................. on .............................. (date) and the vehicle will be delivered by us to .............................. only after the registration mark assigned by the registering authority under Section 41(6) is displayed on the motor vehicle as per proviso to sub-section (6) of Section 41.");

		addTitle("Part III : In case of purchase of chassis", fontSizes.normal, "bold");
		doc.text(`${pan}`, marginLeft + 30.5, y);
		y += 1;
		addPara("\tCertified that .................................... (chassis) has been temporarily delivered by us on .............................. (date) to ..............................");

		addTitle("Part IV : Applicable in case of Part I, Part II and Part III", fontSizes.normal, "bold");
		y += 2;

		// Owner details - optimized with helper function
		const ownerFields = [
			{ label: "Name of the buyer......................................................", value: ownerName },
			{ label: "Mobile Number...........................................................", value: mobileNumber },
			{ label: "Son/Wife/daughter of..................................................", value: relativeName }
		];

		ownerFields.forEach(({ label, value }) => {
			setFont("bold", fontSizes.normal);
			doc.text(safeText(value), marginLeft + 35, y);
			y += 1;
			setFont("normal", fontSizes.normal);
			addItem(label, "", false);
		});

		// Address fields
		setFont("bold", fontSizes.normal);
		doc.text(safeText(permanentAddress), marginLeft + 35, y);
		y += 1;
		setFont("normal", fontSizes.normal);
		addPara("Address (permanent)........................................................................................................................................");
		
		setFont("bold", fontSizes.normal);
		doc.text(safeText(tempAddress), marginLeft + 35, y);
		y += 1;
		setFont("normal", fontSizes.normal);
		addPara("(temporary).......................................................................................................................................................");
		
		addItem("The vehicle is held under agreement of hire-purchase/lease/hypothecation", "with", true);
		y += 4;


		addTitle("The details of the vehicle are given below :", fontSizes.normal, "bold");

		// Vehicle details - optimized with data array
		const vehicleDetails = [
			{ number: "1.", label: "Class of vehicle", value: vehicleClass },
			{ number: "2.", label: "Maker's name", value: maker },
			{ number: "3.", label: "Chassis No.", value: vehicleChassis },
			{ number: "4.", label: "Engine No. or motor number in the case of Battery Operated Vehicles", value: engineNo },
			{ number: "5.", label: "Horse power or cubic capacity", value: horsePower },
			{ number: "6.", label: "Number of cylinders", value: cylinders },
			{ number: "7.", label: "Month and year of manufacture", value: `${manufactureMonth} / ${manufactureYear}` },
			{ number: "8.", label: "Seating capacity (including driver)", value: seatingCapacity },
			{ number: "9A.", label: "Standing capacity", value: standingCapacity }
		];

		vehicleDetails.forEach(({ number, label, value }) => {
			addFieldWithValue(label, value, number);
		});


		doc.addPage();
		y = startY;
		        
		// Remaining vehicle details - optimized
		const remainingVehicleDetails = [
			{ number: "9B.", label: "Sleeper capacity", value: sleepingCapacity },
			{ number: "10.", label: "Unladen weight", value: unladenWeight },
			{ number: "12.", label: "Colour or colours of the body", value: colors },
			{ number: "13.", label: "Gross vehicle weight", value: grossVehicleWeight },
			{ number: "14.", label: "Type of body", value: vehicalBodyType }
		];

		// Add sleeper capacity first
		addFieldWithValue("Sleeper capacity", sleepingCapacity, "9B.");

		// Add unladen weight
		addFieldWithValue("Unladen weight", unladenWeight, "10.");

		// Axle weight section
		addItem("11.", "Maximum axle weight and number and description of tyres (in case of transport vehicle)", false);
		const axleTypes = ["(a) Front axle", "(b) Rear axle", "(c) Any other axle", "(d) Tandem axle"];
		axleTypes.forEach(type => addItem("", `\t${type}`, true));

		// Add remaining details
		remainingVehicleDetails.slice(2).forEach(({ number, label, value }) => {
			addFieldWithValue(label, value, number);
		});

		addPara("* Strike out whichever is inapplicable.", fontSizes.small, fontSizes.small, "italic");

		// Signature block (bottom right)
		setFont("normal", fontSizes.normal);
		const signatureText = doc.splitTextToSize(
			"Signature of the manufacturer or dealer or officer of Defence Department or registered E-rickshaw or E-cart Association",
			70
		);
		doc.text(signatureText, pageWidth - marginRight - 70, y + 10, { align: "left", lineHeightFactor: 1.35 });

		// Generate and open PDF
		const pdfBlob = doc.output('blob');
		const pdfUrl = URL.createObjectURL(pdfBlob);
		setTimeout(() => window.open(pdfUrl), 100);
	};

	return (
		<Typography className="main">
			<Button type="primary" onClick={handleExportPdf}>Export PDF</Button>
		</Typography>
	);
};

export default Form21;