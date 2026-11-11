import React, { useState, useMemo } from 'react';
import { PatientLoginIcon, NurseLoginIcon, DoctorLoginIcon, AdminLoginIcon, InternIcon, ReceptionistLoginIcon } from './icons';
import type { Patient } from '../types';

interface LoginViewProps {
  onStaffLogin: (role: string) => void;
  onPatientLogin: (pid: string, password: string) => Patient | null;
  onPatientSignUp: (details: Omit<Patient, 'id' | 'triageInfo' | 'clinicalNotes' | 'prescriptions' | 'referrals' | 'bloodType'>) => Patient;
  onFindPatientByPhone: (phoneNumber: string) => Patient | null;
  onResetPassword: (phoneNumber: string, newPassword: string) => Patient | null;
}

const ActionCard: React.FC<{
  role: string;
  icon: React.ElementType;
  text?: string;
  onSelect: () => void;
}> = ({ role, icon: Icon, text, onSelect }) => (
  <button
    onClick={onSelect}
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center w-full sm:w-64 lg:w-72"
  >
    <Icon className="h-14 w-14 text-srm-blue transition-colors duration-300" />
    <span className="mt-4 text-xl font-bold text-gray-800">{role}</span>
    <p className="mt-2 text-sm text-gray-600 h-20">{text}</p>
  </button>
);


