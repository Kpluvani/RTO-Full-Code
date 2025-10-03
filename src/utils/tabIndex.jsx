// In your DocumentsValidity component, add this at the end
export const useDocumentsValidityTabIndex = () => {
  // This hook can be used to get the final tab index calculation logic
  const calculateFinalTabIndex = (startIndex = 0) => {
    // Count all focusable elements in your DocumentsValidity component
    const focusableElementsCount = 
    //   1 + // Followed Up All checkbox
    //   1 + // Insurance Details Followed Up checkbox
      6 + // Insurance Details fields (3 cols × 2 rows)
      1 + // Is Vehicle Hypothecated checkbox
      1 + // Financer Name select (conditional)
      4 + // PUC Details checkboxes (2) + fields (4)
      8 + // Tax fields + checkboxes
      1 + // Show Official Services checkbox
      (showServices ? ServicesInDataEntry.length + 1 : 0) + // Official Services fields + Reflect checkbox
      8 + // Fitness fields + checkboxes
      6 + // Gujarat Permit fields + checkboxes
      6 + // National Permit fields + checkboxes
      7;  // CNG fields + checkbox
    
    return startIndex + focusableElementsCount;
  };

  return { calculateFinalTabIndex };
};

// Or simply export a constant with the count
export const DOCUMENTS_VALIDITY_FOCUSABLE_COUNT = 50; // Adjust this number based on your actual count