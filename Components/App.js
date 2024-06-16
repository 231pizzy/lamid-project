import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { LoadingView } from './LoadingView';
import { ShareDocument } from './Tools/ShareDocument';
import QuickBook from './Quickbook/Quickbook';
import QuickBookRedirect from './Quickbook/QuickbookRedirect';
//import RootLayout from './RootLayout/RootLayout';
const Login = lazy(() => import('./Login/Login'));
const IndexPage = lazy(() => import('./IndexPage/IndexPage'));
const ReceiveOtp = lazy(() => import('./ReceiveOtp/ReceiveOtp'));
const InputOtpCode = lazy(() => import('./InputOtpCode/InputOtpCode'));
const Register = lazy(() => import('./Register/Register'));
const AdminDashboard = lazy(() => import('./AdminDashboard/AdminDashboard'));
const StaffDashboard = lazy(() => import('./StaffDashboard/StaffDashboard'));
const NewPasword = lazy(() => import('./NewPassword/NewPassword'));

const RootLayout = lazy(() => import('./RootLayout/RootLayout'));
const AdminRootLayout = lazy(() => import('./AdminRootLayout/AdminRootLayout'));
const Tools = lazy(() => import('./Tools/Tools'));
const Contact = lazy(() => import('./Contact/Contact'));
const ProjectGroup = lazy(() => import('./ProjectGroup/ProjectGroup'));
const Team = lazy(() => import('./Team/Team'));
const Staff = lazy(() => import('./Staff/Staff'));
const AdminProfile = lazy(() => import('./AdminProfile/AdminProfile'));

const MyProfile = lazy(() => import('./MyProfile/MyProfile'));
const StaffProfile = lazy(() => import('./Staff/StaffProfile/Staff'));

const Goals = lazy(() => import('./Goals/Goals'));
const Document = lazy(() => import('./Document/Document'));
const Page404 = lazy(() => import('./Page404/Page404'));
const EditProfile = lazy(() => import('./Staff/StaffProfile/EditProfile'));
const CV = lazy(() => import('./Staff/CV'));
const TeamDetails = lazy(() => import('./Team/TeamDetails'));
const StaffHome = lazy(() => import('./Staff/StaffProfile/Staff'));
const Crm = lazy(() => import('./Tools/Crm'));

const ToolsDocument = lazy(() => import('./Tools/Document'));
const Forms = lazy(() => import('./Tools/Forms'));
const FormBuilder = lazy(() => import('./Forms/FormBuilder'));
const FillForm = lazy(() => import('./Forms/FillForm'));
const FormDetails = lazy(() => import('./Tools/FormDetails'));
const ProjectGroupDetails = lazy(() => import('./ProjectGroup/projectDetails/ProjectGroupDetails'));
const CalendarView = lazy(() => import('./Calendar/Calendar'));
const Privilege = lazy(() => import('./Privilege/Privilege'));

const TestComponent = lazy(() => import('./ResourceUsageSheet'));

/* import { GoalDetails } from './ProjectGroup/projectDetails/GoalDetails'; */

function App() {
  /*  useEffect(() => {
     document.title = 'Lamid Consulting';
   }, []) */


  return (
    <BrowserRouter >
      <Suspense fallback={<LoadingView />} >
        <Routes >
          <Route path='loading' element={<LoadingView />} />
          {/* Routes for login and password reset */}
          <Route path='/' element={<RootLayout />} >
            <Route index element={<IndexPage />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='receive-otp' element={<ReceiveOtp />} />
            <Route path='input-otp' element={<InputOtpCode />} />
            <Route path='staff' element={<StaffDashboard />} />
            <Route path='new-password' element={<NewPasword />} />

            <Route path='*' element={<Page404 />} />
          </Route>

          {/* Routes for admin panel */}
          <Route path='/admin' element={<AdminRootLayout />} >
            <Route index element={<AdminDashboard />} />
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='tools' element={<Tools />} />
            <Route path='contact' element={<Contact />} />
            <Route path='project-group' element={<ProjectGroup />} />
            <Route path='staff' element={<Staff />} />
            <Route path='download-document/*' element={<ShareDocument />} />

            <Route path='staff-profile' element={<StaffProfile />} />

            <Route path='cv' element={<CV />} />
            <Route path='usage' element={<TestComponent />} />

            <Route path='my-profile' element={<MyProfile />} />


            <Route path='quickbook' element={<QuickBook />} />

            <Route path='edit-profile' element={<EditProfile />} />
            <Route path='my-calendar' element={<CalendarView />} />
            <Route path='my-goals' element={<Goals />} />
            <Route path='my-document' element={<Document />} />
            <Route path='form-builder' element={<FormBuilder />} />
            <Route path='crm' element={<Crm />} />
            <Route path='privilege' element={<Privilege />} />
            <Route path='documents' element={<ToolsDocument />} />
            {/*   <Route path='goal-detail/*' element={<GoalDetails />} /> */}
            <Route path='forms' element={<Forms />} />
            <Route path='project-group-detail/*' element={<ProjectGroupDetails />} />
            <Route path='fill-form/*' element={<FillForm />} />
            <Route path='forms/*' element={<FormDetails />} />
            <Route path='team' element={<Team />} />
            <Route path='team/*' element={<TeamDetails />} />
            <Route path='*' element={<Page404 />} />
          </Route>


          <Route path='/quickbook-redirect' element={<QuickBookRedirect />} />



          {/* Routes for staff panel: StaffRootLayout not done yet so we are staging with Admin */}
          <Route path='/staff' element={<AdminRootLayout />}>
            <Route index element={<StaffDashboard />} />
            <Route path='fill-form/*' element={<FillForm />} />
            <Route path='*' element={<Page404 />} />
          </Route>
        </Routes>
      </Suspense>

    </BrowserRouter>
  );
}

export default App;
