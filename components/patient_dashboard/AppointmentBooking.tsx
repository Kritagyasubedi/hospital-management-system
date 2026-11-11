import React, { useState, useMemo } from 'react';
import type { Patient, Appointment, Doctor } from '../../types';

interface AppointmentBookingProps {
  patient: Patient;
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (details: Omit<Appointment, 'id' | 'status'>) => void;
}

const departments = ['New Patient', 'Cardiology', 'Neurology', 'Orthopedics', 'ENT', 'General Medicine', 'Pediatrics', 'Gynecology'];
const allTimeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];
const commonSymptoms = ['Fever', 'Cough', 'Headache', 'Chest Pain', 'Fatigue', 'Shortness of Breath', 'Stomach Ache', 'Pelvic Pain', 'Abnormal Bleeding'];

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ patient, doctors, appointments, onBookAppointment }) => {
    const initialFormState = {
        pid: patient.id,
        fullName: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        contactNumber: patient.phoneNumber,
        department: '',
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        symptoms: [] as string[],
        additionalNotes: '',
        consultationMode: 'In-Person',
        isPregnant: '' // Added pregnancy status field
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const availableDoctors = useMemo(() => {
        if (!formData.department || formData.department === 'New Patient' || !formData.appointmentDate) {
            return [];
        }
        
        // Add T00:00:00 to handle date as local timezone and prevent off-by-one day errors.
        const date = new Date(formData.appointmentDate + 'T00:00:00');
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

        // Return all doctors in the selected department (removed strict availability check)
        return doctors.filter(d => d.department === formData.department);
    }, [formData.department, formData.appointmentDate, doctors]);


    const bookedSlots = useMemo(() => {
        // If it's a specific doctor, use their real schedule
        if (formData.department !== 'New Patient' && formData.doctor && formData.appointmentDate) {
            const selectedDoctor = doctors.find(doc => doc.name === formData.doctor);
            if (!selectedDoctor || !selectedDoctor.bookedSlots) {
                return new Set<string>();
            }
            
            const slots = selectedDoctor.bookedSlots
                .filter(slot => slot.date === formData.appointmentDate)
                .map(slot => slot.time);

            return new Set(slots);
        }
        
        // If it's a 'New Patient' appointment, simulate busy hours
        if (formData.department === 'New Patient' && formData.appointmentDate) {
            // Add T00:00:00 to handle date as local timezone and prevent off-by-one day errors.
            const date = new Date(formData.appointmentDate + 'T00:00:00');
            const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.

            // Let's create some dynamic "busy" patterns based on day of week
            const busySlots = new Set<string>();
            
            // Example patterns:
            switch(dayOfWeek) {
                case 0: // Sunday
                    busySlots.add('10:00 AM');
                    busySlots.add('11:30 AM');
                    break;
                case 1: // Monday (busy morning)
                    busySlots.add('09:00 AM');
                    busySlots.add('09:30 AM');
                    busySlots.add('10:30 AM');
                    busySlots.add('02:00 PM');
                    break;
                case 2: // Tuesday
                    busySlots.add('11:00 AM');
                    busySlots.add('11:30 AM');
                    busySlots.add('03:30 PM');
                    busySlots.add('04:00 PM');
                    break;
                case 3: // Wednesday (busy afternoon)
                    busySlots.add('09:00 AM');
                    busySlots.add('02:00 PM');
                    busySlots.add('02:30 PM');
                    busySlots.add('03:00 PM');
                    busySlots.add('04:30 PM');
                    break;
                case 4: // Thursday
                    busySlots.add('10:00 AM');
                    busySlots.add('12:30 PM');
                    busySlots.add('04:00 PM');
                    break;
                case 5: // Friday (busy before weekend)
                    busySlots.add('09:30 AM');
                    busySlots.add('10:00 AM');
                    busySlots.add('02:30 PM');
                    busySlots.add('03:00 PM');
                    busySlots.add('03:30 PM');
                    break;
                case 6: // Saturday
                    busySlots.add('09:30 AM');
                    busySlots.add('12:00 PM');
                    break;
                default: // Default case
                    busySlots.add('10:00 AM');
                    busySlots.add('11:30 AM');
            }
            return busySlots;
        }

        // Default to empty set if conditions aren't met
        return new Set<string>();
    }, [formData.appointmentDate, formData.doctor, formData.department, doctors]);

    const availableSlotCount = allTimeSlots.length - bookedSlots.size;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value, appointmentTime: '' };
            if (name === 'department' || name === 'appointmentDate') {
                newState.doctor = '';
            }
            return newState;
        });
    };
    
    const handleSymptomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const symptoms = checked ? [...prev.symptoms, value] : prev.symptoms.filter(s => s !== value);
            return { ...prev, symptoms };
        });
    }

    const validate = () => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = {};
        if (!formData.department) newErrors.department = "Department is required.";
        if (!formData.appointmentDate) newErrors.appointmentDate = "Appointment date is required.";
        if (!formData.appointmentTime) newErrors.appointmentTime = "Appointment time is required.";
        if (formData.symptoms.length === 0 && !formData.additionalNotes.trim()) {
            newErrors.symptoms = "Please select at least one symptom or provide additional notes.";
        }
        // Validate pregnancy status for female patients
        if (patient.gender === 'Female' && !formData.isPregnant) {
            newErrors.isPregnant = "Please indicate pregnancy status.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Create symptoms summary including pregnancy status for female patients
            const symptomsParts = [...formData.symptoms, formData.additionalNotes.trim()];
            
            // Add pregnancy status to symptoms summary for female patients
            if (patient.gender === 'Female' && formData.isPregnant) {
                symptomsParts.push(`Pregnancy Status: ${formData.isPregnant}`);
            }
            
            const symptomsSummary = symptomsParts.filter(Boolean).join(', ');

            const appointmentDetails = {
                patientId: formData.pid,
                patientName: formData.fullName,
                department: formData.department,
                doctor: formData.department === 'New Patient' ? 'To be assigned' : (formData.doctor || 'Any available doctor'),
                date: formData.appointmentDate,
                time: formData.appointmentTime,
                symptoms: symptomsSummary,
            };
            onBookAppointment(appointmentDetails);
            setSubmissionStatus('success');
        }
    };

    if (submissionStatus === 'success') {
        return (
            <div className="text-center p-8 bg-yellow-50 rounded-xl shadow-sm">
                <h4 className="text-xl font-bold text-yellow-700">Appointment Submitted — Pending Approval</h4>
                <p className="text-gray-600 mt-2">Your appointment request for the <span className="font-semibold">{formData.department}</span> department on <span className="font-semibold">{formData.appointmentDate} at {formData.appointmentTime}</span> has been sent to the receptionist for confirmation.</p>
                <p className="text-sm text-gray-500 mt-1">You will be notified once the receptionist confirms or updates your appointment.</p>
                <button onClick={() => { setSubmissionStatus('idle'); setFormData(initialFormState); }} className="mt-6 bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">
                    Book Another Appointment
                </button>
            </div>
        );
    }

    const getDoctorDropdownText = () => {
        if (formData.department === 'New Patient') return 'Assigned by Reception';
        if (!formData.department) return 'Select a department first';
        if (!formData.appointmentDate) return 'Select a date first';
        if (availableDoctors.length === 0) return 'No doctors available on this day';
        return 'Any available doctor';
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-srm-darkgray mb-6 border-b pb-4">Book a New Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                
                {/* Patient Information */}
                <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <legend className="text-lg font-semibold text-srm-blue mb-2 col-span-full">1. Patient Details</legend>
                    <div>
                        <label className="font-medium text-gray-700">Patient ID (PID)</label>
                        <input type="text" name="pid" value={formData.pid} readOnly className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} readOnly className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500" />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Age</label>
                        <input type="text" name="age" value={formData.age} readOnly className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500" />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Gender</label>
                        <input type="text" name="gender" value={formData.gender} readOnly className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500" />
                    </div>
                </fieldset>
                
                 {/* Appointment Details */}
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <legend className="text-lg font-semibold text-srm-blue mb-2 col-span-full">2. Appointment Details</legend>
                    <div>
                        <label className="font-medium text-gray-700">Department / Specialty</label>
                        <select name="department" value={formData.department} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-900">
                            <option value="">Select a Department</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                         {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Preferred Doctor (Optional)</label>
                        <select 
                            name="doctor" 
                            value={formData.doctor} 
                            onChange={handleChange} 
                            disabled={!formData.department || formData.department === 'New Patient' || !formData.appointmentDate || availableDoctors.length === 0} 
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 text-gray-900"
                        >
                            <option value="">{getDoctorDropdownText()}</option>
                            {availableDoctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Appointment Date</label>
                        <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                        {errors.appointmentDate && <p className="text-xs text-red-600 mt-1">{errors.appointmentDate}</p>}
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium text-gray-700">Appointment Time</label>
                            {formData.appointmentDate && (formData.doctor || formData.department === 'New Patient') && (
                                <span className="text-sm font-semibold text-srm-green">{availableSlotCount} slots available</span>
                            )}
                        </div>
                        {(!formData.appointmentDate || (!formData.doctor && formData.department !== 'New Patient')) ? (
                            <div className="text-xs text-gray-500 mt-2 p-3 bg-gray-100 rounded-md h-full flex items-center">
                                Please select a department, doctor, and date to view time slots.
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                {allTimeSlots.map(slot => {
                                    const isBooked = bookedSlots.has(slot);
                                    const isSelected = formData.appointmentTime === slot;

                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => {
                                                if (!isBooked) {
                                                    setFormData(prev => ({ ...prev, appointmentTime: slot }));
                                                    // Clear error on valid selection
                                                    if (errors.appointmentTime) {
                                                        setErrors(prev => ({...prev, appointmentTime: undefined}));
                                                    }
                                                }
                                            }}
                                            disabled={isBooked}
                                            className={`p-2 rounded-md text-center font-semibold transition-all duration-200 border-2 text-xs sm:text-sm
                                                ${isBooked 
                                                    ? 'bg-red-100 text-red-600 border-red-200 cursor-not-allowed line-through' 
                                                    : isSelected 
                                                        ? 'bg-srm-blue text-white border-srm-blue ring-2 ring-offset-1 ring-srm-blue' 
                                                        : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300'
                                                }`
                                            }
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {errors.appointmentTime && <p className="text-xs text-red-600 mt-1">{errors.appointmentTime}</p>}
                    </div>
                </fieldset>
                
                {/* Pregnancy Status for Female Patients */}
                {patient.gender === 'Female' && (
                    <fieldset>
                        <legend className="text-lg font-semibold text-srm-blue mb-2">Pregnancy Status</legend>
                        <div className="mt-2">
                            <label className="font-medium text-gray-700">Are you currently pregnant?</label>
                            <div className="flex items-center space-x-4 mt-1">
                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="isPregnant" 
                                        value="Yes" 
                                        checked={formData.isPregnant === 'Yes'} 
                                        onChange={handleChange} 
                                        className="h-4 w-4 text-srm-blue focus:ring-srm-blue" 
                                    />
                                    <span className="text-gray-900">Yes</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="isPregnant" 
                                        value="No" 
                                        checked={formData.isPregnant === 'No'} 
                                        onChange={handleChange} 
                                        className="h-4 w-4 text-srm-blue focus:ring-srm-blue" 
                                    />
                                    <span className="text-gray-900">No</span>
                                </label>
                            </div>
                            {errors.isPregnant && <p className="text-xs text-red-600 mt-1">{errors.isPregnant}</p>}
                        </div>
                    </fieldset>
                )}
                
                 {/* Symptoms */}
                 <fieldset>
                     <legend className="text-lg font-semibold text-srm-blue mb-2">3. Health Concerns</legend>
                     <div className="mt-2 space-y-2">
                        <label className="font-medium text-gray-700">Select Symptoms</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {commonSymptoms.map(symptom => (
                                <label key={symptom} className="flex items-center space-x-2 p-2 border rounded-md has-[:checked]:bg-srm-lightblue has-[:checked]:border-srm-blue">
                                    <input type="checkbox" value={symptom} checked={formData.symptoms.includes(symptom)} onChange={handleSymptomChange} className="h-4 w-4 text-srm-blue focus:ring-srm-blue border-gray-300 rounded" />
                                    <span className="text-gray-900">{symptom}</span>
                                </label>
                            ))}
                        </div>
                     </div>
                      <div className="mt-4">
                        <label className="font-medium text-gray-700">Additional Notes / Concerns</label>
                        <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows={3} className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="Please describe your health concerns in more detail..."></textarea>
                    </div>
                    {errors.symptoms && <p className="text-xs text-red-600 mt-1">{errors.symptoms}</p>}
                 </fieldset>
                 
                  {/* Consultation Mode */}
                <fieldset>
                    <legend className="text-lg font-semibold text-srm-blue mb-2">4. Mode of Consultation</legend>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                             <input type="radio" name="consultationMode" value="In-Person" checked={formData.consultationMode === 'In-Person'} onChange={handleChange} className="h-4 w-4 text-srm-blue focus:ring-srm-blue" />
                             <span className="text-gray-900">In-Person</span>
                        </label>
                        <label className="flex items-center space-x-2">
                             <input type="radio" name="consultationMode" value="Online" checked={formData.consultationMode === 'Online'} onChange={handleChange} className="h-4 w-4 text-srm-blue focus:ring-srm-blue" />
                             <span className="text-gray-900">Online</span>
                        </label>
                    </div>
                </fieldset>

                <div className="pt-4 border-t">
                     <button type="submit" className="w-full bg-srm-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-base">
                        Submit Appointment Request
                    </button>
                </div>
            </form>
        </div>
    );
};