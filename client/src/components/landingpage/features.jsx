import React, { useState } from 'react';
import federated from '../../images/federated.png';
import advanced from '../../images/advanced.png';
import crossvalidation from '../../images/crossvalidation.png';
import dataprivacy from '../../images/dataprivacy.png';
import continuouslearning from '../../images/continuouslearning.png';

const FeaturesList = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Features Lists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <div className="flex items-center mb-4">
            <img src={federated} alt="Federated" className="h-12 w-12" />
              <h3 className="text-xl font-semibold text-gray-800 ml-4">Federated Machine Learning</h3>
            </div>
            <p className="text-gray-600">Utilize the power of federated learning to train models on decentralized data, ensuring robust and accurate predictions without compromising data privacy.</p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
            <img src={dataprivacy} alt="Dataprivacy" className="h-12 w-12" />
              <h3 className="text-xl font-semibold text-gray-800 ml-4">Data Privacy</h3>
            </div>
            <p className="text-gray-600">Your data remains secure and private. Our platform uses advanced encryption and anonymization techniques to protect your sensitive information.</p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
            <img src={advanced} alt="Advanced" className="h-12 w-14" />
              <h3 className="text-xl font-semibold text-gray-800 ml-2">Advance Models</h3>
            </div>
            <p className="text-gray-600">Leverage state-of-the-art pretrained models, including Inception V4, EfficientNetV2, DenseNet-201, MobileNetV3, ResNet-152, VGG-16, and AlexNet, for unparalleled accuracy in lung disease classification.</p>
          </div>
          {/* Feature Card 4 */}
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
            <img src={crossvalidation} alt="Crossvalidation" className="h-12 w-14" />
              <h3 className="text-xl font-semibold text-gray-800 ml-2">Cross-Validation for Doctors</h3>
            </div>
            <p className="text-gray-600">Facilitate seamless communication and cross-validation between doctors and radtechs, enhancing diagnostic confidence and collaboration.</p>
          </div>
        

        {showMore && (
          <div className=" ">
            {/* Last Feature Card */}
            <div className="bg-white p-6 rounded-lg shadow-md ">
              <div className="flex items-center mb-4">
              <img src={continuouslearning} alt="Continuouslearning" className="h-12 w-14" />
                <h3 className="text-xl font-semibold text-gray-800 ml-2">Continuous  Learning</h3>
              </div>
              <p className="text-gray-600">Allow clinics to upload new datasets to our central
              server, continuously updating the global model to
              learn and detect new diseases.</p>
            </div>
          </div>
        )}
        </div>

        <div className="text-right mt-8">
          <button
            onClick={() => setShowMore(!showMore)}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
          >
            {showMore ? 'Hide Features' : 'See all Features'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;
