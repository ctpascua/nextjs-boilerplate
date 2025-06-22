import React, { useState } from 'react';

// --- TYPE DEFINITIONS ---
type Account = {
  id: string;
  name: string;
  mask: string;
  balance: number;
  accountType: 'depository' | 'credit'; // To differentiate account types
};

type Bank = {
  name:string;
  logo: React.FC<{ className?: string }>;
};

type Screen = 'intro' | 'choose_bank' | 'credentials' | 'select_account' | 'success';

// --- SVG ICONS ---
const PlaidLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="14" fill="#0A2540"/>
    <path d="M14 5C9.02929 5 5 9.02929 5 14C5 18.9707 9.02929 23 14 23C18.9707 23 23 18.9707 23 14V5H14Z" fill="white"/>
  </svg>
);

const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> );
const CheckCircleIcon = ({ className }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg> );
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> );
const SpinnerIcon = () => ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );

const BankLogo1 = ({className}: {className?:string}) => <div className={`flex items-center justify-center bg-blue-600 text-white font-bold text-xl rounded-full ${className}`}>G</div>;
const BankLogo2 = ({className}: {className?:string}) => <div className={`flex items-center justify-center bg-red-600 text-white font-bold text-xl rounded-full ${className}`}>P</div>;
const BankLogo3 = ({className}: {className?:string}) => <div className={`flex items-center justify-center bg-green-600 text-white font-bold text-xl rounded-full ${className}`}>T</div>;
const BankLogo4 = ({className}: {className?:string}) => <div className={`flex items-center justify-center bg-purple-600 text-white font-bold text-xl rounded-full ${className}`}>C</div>;
const BankLogo5 = ({className}: {className?:string}) => <div className={`flex items-center justify-center bg-yellow-500 text-white font-bold text-xl rounded-full ${className}`}>B</div>;
const BankLogo6 = ({className}: {className?:string}) => <div className={`flex items-center justify-center bg-indigo-600 text-white font-bold text-xl rounded-full ${className}`}>W</div>;

// --- MOCK DATA ---
const mockAccounts: Account[] = [
  { id: 'acc_1', name: 'Personal Savings', mask: '5821', balance: 10324.00, accountType: 'depository' },
  { id: 'acc_2', name: 'Gingham Visa Card', mask: '4295', balance: 854.92, accountType: 'credit' },
  { id: 'acc_3', name: 'Student Checking', mask: '1102', balance: 1250.77, accountType: 'depository' },
  { id: 'acc_4', name: 'Cash Back Rewards', mask: '8812', balance: 2401.50, accountType: 'credit' },
];

const popularBanks: Bank[] = [
    { name: 'Gingham Bank', logo: BankLogo1 },
    { name: 'Pattern Bank', logo: BankLogo2 },
    { name: 'Thread Bank', logo: BankLogo3 },
    { name: 'Chase', logo: BankLogo4 },
    { name: 'Bank of America', logo: BankLogo5 },
    { name: 'Wells Fargo', logo: BankLogo6 },
];

// --- UI COMPONENTS FOR EACH SCREEN ---

const IntroScreen = ({ onContinue }: { onContinue: () => void }) => (
  <div className="p-8 text-center">
    <div className="flex justify-center items-center mb-6">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-2m0-4h.01M7 12h.01M17 12h.01M7 16h.01M17 16h.01" /></svg></div>
      <div className="w-8 h-px bg-gray-300 mx-4"></div>
      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center"><PlaidLogo /></div>
    </div>
    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Capital Two uses Plaid to connect your accounts</h1>
    <div className="text-left space-y-6 mt-8 text-gray-600 max-w-md mx-auto">
        <div className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" /><div><h2 className="font-semibold text-gray-800">Connect effortlessly</h2><p>Plaid lets you securely connect your financial accounts in seconds.</p></div></div>
        <div className="flex items-start"><CheckCircleIcon className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" /><div><h2 className="font-semibold text-gray-800">Your data belongs to you</h2><p>Plaid doesn't sell personal info, and will only use it with your permission.</p></div></div>
    </div>
    <p className="text-xs text-gray-500 text-center mt-8 mb-4">By selecting "Continue" you agree to the Plaid End User Privacy Policy.</p>
    <button onClick={onContinue} className="w-full max-w-xs mx-auto bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Continue</button>
  </div>
);

