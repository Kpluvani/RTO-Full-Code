// utils/applicationUtils.js

export const extractApplicationData = (application) => {
    console.log("Extracting data from application:", application);
    if (!application) return {};

    
  return {
    ownerName: application?.OwnerDetail?.owner_name || "",
    relativeName: application?.OwnerDetail?.relative_name || "",
    permanentAddress: application?.PermanentAddress?.house_no || "",
    tempAddress: application?.CurrentAddress?.house_no || "",
    ownershipType: application?.OwnershipType?.name || "",
    mobileNumber: application?.OwnerDetail?.mobile_number || "",
    panNumber: application?.OwnerDetail?.pan_no || "",
    vehicleChassis: application?.VehicleDetail?.chassis_no || "",
    height: application?.VehicleDetail?.height || "",
    floorArea: application?.VehicleDetail?.floor_area || "",
    width: application?.VehicleDetail?.width || "",
    length: application?.VehicleDetail?.length || "",
    CC: application?.VehicleDetail?.cubic_capacity || "",
    vehicleClass: application?.VehicleDetail?.VehicleClass?.name || "",
    registrationNumber: application?.VehicleDetail?.registration_no || "",
    vehicalBodyType: application?.VehicleDetail?.VehicleBodyType?.name || "",
    vehicalType: application?.VehicleDetail?.VehicleType?.name || "",
    maker: application?.VehicleDetail?.Maker?.name || "",
    makerModel: application?.VehicleDetail?.MakerModel?.name ?? "",
    fuel: application?.VehicleDetail?.Fuel?.name ?? "",
    norms: application?.VehicleDetail?.Nom?.name ?? "",
    manufactureMonth: application?.VehicleDetail?.Month?.name || "",
    manufactureYear: application?.VehicleDetail?.Year?.name || "",
    cylinders: application?.VehicleDetail?.cylinders || "",
    cubicCapacity: application?.VehicleDetail?.cubic_capacity || "",
    horsePower: application?.VehicleDetail?.horse_power || "",
    wheelbase: application?.VehicleDetail?.wheelbase || "",
    engineNo: application?.VehicleDetail?.engine_no || "",
    standingCapacity: application?.VehicleDetail?.standing_capacity ?? "",
    sleepingCapacity: application?.VehicleDetail?.sleeping_capacity || "",
    seatingCapacity: application?.VehicleDetail?.seating_capacity || "",
    grossVehicleWeight: application?.VehicleDetail?.laden_weight || "",
    unladenWeight: application?.VehicleDetail?.unladen_weight || "",
    colors: application?.VehicleDetail?.color || "",
    // hypothicateName: application?.Hypothicate?.name || "",

  };
};
