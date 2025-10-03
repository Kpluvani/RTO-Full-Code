import { HomePage } from '@/AdminPages/HomePage/pages';
import { Login } from '@/CommonPages/Login';
import { Updatepassword } from '@/CommonPages/UpdatePassword/Updatepassword';

//AdminPages
import Dealer from '@/AdminPages/Dealer/pages';
import Fuel from '@/AdminPages/Fuel/pages';
import Designation from '@/AdminPages/Designation/pages';
import InsuranceCompany from '@/AdminPages/InsuranceCompany/pages';
import Maker from '@/AdminPages/Maker/pages';
import DocumentType from '@/AdminPages/DocumentType/pages';
import InsuranceType from '@/AdminPages/InsuranceType/pages';
import Nom from '@/AdminPages/Nom/pages';
import State from '@/AdminPages/State/pages';
import District from '@/AdminPages/District/pages';
import Rto from '@/AdminPages/Rto/pages';
import OwnerCategory from '@/AdminPages/OwnerCategory/pages';
import OwnershipType from '@/AdminPages/OwnershipType/pages';
import RegistrationType from '@/AdminPages/RegistrationType/pages';
import SendRtoType from '@/AdminPages/SendRtoType/pages';
import UserRegistration from '@/AdminPages/UserRegistration/pages';
import WorkCategory from '@/AdminPages/WorkCategory/pages';
import UserCategory from '@/AdminPages/UserCategory/pages';
import VehicalType from '@/AdminPages/VehicalType/pages';
import VehicalCategory from '@/AdminPages/VehicalCategory/pages';
import VehicalClass from '@/AdminPages/VehicalClass/pages';
import UserActionManagement from '@/AdminPages/UserActionManagement/pages';
import Party from '@/AdminPages/Party/pages';
import Broker from '@/AdminPages/Broker/pages';
import VehicalBodyType from '@/AdminPages/VehicalBodyType/pages';
import VehicalPurchaseType from '@/AdminPages/VehiclePurchaseType/pages';
import Action from '@/AdminPages/Action/pages';
import MakerModelPage from '@/AdminPages/MakerModel/pages';
import Month from '@/AdminPages/Month/pages';
import Financer from '@/AdminPages/Financer/pages';
import ManufactureLocation from '@/AdminPages/ManufactureLocation/pages';
import Year from '@/AdminPages/Year/pages';
import HoldReasonPage from '@/AdminPages/HoldReason/pages';
import Process from '@/AdminPages/Process/pages';
import Service from '@/AdminPages/Service/pages';
import PurchaseAs from '@/AdminPages/PurchaseAs/pages';
import SubAgent from '@/AdminPages/SubAgent/pages';
import Rembursement from '@/AdminPages/Rembursement/pages';
import Remark from '@/AdminPages/Remark/pages';

//CustomerHome
import { UserHomePage } from '@/UserPages/HomePage/pages';
import DataEntry from '@/UserPages/DataEntry/pages';
import ServiceEntry from '@/UserPages/ServiceEntry/pages';
import NewRegistration from '@/UserPages/NewRegistration/pages';
import DocumentUpload from '@/UserPages/DocumentUpload/pages';
import HsrpEntry from '@/UserPages/HsrpEntry/pages';
import SendToRTO from '@/UserPages/SendToRto/pages';
import AccountEntry from '@/UserPages/AccountEntry/pages';
import AccountApproval from '@/UserPages/AccountApproval/pages';
import WorkDone from '@/UserPages/WorkDone/pages';
import ReceiptEntry from '@/UserPages/ReceiptEntry/pages';
import ReceiptApproval from '@/UserPages/ReceiptApproval/pages';
import Feedback from '@/UserPages/Feedback/pages';
import BulkReceipt from '@/UserPages/BulkReceipt/pages';

import EditProfile from '@/UserPages/EditProfile/pages';
import ChangePassword from '@/UserPages/ChangePassword/pages';

import RegisteredVehicalDetailsPageSearch from '@/UserPages/RegisterApplication/pages/RegisteredVehicalDetailsPageSearch';
import RegisteredVehicalDetailsPage from '@/UserPages/RegisterApplication/pages';
import BulkSendtoRto from '@/UserPages/BulkSendToRto/pages/BulkSendtoRto';
import BulkApproveByRto from '@/UserPages/BulkApproveByRto/pages/BulkApproveByRto';
import FormPages from '@/UserPages/FormPages/pages';

export const routesList = [
    { key: '', path: '/', component: <div/> },
    { key: 'login', path: '/login', component: <Login /> },
    { key: 'updatepass', path:'/updatepassword', component: <Updatepassword />}
];

