import {useState, useEffect} from 'react'
import training from "../../images/blockchain.png"
import model from "../../images/model.png"
import weights from "../../images/weights.png"
import fone from "../../images/f1.png"
import accuracy from "../../images/accuracy.png"
import recall from "../../images/memory-recall.png"
import precision from "../../images/precision.png"
import history from "../../images/history.png"
import training2 from "../../images/work-in-progress.png"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


function Metrics() {

  const [progress, setProgress] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setProgress((prev) => (prev < 100 ? prev + 1 : 100));
  }, 500); 
  return () => clearInterval(interval);
}, []);

const getPhase = (value) => {
  if (value < 33.33) return 'training';
  if (value < 66.66) return 'validation';
  return 'testing';
};

const currentPhase = getPhase(progress);

const getBgClass = (phase) =>
  currentPhase === phase ? 'bg-green-200 ring-green-400 font-bold' : 'bg-white';

  return (
  
  <div className="max-w-screen-xl mx-auto grid grid-cols-1 xl:grid-cols-4  gap-8 bg-white rounded-2xl  font-poppins p-10 ">
    
    <div className="col-span-2 row-span-1 rounded-xl  space-y-6">
      <div className='ring-1 ring-gray-300 p-4 rounded-3xl bg-[#F4F6F6] shadow-lg'>
      <div className=' flex flex-row items-center gap-2 '>
            <img src={training} alt="" className='h-8 w-8'></img>
        <div className="text-black text-base font-normal">Progress</div>
        </div>
      
        <progress
        className="progress progress-success w-full"
        value={progress}
        max="100"
      ></progress>

      <div className="flex flex-row justify-between gap-2 mt-2">
        <div
          className={`ring-1 text-black items-center w-full flex flex-col justify-center h-10 text-xs px-4 rounded-xl ${getBgClass(
            'training'
          )}`}
        >
          Training
        </div>
        <div
          className={`ring-1 text-black items-center w-full flex flex-col justify-center h-10 text-xs px-4 rounded-xl ${getBgClass(
            'validation'
          )}`}
        >
          Validation
        </div>
        <div
          className={`ring-1 text-black items-center w-full flex flex-col justify-center h-10 text-xs px-4 rounded-xl ${getBgClass(
            'testing'
          )}`}
        >
          Testing
        </div>
      </div>
      </div>
        

  
  <div className='bg-[#F4F6F6] ring-1 ring-gray-300  text-black p-4 space-y-4  rounded-3xl relative shadow-lg'>
  <div className=' flex flex-row items-center gap-2 '>
            <img src={training2} alt="" className='h-8 w-8'></img>
        <div className="text-black text-base font-normal">Training Epochs</div></div>
  <div className='2xl:max-h-[500px] lg:max-h-[300px] max-h-[200px] overflow-auto '>
      <ul className="text-white space-y-2 text-sm  p-2 ">
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2  rounded-xl '>Epoch 1:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 2:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 3:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2  rounded-xl '>Epoch 4:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 5:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 6:</li>
        <li className='bg-white ring-1 ring-gray-300  text-blackpx-4 py-2  rounded-xl '>Epoch 7:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 8:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2  rounded-xl '>Epoch 4:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 5:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 6:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2  rounded-xl '>Epoch 7:</li>
        <li className='bg-white ring-1 ring-gray-300  text-black px-4 py-2 rounded-xl '>Epoch 8:</li>
        
      </ul>
      </div>
      <div>
        <div className='flex flex-row gap-2 items-center'>
          <img src={weights} alt="" className='h-6 w-6'></img>
        <p className="text-black text-sm ">Sending Weights</p>
        </div>
       ``
        <progress
        className="progress progress-success w-full"
        value="40"
        max="100"></progress>
      </div>

  </div>
      <button className="btn btn-block bg-success text-white hover:bg-emerald-400/90 shadow-none border-none rounded-lg font-medium ">Train</button>
    </div>







<div className='col-span-2  space-y-6'>


    <div className="  rounded-xl p-6  flex flex-col gap-4  bg-[#F4F6F6] ring-1 ring-gray-300  text-black shadow-lg   ">
      <div className="flex flex-row gap-2 ">
        <img src={model} alt="model" className="w-24 h-24 rounded-2xl bg-slate-200 p-2" />
        <div className='flex flex-col w-full gap-1 '> 
        <div className="flex flex-row items-center bg-[#F4F6F6]  p-2">
  <div className="flex items-center gap-2 px-6 py-1 rounded-full text-xs font-light ring-1 ring-gray-300 ">
    <span className="h-2 w-2 rounded-full bg-green-600 inline-block ring-4 ring-green-200/90 "></span>
    <span>Latest Model</span>
  </div>
</div>


          <h2 className="text-xl font-bold">Current Local Model Metrics</h2>
          <p className="text-sm text-black">Date: 30/04/2025</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-2 ">
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={accuracy} alt=""className='h-6 w-6'></img>
          
          <div className=''>
          Accuracy :
          {/* {data} */}
          </div>
          </div>

        </div>
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={precision} alt=""className='h-6 w-6'></img>
          
          <div>
          Precision :
          {/* {data} */}
          </div>
          </div>

        </div>
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={recall} alt=""className='h-6 w-6'></img>
          
          <div>
          Recall :
          {/* {data} */}
          </div>
          </div>

        </div>
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={fone} alt=""className='h-6 w-6'></img>
          
          <div>
          F1 Score : 
          {/* {data} */}
          </div>
          </div>

        </div>
      </div>

      <Drawer>
      <DrawerTrigger>
      <div className="flex flex-row justify-end items-center gap-2 cursor-pointer ">
        <img src={history} alt="" className='h-4 w-4'></img>
        <h1 className='text-sm font-extralight hover:text-slate-600'>History</h1>
      </div>
      
  </DrawerTrigger>
  <DrawerContent>
  <Carousel>
    <CarouselContent className="">

      <CarouselItem>
        <DrawerHeader>
          <div className='flex flex-row justify-center items-center w-full '>
            <div className="w-1/2 rounded-xl p-6 flex flex-col gap-4 bg-[#F4F6F6] ring-1 ring-gray-300 text-black shadow-lg">
              
              <div className="flex flex-row gap-2">
                <img src={model} alt="model" className="w-24 h-24 rounded-2xl bg-slate-800 p-2" />
                <div className='flex flex-col w-full gap-1'> 
                  <div className="flex flex-row items-center bg-[#F4F6F6] p-2">
                    <div className="flex items-center gap-2 px-6 py-1 rounded-full text-xs font-light ring-1 ring-gray-300">
                      <span className="h-2 w-2 rounded-full bg-green-600 inline-block ring-4 ring-green-200/90"></span>
                      <span>Latest Model</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">Current Local Model Metrics</h2>
                  <p className="text-sm text-black">Date: 30/04/2025</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={accuracy} alt="" className='h-6 w-6' />
                    <div>Accuracy : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={precision} alt="" className='h-6 w-6' />
                    <div>Precision : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={recall} alt="" className='h-6 w-6' />
                    <div>Recall : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={fone} alt="" className='h-6 w-6' />
                    <div>F1 Score : {/* {data} */}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerHeader>
      </CarouselItem>


    
      <CarouselItem className="">
        <DrawerHeader>
          <div className='flex flex-row justify-center items-center w-full'>
            <div className="w-1/2 rounded-xl p-6 flex flex-col gap-4 bg-[#F4F6F6] ring-1 ring-gray-300 text-black shadow-lg">
              
              <div className="flex flex-row gap-2">
                <img src={model} alt="model" className="w-24 h-24 rounded-2xl bg-slate-800 p-2" />
                <div className='flex flex-col w-full gap-1'> 
                  <div className="flex flex-row items-center bg-[#F4F6F6] p-2">
                    <div className="flex items-center gap-2 px-6 py-1 rounded-full text-xs font-light ring-1 ring-gray-300">
                      <span className="h-2 w-2 rounded-full bg-green-600 inline-block ring-4 ring-green-200/90"></span>
                      <span>Latest Model</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">Current Local Model Metrics</h2>
                  <p className="text-sm text-black">Date: 1/05/2025</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={accuracy} alt="" className='h-6 w-6' />
                    <div>Accuracy : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={precision} alt="" className='h-6 w-6' />
                    <div>Precision : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={recall} alt="" className='h-6 w-6' />
                    <div>Recall : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={fone} alt="" className='h-6 w-6' />
                    <div>F1 Score : {/* {data} */}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerHeader>
      </CarouselItem>

    </CarouselContent>

    <CarouselPrevious className="bg-white border rounded-full shadow p-2 absolute left-72 top-1/2 -translate-y-1/2 z-10" />
<CarouselNext className="bg-white border rounded-full shadow p-2 absolute right-72 top-1/2 -translate-y-1/2 z-10" />

  </Carousel>
</DrawerContent>

</Drawer>
    </div>

    
    <div className="  rounded-xl p-6  flex flex-col gap-4  bg-[#F4F6F6] ring-1 ring-gray-300  text-black shadow-lg   ">
      <div className="flex flex-row gap-2 ">
        <img src={training} alt="model" className="w-24 h-24 rounded-2xl bg-slate-200 p-2" />
        <div className='flex flex-col w-full gap-1 '> 
        <div className="flex flex-row items-center bg-[#F4F6F6]  p-2">
  <div className="flex items-center gap-2 px-6 py-1 rounded-full text-xs font-light ring-1 ring-gray-300 ">
    <span className="h-2 w-2 rounded-full bg-green-600 inline-block ring-4 ring-green-200/90 "></span>
    <span>Latest Model</span>
  </div>
</div>


          <h2 className="text-xl font-bold">Current Global Model Metrics</h2>
          <p className="text-sm text-black">Date: 30/04/2025</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-2 ">
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={accuracy} alt=""className='h-6 w-6'></img>
          
          <div className=''>
          Accuracy : 
          {/* {data} */}
          </div>
          </div>

        </div>
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={precision} alt=""className='h-6 w-6'></img>
          
          <div>
          Precision :
          {/* {data} */}
          </div>
          </div>

        </div>
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={recall} alt=""className='h-6 w-6'></img>
          
          <div>
          Recall :
          {/* {data} */}
          </div>
          </div>

        </div>
        <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-3">
          <div className='flex flex-row items-center gap-2 '>
          <img src={fone} alt=""className='h-6 w-6'></img>
          
          <div>
          F1 Score : 
          {/* {data} */}
          </div>
          </div>

        </div>
      </div>

      <Drawer>
      <DrawerTrigger>
      <div className="flex flex-row justify-end items-center gap-2 cursor-pointer">
        <img src={history} alt="" className='h-4 w-4'></img>
        <h1 className='text-sm font-extralight hover:text-slate-600'>History</h1>
      </div>
      
  </DrawerTrigger>
  <DrawerContent>
  <Carousel>
    <CarouselContent className="">

      <CarouselItem>
        <DrawerHeader>
          <div className='flex flex-row justify-center items-center w-full '>
            <div className="w-1/2 rounded-xl p-6 flex flex-col gap-4 bg-[#F4F6F6] ring-1 ring-gray-300 text-black shadow-lg">
              
              <div className="flex flex-row gap-2">
                <img src={model} alt="model" className="w-24 h-24 rounded-2xl bg-slate-800 p-2" />
                <div className='flex flex-col w-full gap-1'> 
                  <div className="flex flex-row items-center bg-[#F4F6F6] p-2">
                    <div className="flex items-center gap-2 px-6 py-1 rounded-full text-xs font-light ring-1 ring-gray-300">
                      <span className="h-2 w-2 rounded-full bg-green-600 inline-block ring-4 ring-green-200/90"></span>
                      <span>Latest Model</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">Current Global Model Metrics</h2>
                  <p className="text-sm text-black">Date: 30/04/2025</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={accuracy} alt="" className='h-6 w-6' />
                    <div>Accuracy : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={precision} alt="" className='h-6 w-6' />
                    <div>Precision : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={recall} alt="" className='h-6 w-6' />
                    <div>Recall : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={fone} alt="" className='h-6 w-6' />
                    <div>F1 Score : {/* {data} */}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerHeader>
      </CarouselItem>


    
      <CarouselItem className="">
        <DrawerHeader>
          <div className='flex flex-row justify-center items-center w-full'>
            <div className="w-1/2 rounded-xl p-6 flex flex-col gap-4 bg-[#F4F6F6] ring-1 ring-gray-300 text-black shadow-lg">
              
              <div className="flex flex-row gap-2">
                <img src={model} alt="model" className="w-24 h-24 rounded-2xl bg-slate-800 p-2" />
                <div className='flex flex-col w-full gap-1'> 
                  <div className="flex flex-row items-center bg-[#F4F6F6] p-2">
                    <div className="flex items-center gap-2 px-6 py-1 rounded-full text-xs font-light ring-1 ring-gray-300">
                      <span className="h-2 w-2 rounded-full bg-green-600 inline-block ring-4 ring-green-200/90"></span>
                      <span>Latest Model</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">Current Global Model Metrics</h2>
                  <p className="text-sm text-black">Date: 1/05/2025</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={accuracy} alt="" className='h-6 w-6' />
                    <div>Accuracy : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={precision} alt="" className='h-6 w-6' />
                    <div>Precision : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={recall} alt="" className='h-6 w-6' />
                    <div>Recall : {/* {data} */}</div>
                  </div>
                </div>
                <div className="ring-1 ring-gray-300 flex flex-row justify-center rounded-md p-4">
                  <div className='flex flex-row items-center gap-2'>
                    <img src={fone} alt="" className='h-6 w-6' />
                    <div>F1 Score : {/* {data} */}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerHeader>
      </CarouselItem>

    </CarouselContent>

    <CarouselPrevious className="bg-white border rounded-full shadow p-2 absolute left-72 top-1/2 -translate-y-1/2 z-10" />
<CarouselNext className="bg-white border rounded-full shadow p-2 absolute right-72 top-1/2 -translate-y-1/2 z-10" />

  </Carousel>
</DrawerContent>

</Drawer>
    </div>
    </div>

   



  </div>
  )
}

export default Metrics