const ChooseBankScreen = ({ onSelectBank }: { onSelectBank: (bank: Bank) => void }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredBanks = popularBanks.filter(bank => bank.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-8 flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Choose your bank</h1>
            <p className="text-gray-600 text-center mb-6">Select your bank from the list to continue</p>
            <div className="relative mb-6">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon/></div>
                <input type="text" placeholder="Search for your bank" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBanks.map(bank => (
                    <button key={bank.name} onClick={() => onSelectBank(bank)} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <bank.logo className="w-12 h-12 mb-2" />
                        <span className="text-sm font-semibold text-gray-700">{bank.name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
};

const CredentialsScreen = ({ onContinue, bank }: { onContinue: () => void; bank: Bank | null }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuthentication = () => {
        setError(null);
        if (!password) {
            setError("Password cannot be empty.");
            return;
        }
        setIsLoading(true);
        // Simulate a network request
        setTimeout(() => {
            // Placeholder logic: For demo, any non-empty password succeeds.
            if (password) {
                setIsLoading(false);
                onContinue();
            } else {
                setIsLoading(false);
                setError("Invalid credentials. Please try again.");
            }
        }, 1500);
    };

    const BankLogo = bank?.logo || BankLogo1;

    return (
    <div className="p-8">
      <div className="flex justify-center items-center mb-8"><div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white ring-2 ring-gray-300"><BankLogo className="w-full h-full" /></div></div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Enter your credentials</h1>
      <p className="text-gray-600 text-center mb-8 text-sm">By providing your {bank?.name || 'bank'} credentials to Plaid, you're enabling Plaid to retrieve your financial data.</p>
      <div className="space-y-4 max-w-sm mx-auto">
          <div className="relative"><input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/><LockIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /></div>
          <div className="relative"><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/><LockIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /></div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
      <div className="w-full max-w-sm mx-auto mt-8">
          <button onClick={handleAuthentication} disabled={isLoading} className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex justify-center items-center disabled:bg-gray-500">
              {isLoading ? <SpinnerIcon /> : 'Submit'}
          </button>
          <button className="w-full mt-4 text-gray-600 font-semibold py-2">Reset Password</button>
      </div>
    </div>
    );
};

const SelectAccountScreen = ({ onContinue, bank }: { onContinue: () => void, bank: Bank | null }) => {
    const [selectedId, setSelectedId] = useState<string>(mockAccounts[0].id);
    const BankLogo = bank?.logo || BankLogo1;

    return (
        <div className="p-8">
          <div className="flex justify-center items-center mb-8"><div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white ring-2 ring-gray-300"><BankLogo className="w-full h-full" /></div></div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Select account(s)</h1>
          <p className="text-gray-600 text-center mb-8 text-sm">Plaid will only share data from the accounts you select with Capital Two.</p>
          <div className="space-y-3 max-w-md mx-auto">
              {mockAccounts.map(account => (
                  <div key={account.id} onClick={() => setSelectedId(account.id)} className={`w-full border rounded-lg p-4 flex items-center cursor-pointer transition-all ${ selectedId === account.id ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-300' }`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${ selectedId === account.id ? 'border-blue-600 bg-blue-600' : 'border-gray-400' }`}>{selectedId === account.id && <div className="w-2 h-2 bg-white rounded-full"></div>}</div>
                      <div className="flex-grow"><p className="font-semibold text-gray-800">{account.name}</p><p className="text-sm text-gray-500">•••••• {account.mask}</p></div>
                      <div className="text-right"><p className="font-semibold text-gray-800">${account.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</p><p className="text-xs text-gray-500">{account.accountType === 'credit' ? 'Current Balance' : 'Available Balance'}</p></div>
                  </div>
              ))}
          </div>
          <div className="w-full px-6 pb-6 mt-8 text-center max-w-md mx-auto">
            <button onClick={onContinue} className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Continue</button>
            <button className="w-full mt-4 text-gray-600 font-semibold py-2">Learn more</button>
          </div>
        </div>
    )
};

const SuccessScreen = ({ onContinue }: { onContinue: () => void }) => (
    <div className="p-8 flex-grow flex flex-col justify-center items-center text-center">
        <div className="relative w-24 h-24 mb-6"><div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-lg transform rotate-12"></div><div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-100 rounded-lg transform -rotate-12"></div><CheckCircleIcon className="w-24 h-24 text-green-500 absolute inset-0" /></div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Success!</h1>
        <p className="text-gray-600">Your account has been successfully linked to Capital Two.</p>
        <div className="w-full max-w-xs mx-auto mt-8">
            <button onClick={onContinue} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors">
                Find the best credit card for me
            </button>
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const resetFlow = () => {
      setSelectedBank(null);
      setScreen('intro');
  };
  
  const handleSelectBank = (bank: Bank) => {
      setSelectedBank(bank);
      setScreen('credentials');
  }

  const renderScreen = () => {
    switch (screen) {
      case 'intro':
        return <IntroScreen onContinue={() => setScreen('choose_bank')} />;
      case 'choose_bank':
        return <ChooseBankScreen onSelectBank={handleSelectBank} />;
      case 'credentials':
        return <CredentialsScreen onContinue={() => setScreen('select_account')} bank={selectedBank} />;
      case 'select_account':
        return <SelectAccountScreen onContinue={() => setScreen('success')} bank={selectedBank} />;
      case 'success':
        return <SuccessScreen onContinue={resetFlow} />; 
      default:
        return <IntroScreen onContinue={() => setScreen('choose_bank')} />;
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col relative">
        <div className="flex justify-center items-center p-4 border-b border-gray-200 relative">
          <div className="flex items-center space-x-2">
            <PlaidLogo />
            <span className="font-bold text-gray-800">PLAID</span>
          </div>
          <button onClick={resetFlow} className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-gray-800 transition-colors">&times;</button>
        </div>
        <div className="overflow-y-auto">
            {renderScreen()}
        </div>
      </div>
    </div>
  );
}
