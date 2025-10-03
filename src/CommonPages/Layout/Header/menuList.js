export const reportMenuItems = [
    { key: "1", label: "Daily Report" },
    { key: "2", label: "Monthly Report" },
    { key: "3", label: "Annual Report" },
];

export const profileMenuItems = [
    { key: "1", label: "Edit Profile" },
    { key: "2", label: "Change Password" },
    { key: "3", label: "Settings" },
];

export const paymentMenuItems = [
    // { key: "/payment-receipt", label: "Payment Receipt" },
    { key: "/bulk-receipt", label: "Bulk Receipt" },
];

export const masterMenuItems = [
    {
        key: 'parties-broker',
        label: 'Parties & Brokers',
        children: [
        { key: '/admin/dealer', label: 'Dealer' },
        { key: '/admin/party', label: 'Party' },
        { key: '/admin/broker', label: 'Broker' },
        { key: '/admin/sub-agent', label: 'Sub Agent' },
        { key: '/admin/rembursement', label: 'Rembursement' },
        ],
    },
    {
        key: 'insurance',
        label: 'Insurance',
        children: [
        { key: '/admin/insurance-company', label: 'Insurance Company' },
        { key: '/admin/insuranceType', label: 'Insurance Type' },
        ],
    },
    {
        key: 'maker',
        label: 'Maker',
        children: [
        { key: '/admin/maker', label: 'Maker' },
        { key: '/admin/maker-model', label: 'Maker Model' },
        ],
    },
    {
        key: 'owner',
        label: 'Owner',
        children: [
        { key: '/admin/owner-category', label: 'Owner Category' },
        { key: '/admin/ownership-type', label: 'Owner Ship Type' },
        ],
    },
    {
        key: 'location',
        label: 'Location',
        children: [
        { key: '/admin/state', label: 'State' },
        { key: '/admin/district', label: 'District' },
        ],
    },
    
     {
        key: 'rto',
        label: 'RTO',
        children: [
        { key: '/admin/rto', label: 'RTO' },
        { key: '/admin/send-rto-type', label: 'Send Rto Type' },
        ],
    },
    {
        key: 'user',
        label: 'User & Roles',
        children: [
        { key: '/admin/designation', label: 'Designation' },
        { key: '/admin/user-category', label: 'User Category' },
        ],
    },
    {
        key: 'process',
        label: 'Process & Work',
        children: [
        { key: '/admin/process', label: 'Process' },
        { key: '/admin/service', label: 'Service' },
        { key: '/admin/action', label: 'Action' },
        { key: '/admin/work-category', label: 'Work Category' },
        ],
    },
    {
        key: 'vehicle',
        label: 'Vehicle',
        children: [
        { key: '/admin/vehical-type', label: 'Vehical Type' },
        { key: '/admin/vehical-category', label: 'Vehical Category' },
        { key: '/admin/vehical-class', label: 'Vehical Class' },
        { key: '/admin/vehical-body-type', label: 'Vehical Body Type' },
        { key: '/admin/vehical-purchase-type', label: 'Vehicle Purchase Type' },
        ],
    },
    {
        key: 'manufacture',
        label: 'Manufacture',
        children: [
            { key: '/admin/year', label: 'Year' },
            { key: '/admin/month', label: 'Month' },        
            { key: '/admin/manufacture-location', label: 'Location' },        
        ],
    },
    {
        key: 'misc',
        label: 'Miscellaneous',
        children: [
        { key: '/admin/financer', label: 'Financer' },
        { key: '/admin/fuel', label: 'Fuel' },
        { key: '/admin/documentType', label: 'Document Type' },
        { key: '/admin/registration-type', label: 'Registration Type' },
        { key: '/admin/nom', label: 'Nom' },
        { key: '/admin/hold-reasons', label: 'Hold Reason' },
        { key: '/admin/purchase-as', label: 'Purchase As' },
        { key: '/admin/remark', label: 'Remark' },
        ],
    },
];
