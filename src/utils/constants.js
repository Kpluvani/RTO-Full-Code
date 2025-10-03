export const WorkCategory = {
    NEW_RC: 'new rc',
    OLD_RC: 'old rc',
    DL: 'dl',
}

export const Action = {
    CREATE_MODIFY_USER: 'Create/Modify User',
    VIEW_USER: 'View User',
    ASSIGN_ROLE_ACTION: 'Assign Role/Action',
    ENTRY_NEW_REGISTRATION: 'Entry New Registration',
}
export const ActionValue = {
    ENTRY_NEW_REGISTRATION: 'data-entry',
}

export const AdminActions = [
    Action.CREATE_MODIFY_USER,
    Action.ASSIGN_ROLE_ACTION,
    // Action.VIEW_USER,
]

export const UserActions = [
    { value: ActionValue.ENTRY_NEW_REGISTRATION, label: Action.ENTRY_NEW_REGISTRATION }
]

export const YES = 'Yes';
export const NO = 'No';
export const BoolActions = [YES, NO];

export const APPLICABLE = 'Applicable';
export const NOT_APPLICABLE = 'Not Applicable';
export const ApplicableActions = [APPLICABLE, NOT_APPLICABLE];

export const InsurancePeriods = [1, 2, 3, 4, 5];
export const PucPeriods = [1, 2, 3, 4, 5];
export const FitneesPeriods = [1, 2, 3, 4, 5];

export const TaxModeOptions = ['LIFE TIME', 'MONTHLY', 'QUARTERLY', 'HALF YEARLY']

export const FILE_MOVEMENT_TYPE = {
    NEXT: 'next',
    HOLD: 'hold',
    REVERT: 'revert',
    SKIP: 'skip'
}

export const ServicesInDataEntry = [
    { key: "rf-registration-fee", name: "RF (Registration Fee)", required: true },
    { key: "smart-card", name: "Smart Card", required: true },
    { key: "permit", name: "Permit", required: false },
    { key: "hpa", name: "HPA", required: false },
    { key: "fitness", name: "Fitness", required: false },
]

export const IncomeCategoryType = {
    Broker: 'Broker',
    Party: 'Party',
    Dealer: 'Dealer'
};
export const IncomeCategories = [
    { key: IncomeCategoryType.Broker, name: 'Broker' },
    { key: IncomeCategoryType.Party, name: 'Party' },
    { key: IncomeCategoryType.Dealer, name: 'Dealer' },
];

export const ExpenseCategoryType = {
    SubAgent: 'Sub Agent',
    Rembursement: 'Rembursement',
};
export const ExpenseCategories = [
    { key: ExpenseCategoryType.SubAgent, name: 'Sub Agent' },
    { key: ExpenseCategoryType.Rembursement, name: 'Rembursement' },
];

export const ReceiptAccountCategories = [
    IncomeCategoryType.Broker,
    IncomeCategoryType.Party,
    IncomeCategoryType.Dealer,
    ExpenseCategoryType.SubAgent,
    ExpenseCategoryType.Rembursement
];

export const PaymentCategoryType = {
    Income: 'Income',
    Expense: 'Expense'
}
export const PaymentCategories = [PaymentCategoryType.Income, PaymentCategoryType.Expense];

export const Mode = {
    Cash: 'Cash',
    Online: 'Online'
}
export const PaymentMode = [Mode.Cash, Mode.Online];

export const PaymentPurposeType = {
    OfficialFee: 'Official Fee',
    AgentFee: 'Agent Fee',
}
export const PaymentPurposes = [PaymentPurposeType.OfficialFee, PaymentPurposeType.AgentFee];

export const Status = {
    InProcess: 'InProcess',
    Completed: 'Completed',
    OnHold: 'OnHold',
    Skipped: 'Skipped'
};

export const PayStatus = {
    Paid: 'paid',
    HalfPaid: 'halfPaid',
    Unpaid: 'unpaid',
};
export const PayStatusBColor = {
  [PayStatus.Paid]: '#D1E7DD',
  [PayStatus.HalfPaid]: '#FFF3CD',
  [PayStatus.Unpaid]: '#FFCDCD'
}
export const PayStatusColor = {
  [PayStatus.Paid]: '#0F5132',
  [PayStatus.HalfPaid]: '#664D03',
  [PayStatus.Unpaid]: '#591818'
}