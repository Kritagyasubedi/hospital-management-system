
import React from 'react';
import type { View } from '../types';

interface PatientJourneyViewProps {
  setActiveView: (view: View) => void;
}

const FlowNode: React.FC<{ title: string; onClick?: () => void; type?: 'solid' | 'dashed' | 'decision'; children?: React.ReactNode }> = ({ title, onClick, type = 'solid', children }) => {
  const baseClasses = 'font-semibold text-sm text-center p-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer';
  let typeClasses = 'bg-white border-2 border-apex-blue text-apex-blue';
  if (type === 'dashed') {
    typeClasses = 'bg-white border-2 border-dashed border-apex-darkgray text-apex-darkgray';
  } else if (type === 'decision') {
    typeClasses = 'bg-apex-lightblue border-2 border-apex-blue text-apex-blue -rotate-45 w-48 h-48 flex items-center justify-center';
  }

  const content = type === 'decision' 
    ? <span className="rotate-45">{title}</span> 
    : (
        <>
            {title}
            {children && <div className="text-xs font-normal mt-1">{children}</div>}
        </>
    );

  if (type === 'decision') {
      return (
          <div className="flex items-center justify-center w-48 h-48">
             <div onClick={onClick} className={`${baseClasses} ${typeClasses}`}>{content}</div>
          </div>
      )
  }

  return (
    <div onClick={onClick} className={`${baseClasses} ${typeClasses}`}>
      {content}
    </div>
  );
};

const Arrow: React.FC<{ type?: 'vertical' | 'horizontal'; label?: string }> = ({ type = 'vertical', label }) => {
    const baseClasses = 'bg-gray-400 relative';
    const arrowClasses = type === 'vertical' ? 'w-0.5 h-12 mx-auto' : 'h-0.5 w-full my-auto';
    const headBase = 'absolute border-gray-400';
    const headClasses = type === 'vertical' 
        ? 'border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent bottom-[-2px] left-1/2 -translate-x-1/2' 
        : 'border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent right-[-2px] top-1/2 -translate-y-1/2';

  return (
    <div className={`relative flex items-center justify-center ${type === 'vertical' ? 'flex-col' : 'flex-row'}`}>
        <div className={`${baseClasses} ${arrowClasses}`}>
             <div className={`${headBase} ${headClasses}`}></div>
        </div>
        {label && <span className="absolute text-xs font-bold text-gray-600 bg-apex-gray px-1">{label}</span>}
    </div>
  );
};

