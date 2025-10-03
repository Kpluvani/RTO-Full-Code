import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import dealerReducer from '../features/dealer/dealerSlice';
import fuelReducer from '../features/fuel/fuelSlice';
import designationReducer from '../features/designation/designationSlice';
import insuranceCompanyReducer from '../features/insuranceCompany/insuranceCompanySlice';
import makerReducer from '../features/maker/makerSlice';
import documentTypeReducer from '../features/documentType/documentTypeSlice';
import insuranceTypeReducer from '../features/insuranceType/insuranceTypeSlice';
import nomReducer from '../features/nom/nomSlice';
import rtoReducer from '../features/rto/rtoSlice';
import ownerCategoryReducer from '../features/ownerCategory/ownerCategorySlice';
import ownershipTypeReducer from '../features/ownershipType/ownershipTypeSlice';
import stateReducer from '../features/state/stateSlice';
import districtReducer from '../features/district/districtSlice';
import registrationTypeReducer from '../features/registrationType/registrationTypeSlice';
import sendRtoTypeReducer from '../features/sendRtoType/sendRtoTypeSlice';
import workCategoryReducer from '../features/workCategory/workCategorySlice';
import userCategoryReducer from '../features/userCategory/userCategorySlice';
import vehicalTypeReducer from '../features/vehicalType/vehicalTypeSlice';
import vehicalCategoryReducer from '../features/vehicalCategory/vehicalCategorySlice';
import vehicalClassReducer from '../features/vehicalClass/vehicalClassSlice';
import userReducer from '../features/user/userSlice';
import partyReducer from '../features/party/partySlice';
import brokerReducer from '../features/broker/brokerSlice';
import vehicalBodyTypeReducer from '../features/vehicalBodyType/vehicalBodyTypeSlice';
import vehicalPurchaseTypeReducer from '../features/vehicalPurchaseType/vehicalPurchaseTypeSlice';
import actionReducer from '../features/action/actionSlice';
import MakerModelReducer from '../features/MakerModel/MakerModelSlice';
import monthReducer from '../features/month/monthSlice';
import financerReducer from '../features/financer/financerSlice';
import manufactureLocationReducer from '../features/manufactureLocation/manufactureLocationSlice';
import yearReducer from '../features/year/yearSlice';
import HoldReasonReducer from '../features/HoldReason/HoldReasonSlice';
import processReducer from '../features/process/processSlice';
import userActionReducer from '../features/userAction/userActionSlice';
import serviceReducer from '../features/service/serviceSlice';
import applicationReducer from '../features/application/applicationSlice';
import purchaseAsReducer from '../features/purchaseAs/purchaseAsSlice';
import applicationProcessStatus from '../features/applicationProcessStatus/applicationProcessStatusSlice';
import subAgentReducer from '../features/subAgent/subAgentSlice';
import rembursementReducer from '../features/rembursement/rembursementSlice';
import remarkReducer from '../features/remark/remarkSlice';
import accountEntryReducer from '@/features/accountEntry/accountEntrySlice';
import ownerDetailsReducer from '@/features/ownerDetails/ownerDetailsSlice';
import feedbackReducer from '@/features/feedback/feedbackSlice';
import bulkSendToRtoApplicationReducer from '@/features/bulkSendToRtoApplication/getBulkSendToRtoApplicationSlice';
import bulkApproveByRtoApplicationReducer from '@/features/bulkApproveByRtoApplication/getBulkApproveByRtoApplicationSlice';
import bulkReceiptReducer from '@/features/bulkReceipt/bulkReceiptSlice';
import mastersListReducer from '@/features/masterList/masterListSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add your slices here
    dealer: dealerReducer,
    fuel: fuelReducer,
    designation: designationReducer,
    insuranceCompany: insuranceCompanyReducer,
    maker: makerReducer,
    month: monthReducer,
    year: yearReducer,
    documentType: documentTypeReducer,
    insuranceType: insuranceTypeReducer,
    nom: nomReducer,
    state: stateReducer,
    district: districtReducer,
    rto: rtoReducer,
    ownerCategory: ownerCategoryReducer,
    ownershipType: ownershipTypeReducer,
    registrationType: registrationTypeReducer,
    sendRtoType: sendRtoTypeReducer,
    workCategory: workCategoryReducer,
    userCategory: userCategoryReducer,
    vehicalType: vehicalTypeReducer,
    vehicalCategory: vehicalCategoryReducer,
    vehicalClass: vehicalClassReducer,
    user: userReducer,
    party: partyReducer,
    broker: brokerReducer,
    vehicalBodyType: vehicalBodyTypeReducer,
    vehicalPurchaseType: vehicalPurchaseTypeReducer,
    action: actionReducer,
    makerModel:MakerModelReducer,
    holdReason:HoldReasonReducer,
    process: processReducer,
    userAction: userActionReducer,
    service: serviceReducer,
    application: applicationReducer,
    purchaseAs: purchaseAsReducer,
    applicationProcessStatus: applicationProcessStatus,
    subAgent: subAgentReducer,
    rembursement: rembursementReducer,
    remark: remarkReducer,
    accountEntry: accountEntryReducer,
    owner: ownerDetailsReducer,
    feedback: feedbackReducer,
    bulkSendToRtoApplication: bulkSendToRtoApplicationReducer,
    bulkApproveByRtoApplication: bulkApproveByRtoApplicationReducer,
    bulkReceipt: bulkReceiptReducer,
    mastersList: mastersListReducer,
    financer: financerReducer,
    manufactureLocation: manufactureLocationReducer
  },
});