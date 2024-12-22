import { useNavigate } from "react-router-dom";
import bagalogo from '../../../images/bagalogo.png';
import user from '../../../images/user.png';
import sets from '../../../images/sets.png';
import vector from '../../../images/vector.png';
import notif from '../../../images/notif.png';
import patient from '../../../images/patient.png';
import message from '../../../images/message.png';
import contact from '../../../images/contact.png';
import tech from '../../../images/tech.png';
import settings from '../../../images/settings.png';


const Sidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate('/doctors-dashboard');
    };
    const handleButton2 = (path) =>{
      navigate('/doctorsView-patientActivity')
    };
 

    return (
      
      <div className="w-64 bg-[#283342] flex flex-col">
        <div className="text-xl font-bold bg-[#1D242E] text-white flex items-center p-4">
          <img src={bagalogo} alt="Baga" className="h-5 object-contain mr-2 " />
          <div>BAGA.NET</div>
        </div>

        <div className="font-bold flex items-center p-2">
          <div className='p-1'>
            <img src={user} alt="User" className="h-10 object-contain " />
          </div>
          <div className='flex flex-col ml-2'>
            <div className='text-white font-medium text-lg -mt-2'>Benoks</div>
            <div className='text-yellow-400 font-normal text-xs'>Doctor</div>
          </div>
          <div className='p-1 ml-auto'>
            <img src={sets} alt="Settings" className="h-5 object-contain" />
          </div>
        </div>

        <nav className='text-white text-base mt-4'>
          <ul>
            <div className='flex flex-row hover:bg-[#009099] rounded px-4'>
              <img src={vector} alt="Dashboard" className="object-contain"></img>
              <li className="p-2 cursor-pointer " onClick={() => handleNavigation('/doctors-dashboard')}>Dashboard</li>
            </div>

            <div className='flex flex-row hover:bg-[#009099] rounded px-4'>
              <img src={patient} alt="Patient Records" className="object-contain"></img>
              <li className="p-2 cursor-pointer" onClick={() => handleButton2('/doctorsView-patientActivity')}>Patient Records</li>
            </div>

            <div className='flex flex-row hover:bg-[#009099] rounded px-4'>
              <img src={contact} alt="Contact Management" className="object-contain"></img>
              <li className="p-2 cursor-pointer" onClick={() => handleNavigation('/contact-management')}>Contact Management</li>
            </div>

            <div className='flex flex-row hover:bg-[#009099] rounded px-4'>
              <img src={notif} alt="Notifications" className="object-contain"></img>
              <li className="p-2 cursor-pointer" onClick={() => handleNavigation('/notifications')}>Notifications</li>
            </div>

            <div className='flex flex-row hover:bg-[#009099] rounded px-4'>
              <img src={message} alt="Chat with Doctors" className="object-contain"></img>
              <li className="p-2 cursor-pointer" onClick={() => handleNavigation('/chat-with-doctors')}>Chat with Doctors</li>
            </div>
          </ul>
        </nav>

        <nav className='text-white text-base mt-60'>
          <hr className='border-zinc-500 -mt-14 mb-8'></hr>
          <ul>
            <div className='flex flex-row hover:bg-[#009099] rounded px-4'>
              <img src={settings} alt="Settings" className="object-contain"></img>
              <li className="p-2 cursor-pointer" onClick={() => handleNavigation('/settings')}>Settings</li>
            </div>

            <div className='flex flex-row hover:bg-[#009099] rounded px-4'>
              <img src={tech} alt="Tech Help" className="object-contain"></img>
              <li className="p-2 cursor-pointer" onClick={() => handleNavigation('/technical-help')}>Get Technical Help</li>
            </div>
          </ul>
        </nav>

        <div className='bg-[#1D242E] p-6 mt-12 text-white'>
          <div className='text-xs'>Powered by BAGA.NET © 2024</div>
        </div>
      </div>
    );
};

export default Sidebar;