export const PatientJourneyView: React.FC<PatientJourneyViewProps> = ({ setActiveView }) => {
  return (
    <div className="p-4 space-y-4 overflow-x-auto">
        <h2 className="text-2xl font-bold text-center text-apex-blue mb-8">Hospital Patient Journey: Entry to Exit</h2>
        
        {/* Entry Point */}
        <div className="flex justify-center">
            <FlowNode title="Patient Enters the Hospital" />
        </div>
        <Arrow />

        {/* First Decision: Emergency */}
        <div className="flex justify-center items-center space-x-20">
            <div className="flex-1 text-right"><Arrow type="horizontal" label="YES"/></div>
            <div className="flex-shrink-0"><FlowNode title="Whether Emergency?" type="decision" /></div>
            <div className="flex-1 text-left"><Arrow type="horizontal"/></div>
        </div>
        
        <div className="flex justify-around">
            {/* ER Path */}
            <div className="w-1/3 flex flex-col items-center">
               <Arrow />
               <FlowNode title="ER Protocol" onClick={() => setActiveView('module_11')} />
            </div>
            {/* Main Path */}
            <div className="w-1/3 flex flex-col items-center">
                <Arrow label="NO"/>
                <FlowNode title="Whether Registration?" type="decision" />
            </div>
        </div>
        
        {/* Registration Flow */}
         <div className="flex justify-around items-start">
            <div className="w-1/3"></div>
            <div className="w-1/3 flex flex-col items-center">
                <div className="flex w-full">
                    <div className="w-1/2 flex flex-col items-center"><Arrow label="NO"/></div>
                    <div className="w-1/2 flex flex-col items-center"><Arrow label="YES"/></div>
                </div>
                <div className="flex w-full">
                    <div className="w-1/2 flex flex-col items-center text-center px-2">
                        <FlowNode title="Patients come to the respective Registration Counter" onClick={() => setActiveView('module_1')} />
                        <Arrow />
                        <div className="flex items-center">
                             <FlowNode title="Insurance Protocol" type="dashed" onClick={() => setActiveView('module_50')}/>
                             <div className="w-8 mx-2"><Arrow type="horizontal" /></div>
                             <FlowNode title="Billing Protocol" onClick={() => setActiveView('module_10')}/>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col items-center px-2">
                        <FlowNode title="Online Registration" type="dashed" onClick={() => setActiveView('module_1')} />
                        <Arrow />
                        <FlowNode title="Registration Protocol" onClick={() => setActiveView('module_1')} />
                        <Arrow />
                        <FlowNode title="OPD / MHC Protocol" onClick={() => setActiveView('module_25')} />
                    </div>
                </div>
            </div>
        </div>

        {/* Consultation Hub */}
        <div className="flex justify-center my-4"><Arrow /></div>
        <div className="flex justify-center items-center">
            <FlowNode title="Consultation Protocol" onClick={() => setActiveView('module_5')} />
        </div>
        <div className="flex justify-center my-4"><Arrow /></div>
        
        <FlowNode title="To Buy Medicines/Investigations/Procedures/Consultation?" type="decision" />

        {/* Investigation & Admission Flow */}
        <div className="flex items-start">
            {/* NO path -> Admission */}
            <div className="w-1/2 flex flex-col items-center">
                <Arrow label="NO"/>
                <FlowNode title="Whether to Admit?" type="decision" />
                 <div className="flex w-full items-start">
                    <div className="w-1/2 flex flex-col items-center">
                        <Arrow label="NO" />
                        <FlowNode title="Patient Exit" />
                        <Arrow />
                        <FlowNode title="Follow Up" />
                        <Arrow />
                        <FlowNode title="Home Healthcare Services" />
                    </div>
                     <div className="w-1/2 flex flex-col items-center">
                        <Arrow label="YES" />
                        <FlowNode title="Admission Protocol" onClick={() => setActiveView('module_24')} />
                        <Arrow />
                        <FlowNode title="IPD">
                           OT / LBR / ICU
                        </FlowNode>
                         <Arrow />
                        <FlowNode title="Discharge Process" onClick={() => setActiveView('module_32')} />
                        <Arrow />
                         <FlowNode title="Discharge Summary" onClick={() => setActiveView('module_33')} />
                    </div>
                </div>
            </div>

             {/* YES path -> Services */}
            <div className="w-1/2 flex flex-col items-center space-y-2">
                <Arrow label="YES" />
                <FlowNode title="Pharmacy Protocol" onClick={() => setActiveView('module_6')} />
                <FlowNode title="Laboratory Protocol" onClick={() => setActiveView('module_8')} />
                <FlowNode title="Radiology Protocol" onClick={() => setActiveView('module_9')} />
                <FlowNode title="Procedures / Other Investigation" />
            </div>
        </div>

        {/* Supporting Protocols */}
        <div className="border-t-2 border-dashed border-gray-400 pt-8 mt-12">
            <h3 className="text-center text-lg font-bold text-apex-darkgray mb-4">Underlying Administrative & Support Protocols</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <FlowNode title="Accounts & Finance" type="dashed" onClick={() => setActiveView('module_46')} />
                <FlowNode title="Purchase & Store" type="dashed" onClick={() => setActiveView('module_52')} />
                <FlowNode title="BME Protocol" type="dashed" onClick={() => setActiveView('module_27b')} />
                <FlowNode title="HRD Protocol" type="dashed" onClick={() => setActiveView('module_43')} />
                <FlowNode title="Quality Protocol" type="dashed" onClick={() => setActiveView('module_48')} />
                <FlowNode title="Statutory & Regulatory" type="dashed" onClick={() => setActiveView('module_34')} />
                <FlowNode title="MOUs & Tie-Ups" type="dashed" onClick={() => setActiveView('module_51')} />
                <FlowNode title="Medical Transcription" type="dashed" onClick={() => setActiveView('module_32')} />
                <FlowNode title="Feedback Protocol" type="dashed" onClick={() => setActiveView('module_30')} />
                <FlowNode title="Ambulance Protocol" type="dashed" onClick={() => setActiveView('module_15')} />
            </div>
        </div>
    </div>
  );
};
