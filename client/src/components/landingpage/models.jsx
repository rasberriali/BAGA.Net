import React from "react";
import bg from '../../images/bg.png'; 

const PretrainedModels = () => {
  return (
    <div className="relative mt-32">
      <img src={bg} alt="Background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Timeline Content */}
      <div className="relative py-16 px-2 sm:px-6 lg:px-8 ">
        <h2 className="text-3xl font-extrabold text-center text-teal-400 ">Pre-Trained Models</h2>

        {/* Timeline Section */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3 b px-32">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{item.number}</span>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Data for the timeline items
const timelineData = [
  { number: '01', title: 'AlexNet', description: 'is a deep convolutional neural network (CNN) designed by Alex Krizhevsky for the ImageNet competition in 2012, which significantly improved image classification performance by utilizing deep layers, ReLU activations, and dropout regularization.' },
  { number: '02', title: 'AlexNet', description: 'is a family of CNN architectures introduced by the Visual Geometry Group at Oxford in 2014, characterized by its use of very small (3x3) convolutional filters and deep stacking of layers to achieve high accuracy in image classification tasks.' },
  { number: '03', title: 'ResNet-152', description: 'is a network architecture introduced in 2017 that connects each layer to every other layer in a feed-forward fashion, allowing for improved gradient flow and feature reuse, which enhances model efficiency and performance.' },
  { number: '04', title: 'AlexNet', description: 'is a deep convolutional neural network (CNN) designed by Alex Krizhevsky for the ImageNet competition in 2012, which significantly improved image classification performance by utilizing deep layers, ReLU activations, and dropout regularization.' },
  { number: '05', title: 'AlexNet', description: 'is a family of CNN architectures introduced by the Visual Geometry Group at Oxford in 2014, characterized by its use of very small (3x3) convolutional filters and deep stacking of layers to achieve high accuracy in image classification tasks.' },
  { number: '06', title: 'ResNet-152', description: 'is a network architecture introduced in 2017 that connects each layer to every other layer in a feed-forward fashion, allowing for improved gradient flow and feature reuse, which enhances model efficiency and performance.' },
  { number: '07', title: 'AlexNet', description: 'is a deep convolutional neural network (CNN) designed by Alex Krizhevsky for the ImageNet competition in 2012, which significantly improved image classification performance by utilizing deep layers, ReLU activations, and dropout regularization.' },
  
];

export default PretrainedModels;
