import React from 'react';
import useServices from '../../hook/useServices';

const ManageServices = () => {
  const [services, setServices] = useServices();
  const handleDelete = id => {
    const proceed = window.confirm('Are you sure you want to delete?');
    if(proceed) {
      const url = `http://localhost:5000/service/${id}`;
      fetch(url, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        const remainingServices = services.filter(service => service._id !== id);
        setServices(remainingServices);
      })
    }
  }
  return (
    <div className='w-50 mx-auto'>
      <h2>Manage your serives</h2>
      {
        services.map(service => (
          <div key={service._id}>
            <h5>
              {/* {service.name} <button onClick={handleDelete(service._id)}>Delete</button> */}
              {/* WORNG!!! argument dle MUST arrow function dte hbe, naile button a click krar agei DELETE BUTTON a PROCEED krbe! */}
              {service.name} <button onClick={() => handleDelete(service._id)}>Delete</button>
            </h5>
          </div>
        ))
      }
    </div>
  );
};

export default ManageServices;