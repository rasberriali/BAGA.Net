import Sidebar from '../../mainpage/radtechPage/sidebar';
import Navbar from '../../mainpage/radtechPage/navbar';
import search from '../../../images/search.png';
import sort from '../../../images/sort.png';
import filter from '../../../images/filter.png';
import DragNdrop from '../radtechPage/dragNdrop';
import add2 from '../../../images/add2.png';
import view from '../../../images/view.png';
import del2 from '../../../images/del2.png';
import AddPatient from './addPatient';
import Update from './update';
import Delete from './delete'
import View from './view'

const PatientActivity = () => {

  const handleFilesSelected = (files) => {
    console.log("Files selected:", files);
  };

  return (
    <div className="flex h-screen bg-gray-100 ">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="bg-white p-6 rounded-lg shadow-md mt-4 mx-6">
          <h3 className="text-4xl font-bold mb-6 text-gray-800">Patient</h3>

          <div className='flex flex-row justify-between mb-4'>
            <div className='flex items-center -ml-2 '>
              <input
                type="text"
                placeholder='Search'
                aria-label="Search Bar"
                className="border rounded-md px-4 py-2 w-96 ml-2 border-gray-300 focus:outline-none focus:ring-1 bg-[#E3EBF3] focus:ring-blue-500"
              />
              <img src={search} alt="Search icon" className="w-5 h-5 -ml-8 cursor-pointer mt-2" />

              <div className='flex flex-row ml-6'>
                <AddPatient/>
              </div>
            </div>

            <div className='flex flex-row gap-6'>
              <div className='flex items-center gap-2'>
                <img src={sort} alt="sort" className="w-6 h-4" />
                <div>Sort</div>
              </div>
              <div className='flex items-center gap-2'>
                <img src={filter} alt="filter" className="w-4 h-4" />
              
              <div className="relative">
                <select className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-blue-600 appearance-none">
                  <option value="" disabled selected>- Select Group -</option>
                  <option value="gender1">Female</option>
                  <option value="gender2">Male</option>
                  <option value="age1">Age[0-18]</option>
                  <option value="age2">Age[19-37]</option>
                  <option value="age3">Age[38-57]</option>
                  <option value="age4">Age[57-above]</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              </div>
            </div>
          </div>

         

          <div className="overflow-x-auto mt-6 max-h-[60vh]">
              <table className="table-auto border-collapse w-full">
              <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr className="bg-gray-200 text-left text-gray-700">
                    <th className="px-6 py-2 text-start">Patient Name</th>
                    <th className="px-6 py-2 text-start">Location</th>
                    <th className="px-6 py-2 text-start">Gender</th>
                    <th className="px-6 py-2 text-start">Age</th>
                    <th className="px-6 py-2 text-start">X-ray</th>
                    <th className="px-6 py-2 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">John Doe</td>
                  <td className="px-6 py-2 text-start">Batangas City</td>
                  <td className="px-6 py-2 text-start">Male</td>
                  <td className="px-6 py-2 text-start">21</td>
                  <td className="px-6 py-2 text-start">
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       {/* <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" /> */}
                       <Update/>
                      <Delete/>
                      <View/>
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">Jane Doe</td>
                  <td className="px-6 py-2 text-start">Calamba City</td>
                  <td className="px-6 py-2 text-start">Female</td>
                  <td className="px-6 py-2 text-start">25</td>
                  <td className="px-6 py-2 text-start">
                    <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
               

                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">John Doe</td>
                  <td className="px-6 py-2 text-start">Batangas City</td>
                  <td className="px-6 py-2 text-start">Male</td>
                  <td className="px-6 py-2 text-start">21</td>
                  <td className="px-6 py-2 text-start">
                   
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">Jane Doe</td>
                  <td className="px-6 py-2 text-start">Calamba City</td>
                  <td className="px-6 py-2 text-start">Female</td>
                  <td className="px-6 py-2 text-start">25</td>
                  <td className="px-6 py-2 text-start">
               
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">John Doe</td>
                  <td className="px-6 py-2 text-start">Batangas City</td>
                  <td className="px-6 py-2 text-start">Male</td>
                  <td className="px-6 py-2 text-start">21</td>
                  <td className="px-6 py-2 text-start">
                    {/* <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Drag & Drop
                    </button> */}

                      <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">Jane Doe</td>
                  <td className="px-6 py-2 text-start">Calamba City</td>
                  <td className="px-6 py-2 text-start">Female</td>
                  <td className="px-6 py-2 text-start">25</td>
                  <td className="px-6 py-2 text-start">
                  

                      <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>


                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">John Doe</td>
                  <td className="px-6 py-2 text-start">Batangas City</td>
                  <td className="px-6 py-2 text-start">Male</td>
                  <td className="px-6 py-2 text-start">21</td>
                  <td className="px-6 py-2 text-start">
                 
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">Jane Doe</td>
                  <td className="px-6 py-2 text-start">Calamba City</td>
                  <td className="px-6 py-2 text-start">Female</td>
                  <td className="px-6 py-2 text-start">25</td>
                  <td className="px-6 py-2 text-start">
                   
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>

                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">John Doe</td>
                  <td className="px-6 py-2 text-start">Batangas City</td>
                  <td className="px-6 py-2 text-start">Male</td>
                  <td className="px-6 py-2 text-start">21</td>
                  <td className="px-6 py-2 text-start">
                    
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />

                    
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">Jane Doe</td>
                  <td className="px-6 py-2 text-start">Calamba City</td>
                  <td className="px-6 py-2 text-start">Female</td>
                  <td className="px-6 py-2 text-start">25</td>
                  <td className="px-6 py-2 text-start">
                  
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>

                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">John Doe</td>
                  <td className="px-6 py-2 text-start">Batangas City</td>
                  <td className="px-6 py-2 text-start">Male</td>
                  <td className="px-6 py-2 text-start">21</td>
                  <td className="px-6 py-2 text-start">
                    
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">Jane Doe</td>
                  <td className="px-6 py-2 text-start">Calamba City</td>
                  <td className="px-6 py-2 text-start">Female</td>
                  <td className="px-6 py-2 text-start">25</td>
                  <td className="px-6 py-2 text-start">
                   
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">John Doe</td>
                  <td className="px-6 py-2 text-start">Batangas City</td>
                  <td className="px-6 py-2 text-start">Male</td>
                  <td className="px-6 py-2 text-start">21</td>
                  <td className="px-6 py-2 text-start">
                   
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-6 py-2 text-start">Jane Doe</td>
                  <td className="px-6 py-2 text-start">Calamba City</td>
                  <td className="px-6 py-2 text-start">Female</td>
                  <td className="px-6 py-2 text-start">25</td>
                  <td className="px-6 py-2 text-start">
                  
                     <DragNdrop onFilesSelected={handleFilesSelected} width="20%" height="100px" />
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center gap-2 ">
                       <img src={add2} alt="add2" className="w-12 h-12  cursor-pointer mt-2" />

                      <img src={del2} alt="del2" className=" w-12 h-12  cursor-pointer mt-2" />

                      <img src={view} alt="view" className="w-14 h-14  cursor-pointer mt-2" />
                    </div>
                  </td>
                </tr>
                

                </tbody>
              </table>
            </div>
          </div>
          
        
        <div className='flex flex-row justify-between px-6 mt-3 text-base font-medium text-gray-600'>
            <div className=''>Showing 1-8 results of 298</div>
            <div className=''>Next</div>
        </div>
      </div>
    </div>
  );
};

export default PatientActivity;