const PatientPortal: React.FC<{
    onLogin: (pid: string, password: string) => Patient | null;
    onSignUp: (details: Omit<Patient, 'id' | 'triageInfo' | 'clinicalNotes' | 'prescriptions' | 'referrals' | 'bloodType'>) => Patient;
    onBack: () => void;
    onFindPatientByPhone: (phoneNumber: string) => Patient | null;
    onResetPassword: (phoneNumber: string, newPassword: string) => Patient | null;
}> = ({ onLogin, onSignUp, onBack, onFindPatientByPhone, onResetPassword }) => {
    const [mode, setMode] = useState<'options' | 'login' | 'signup' | 'recovery'>('options');
    
    // Login State
    const [loginStep, setLoginStep] = useState<'pid' | 'password'>('pid');
    const [pid, setPid] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Signup State
    const [signupStep, setSignupStep] = useState(0);
    const [signupData, setSignupData] = useState({
        name: '', dob: '', gender: 'Male' as Patient['gender'],
        maritalStatus: 'Single' as Patient['maritalStatus'], guardianName: '',
        phoneNumber: '', otp: '', email: '', password: '', confirmPassword: ''
    });
    const [signupError, setSignupError] = useState('');
    const [newlyCreatedPatient, setNewlyCreatedPatient] = useState<Patient | null>(null);
    
    // Recovery State
    const [recoveryStep, setRecoveryStep] = useState<'mobile' | 'otp' | 'reset'>('mobile');
    const [recoveryPhone, setRecoveryPhone] = useState('');
    const [recoveryOtp, setRecoveryOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [recoveryError, setRecoveryError] = useState('');
    const [recoveredPatient, setRecoveredPatient] = useState<Patient | null>(null);

    const today = new Date().toISOString().split("T")[0];

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        if (loginStep === 'pid') {
            if (pid.trim()) setLoginStep('password');
        } else {
            const patient = onLogin(pid, password);
            if (!patient) {
                setLoginError('Login Failed: Invalid Patient ID or Password.');
                setLoginStep('pid');
                setPid('');
                setPassword('');
            }
        }
    };
    
    const signupSteps = useMemo(() => {
        const steps = [
            { key: 'name', label: "Please provide the Patient's Full Name.", type: 'text' },
            { key: 'dob', label: "What is the Date of Birth?", type: 'date' },
            { key: 'gender', label: "Please select Gender.", type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
            { key: 'maritalStatus', label: "What is the Marital Status?", type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
            { key: 'guardianName', label: "Please provide Guardian's Name.", type: 'text' },
            { key: 'phoneNumber', label: "What is the 10-digit Mobile Number for Alerts?", type: 'tel' },
            { key: 'otp', label: `An OTP has been sent to +91 ${signupData.phoneNumber}. Please enter the 6-digit OTP.`, type: 'number' },
            { key: 'email', label: "Please provide an Email Address (Optional).", type: 'email' },
            { key: 'password', label: "Please Create a Password.", type: 'password' },
            { key: 'confirmPassword', label: "Please Confirm your Password.", type: 'password' },
        ];
        
        return steps;
    }, [signupData.phoneNumber]);

    const currentStepConfig = signupSteps[signupStep];
    
    const calculateAge = (dobString: string): number => {
        const parts = dobString.split('.');
        if (parts.length !== 3) return 0;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
        
        const birthDate = new Date(year, month, day);
        if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
            return 0;
        }

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 0 ? age : 0;
    };


    const handleSignupNext = (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError('');
        
        const currentValue = signupData[currentStepConfig.key as keyof typeof signupData];
        if(currentStepConfig.key !== 'email' && !currentValue.trim()) {
            setSignupError("This field is required.");
            return;
        }

        if (currentStepConfig.key === 'phoneNumber' && signupData.phoneNumber.length !== 10) {
            setSignupError("Mobile Number must be 10 digits.");
            return;
        }

        if (currentStepConfig.key === 'otp' && signupData.otp !== '785421') {
            setSignupError("Invalid OTP. Please try again.");
            return;
        }
        
        if (currentStepConfig.key === 'confirmPassword' && signupData.password !== signupData.confirmPassword) {
            setSignupError("Passwords do not match. Please re-enter.");
            setSignupData(p => ({...p, password: '', confirmPassword: ''}));
            setSignupStep(signupStep - 1);
            return;
        }

        if (signupStep < signupSteps.length - 1) {
            setSignupStep(prev => prev + 1);
        } else {
            const dobParts = signupData.dob.split('-');
            const formattedDob = dobParts.length === 3 ? `${dobParts[2]}.${dobParts[1]}.${dobParts[0]}` : signupData.dob;

            const patientAge = calculateAge(formattedDob);
            if (patientAge <= 0) {
                setSignupError("Please enter a valid Date of Birth.");
                setSignupStep(signupSteps.findIndex(s => s.key === 'dob'));
                return;
            }

            const newPatient = onSignUp({
                name: signupData.name,
                age: patientAge,
                gender: signupData.gender,
                dob: formattedDob,
                maritalStatus: signupData.maritalStatus,
                guardianName: signupData.guardianName,
                phoneNumber: signupData.phoneNumber,
                email: signupData.email,
                password: signupData.password,
                medicalHistory: { pastConditions: [], surgeries: [] },
            });
            setNewlyCreatedPatient(newPatient);
            setMode('options');
        }
    };
    
    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSignupData(prev => ({ ...prev, [currentStepConfig.key]: e.target.value }));
    };

    const handleRecoverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRecoveryError('');
        if (recoveryStep === 'mobile') {
            if (onFindPatientByPhone(recoveryPhone)) {
                setRecoveryStep('otp');
            } else {
                setRecoveryError('No patient account found with this mobile number.');
            }
        } else if (recoveryStep === 'otp') {
            if (recoveryOtp === '123456') {
                const patient = onFindPatientByPhone(recoveryPhone);
                setRecoveredPatient(patient);
                setRecoveryStep('reset');
            } else {
                setRecoveryError('Invalid OTP. Please try again.');
            }
        } else if (recoveryStep === 'reset') {
            if (newPassword.length < 4) {
                setRecoveryError('Password must be at least 4 characters.');
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setRecoveryError('Passwords do not match.');
                return;
            }
            onResetPassword(recoveryPhone, newPassword);
            setMode('login');
            setRecoveryStep('mobile');
            setRecoveryPhone('');
            setRecoveryOtp('');
            setNewPassword('');
            setConfirmNewPassword('');
            setRecoveredPatient(null);
            setPid(recoveredPatient?.id || '');
            setLoginStep('password');
        }
    };

    if (newlyCreatedPatient) {
        return (
             <div className="text-center">
                <h3 className="text-2xl font-bold text-srm-green">Registration Successful!</h3>
                <p className="mt-4 text-gray-700">Your unique Patient ID (PID) is:</p>
                <p className="mt-2 text-xl font-mono p-3 bg-srm-lightblue rounded-lg text-srm-blue tracking-wider font-bold">{newlyCreatedPatient.id}</p>
                <p className="mt-4 text-sm text-gray-600">You can now use your PID and Password to Login.</p>
                <div className="flex gap-4 mt-6">
                     <button onClick={() => { setNewlyCreatedPatient(null); setMode('login'); }} className="w-full bg-srm-blue text-white py-2 px-4 rounded-md font-semibold">
                        1) Login now
                    </button>
                     <button onClick={() => { setNewlyCreatedPatient(null); setMode('signup'); setSignupStep(0); }} className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-semibold">
                        2) Sign Up another patient
                    </button>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        switch (mode) {
            case 'login':
                return (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <h3 className="text-xl font-bold text-center text-gray-800">Login</h3>
                        {loginStep === 'pid' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patient ID (PID)</label>
                                <input type="text" value={pid} onChange={e => setPid(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-srm-blue focus:border-srm-blue" required autoFocus />
                            </div>
                        ) : (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-srm-blue focus:border-srm-blue" required autoFocus />
                            </div>
                        )}
                        {loginError && <p className="text-sm text-red-600 text-center">{loginError}</p>}
                        <button type="submit" className="w-full bg-srm-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90">{loginStep === 'pid' ? 'Next' : 'Login'}</button>
                        <div className="text-center">
                            <button type="button" onClick={() => setMode('recovery')} className="text-sm text-srm-blue hover:underline">Forgot PID / Password?</button>
                        </div>
                    </form>
                );
            case 'signup':
                return (
                    <form onSubmit={handleSignupNext} className="space-y-4">
                         <h3 className="text-xl font-bold text-center text-gray-800">Welcome to New Patient Registration</h3>
                         <div className="text-center text-sm text-gray-500">Please provide the following details:</div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{currentStepConfig.label}</label>
                            {currentStepConfig.key === 'otp' && (
                                <p className="text-xs text-center p-2 rounded-md bg-yellow-100 text-yellow-800 mb-2">[System Message] An OTP has been sent. (Simulated OTP: 785421)</p>
                            )}
                            {currentStepConfig.type === 'select' ? (
                                <select value={signupData[currentStepConfig.key as keyof typeof signupData]} onChange={handleSignupChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white" required>
                                    {currentStepConfig.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input 
                                    type={currentStepConfig.type} 
                                    value={signupData[currentStepConfig.key as keyof typeof signupData]}
                                    onChange={handleSignupChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required={currentStepConfig.key !== 'email'} autoFocus
                                    max={currentStepConfig.key === 'dob' ? today : undefined}
                                />
                            )}
                         </div>
                         {signupError && <p className="text-sm text-red-600">{signupError}</p>}
                         <button type="submit" className="w-full bg-srm-green text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90">
                            Next
                         </button>
                    </form>
                );
             case 'recovery':
                return (
                    <form onSubmit={handleRecoverySubmit} className="space-y-4">
                        <h3 className="text-xl font-bold text-center text-gray-800">Account Recovery</h3>
                        {recoveryStep === 'mobile' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registered Mobile Number</label>
                                <input type="tel" value={recoveryPhone} onChange={e => setRecoveryPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" required autoFocus />
                            </div>
                        )}
                        {recoveryStep === 'otp' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                                 <p className="text-xs text-center p-2 rounded-md bg-yellow-100 text-yellow-800 mb-2">[System Message] An OTP has been sent. (Simulated OTP: 123456)</p>
                                <input type="text" value={recoveryOtp} onChange={e => setRecoveryOtp(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" required autoFocus />
                            </div>
                        )}
                        {recoveryStep === 'reset' && recoveredPatient && (
                            <div className="space-y-4">
                                <div className="text-center bg-srm-lightblue p-3 rounded-md">
                                    <p className="text-sm text-gray-700">Your Patient ID is:</p>
                                    <p className="font-bold text-lg text-srm-blue font-mono">{recoveredPatient.id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" required autoFocus />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
                                </div>
                            </div>
                        )}
                        {recoveryError && <p className="text-sm text-red-600 text-center">{recoveryError}</p>}
                        <button type="submit" className="w-full bg-srm-blue text-white py-2 px-4 rounded-md font-semibold">
                            {recoveryStep === 'reset' ? 'Reset Password' : 'Next'}
                        </button>
                    </form>
                );

            case 'options':
            default:
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-800">Patient Portal</h3>
                        <p className="text-gray-600 mt-1">Please choose an option to begin.</p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button onClick={() => { setMode('signup'); setSignupStep(0); }} className="w-full bg-srm-green text-white py-3 px-4 rounded-md font-semibold hover:bg-opacity-90 transition-all">
                                1) Sign Up (New Patient)
                            </button>
                            <button onClick={() => setMode('login')} className="w-full bg-srm-blue text-white py-3 px-4 rounded-md font-semibold hover:bg-opacity-90 transition-all">
                                2) Login (Existing Patient)
                            </button>
                        </div>
                    </div>
                );
        }
    }
    
    return (
        <div>
             <button onClick={() => {
                 onBack();
                 setMode('options');
                 setRecoveryStep('mobile');
                 setRecoveryError('');
                 setLoginError('');
                 setSignupError('');
             }} className="absolute top-4 left-4 text-sm font-semibold text-srm-blue hover:underline">&larr; Back to Role Selection</button>
             {renderContent()}
        </div>
    );
};


export const LoginView: React.FC<LoginViewProps> = ({ onStaffLogin, onPatientLogin, onPatientSignUp, onFindPatientByPhone, onResetPassword }) => {
  const [screen, setScreen] = useState<'landing' | 'patient'>('landing');

  const handleScrollToRoles = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const rolesSection = document.getElementById('roles');
    if (rolesSection) {
      rolesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (screen === 'patient') {
    return (
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-100"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/NeuroNexus Hospital at Dusk.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
          <main className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-2xl shadow-2xl relative transition-all duration-500">
              <PatientPortal onLogin={onPatientLogin} onSignUp={onPatientSignUp} onBack={() => setScreen('landing')} onFindPatientByPhone={onFindPatientByPhone} onResetPassword={onResetPassword} />
          </main>
      </div>
    );
  }

  return (
    <div style={{
        backgroundImage: `url('/NeuroNexus Hospital at Dusk.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    }}>
        {/* Hero Section */}
        <div 
            id="hero"
            className="h-screen w-full flex flex-col items-center justify-center text-center p-4 relative bg-black/60"
        >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight">Welcome to <br/>NeuroNexus</h1>
            <p className="mt-6 max-w-3xl text-lg sm:text-xl text-gray-200">
                An integrated AI-powered platform designed to streamline hospital operations, enhance patient care, and provide a seamless healthcare experience.
            </p>
            <a href="#roles" onClick={handleScrollToRoles} className="mt-10 bg-srm-blue text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-lg transform hover:scale-105">
                Get Started
            </a>
            <a href="#roles" onClick={handleScrollToRoles} className="absolute bottom-8 text-white animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
            </a>
        </div>

        {/* Roles Section */}
        <div id="roles" className="w-full bg-srm-gray/95 backdrop-blur-sm py-20 px-4">
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800">Select Your Role to Begin</h2>
                    <p className="mt-3 text-lg text-gray-600">Choose your portal to access specialized tools and information.</p>
                </div>
                <div className="flex flex-wrap items-stretch justify-center gap-8">
                    <ActionCard
                        role="Patient"
                        icon={PatientLoginIcon}
                        text="Access your portal, book appointments, and view your medical records."
                        onSelect={() => setScreen('patient')}
                    />
                    <ActionCard
                        role="Receptionist"
                        icon={ReceptionistLoginIcon}
                        text="Login to manage appointments, register patients, and handle medical workflows."
                        onSelect={() => onStaffLogin('Receptionist')}
                    />
                     <ActionCard
                        role="Intern"
                        icon={InternIcon}
                        text="Assist in vitals assessment, initial diagnosis, and doctor coordination."
                        onSelect={() => onStaffLogin('Intern')}
                    />
                     <ActionCard
                        role="Doctor"
                        icon={DoctorLoginIcon}
                        text="Manage your patient queue, access clinical data, and use AI-Copilot."
                        onSelect={() => onStaffLogin('Doctor')}
                    />
                     <ActionCard
                        role="Nurse Head"
                        icon={NurseLoginIcon}
                        text="Oversee the triage process, manage patient flow, and coordinate with staff."
                        onSelect={() => onStaffLogin('Nurse')}
                    />
                     <ActionCard
                        role="Others"
                        icon={AdminLoginIcon}
                        text="Access departmental tools for Pharmacy, Labs, and Administration."
                        onSelect={() => onStaffLogin('Admin')}
                    />
                </div>
            </div>
        </div>
        
        <footer className="w-full bg-srm-darkgray text-center py-8">
            <p className="text-gray-300">A smart, interactive, and emotionally-aware hospital platform.</p>
            <p className="mt-1 text-gray-400 text-sm">© 2025 NeuroNexus. All rights reserved.</p>
        </footer>
    </div>
  );
};