export const adminRouteList = [
    { key: 'admin', path: '/admin', component: <div/> },
    { key: 'admin-home', path: '/admin/home', component: <HomePage/> },
    { key: 'dealer', path: '/admin/dealer', component: <Dealer/> },
    { key: 'designation', path: '/admin/designation', component: <Designation/> },
    { key: 'documentType', path: '/admin/documentType', component: <DocumentType/> },
    { key: 'insuranceType', path: '/admin/insuranceType', component: <InsuranceType/> },
    { key: 'fuel', path: '/admin/fuel', component: <Fuel/> },
    { key: 'insurance-company', path: '/admin/insurance-company', component: <InsuranceCompany/> },
    { key: 'maker', path: '/admin/maker', component: <Maker/> },
    { key: 'makermodel', path: '/admin/maker-model', component: <MakerModelPage/> },
    { key: 'nom', path: '/admin/nom', component: <Nom/> },
    { key: 'state', path: '/admin/state', component: <State/> },
    { key: 'district', path: '/admin/district', component: <District/> },
    { key: 'rto', path: '/admin/rto', component: <Rto/> },
    { key: 'ownerCategory', path: '/admin/owner-category', component: <OwnerCategory/> },
    { key: 'ownershipType', path: '/admin/ownership-type', component: <OwnershipType /> },
    { key: 'user-registration', path: '/admin/user-registration', component: <UserRegistration /> },
    { key: 'user-action-management', path: '/admin/user-action-management', component: <UserActionManagement /> },
    { key: 'registrationType', path: '/admin/registration-type', component: <RegistrationType /> },
    { key: 'sendRtoType', path: '/admin/send-rto-type', component: <SendRtoType /> },
    { key: 'workCategory', path: '/admin/work-category', component: <WorkCategory /> },
    { key: 'userCategory', path: '/admin/user-category', component: <UserCategory /> },
    { key: 'vehicalType', path: '/admin/vehical-type', component: <VehicalType /> },
    { key: 'vehicalCategory', path: '/admin/vehical-category', component: <VehicalCategory /> },
    { key: 'vehicalClass', path: '/admin/vehical-class', component: <VehicalClass /> },
    { key: 'party', path: '/admin/party', component: <Party /> },
    { key: 'broker', path: '/admin/broker', component: <Broker /> },
    { key: 'vehicalBodyType', path: '/admin/vehical-body-type', component: <VehicalBodyType /> },
    { key: 'vehicalPurchaseType', path: '/admin/vehical-purchase-type', component: <VehicalPurchaseType /> },
    { key: 'action', path: '/admin/action', component: <Action /> },
    { key: 'holdReason', path: '/admin/hold-reasons', component: <HoldReasonPage /> },
    { key: 'process', path: '/admin/process', component: <Process /> },
    { key: 'service', path: '/admin/service', component: <Service /> },
    { key: 'purchaseAs', path: '/admin/purchase-as', component: <PurchaseAs /> },
    { key: 'subAgent', path: '/admin/sub-agent', component: <SubAgent/> },
    { key: 'rembursement', path: '/admin/rembursement', component: <Rembursement/> },
    { key: 'remark', path: '/admin/remark', component: <Remark/> },
    { key: 'year', path: '/admin/year', component: <Year/> },
    { key: 'month', path: '/admin/month', component: <Month/> },    
    { key: 'manufacture-location', path: '/admin/manufacture-location', component: <ManufactureLocation/> },    
    { key: 'financer', path: '/admin/financer', component: <Financer/> },
];

export const userRouteList = [
    { key: 'home', path: '/home', component: <UserHomePage/> },
    { key: 'new-registration', path: '/new-registration', component: <NewRegistration/> },
    { key: 'data-entry', path: '/data-entry', component: <DataEntry/> },
    { key: 'data-approval', path: '/data-approval', component: <DataEntry/> },
    { key: 'service-entry', path: '/service-entry', component: <ServiceEntry/> },
    { key: 'service-approval', path: '/service-approval', component: <ServiceEntry/> },
    { key: 'document-upload', path: '/document-upload', component: <DocumentUpload/> },
    { key: 'document-verify', path: '/document-verify', component: <DocumentUpload/> },
    { key: 'account-entry', path: '/account-entry', component: <AccountEntry/> },
    { key: 'account-approval', path: '/account-approval', component: <AccountApproval/> },
    { key: 'receipt-entry', path: '/receipt-entry', component: <ReceiptEntry/> },
    { key: 'receipt-approval', path: '/receipt-approval', component: <ReceiptApproval/> },
    { key: 'send-to-rto', path: '/send-to-rto', component: <SendToRTO/> },
    { key: 'approve-by-rto', path: '/approve-by-rto', component: <SendToRTO/> },
    { key: 'hsrp', path: '/hsrp', component: <HsrpEntry/> },
    { key: 'work-done', path: '/work-done', component: <WorkDone/> },
    { key: 'feedback', path: '/feedback', component: <Feedback/> },
    { key: 'register-application', path: '/register-application', component: <RegisteredVehicalDetailsPageSearch/> },
    { key: 'register-vehical-details', path: '/register-vehical-details', component: <RegisteredVehicalDetailsPage/> },
    { key: 'bulk-approve-by-rto', path: '/bulk-approve-by-rto', component: <BulkApproveByRto /> },
    { key: 'bulk-send-to-rto', path: '/bulk-send-to-rto', component: <BulkSendtoRto /> },
    { key: 'bulk-receipt', path: '/bulk-receipt', component: <BulkReceipt/> },
    { key: 'edit-profile', path: '/edit-profile', component: <EditProfile/> },
    { key: 'change-password', path: '/change-password', component: <ChangePassword/> },
    { key: 'form-pages', path: '/form-pages', component: <FormPages/> },
];