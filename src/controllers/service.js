import Response from '../utils/Response.js';
import httpStatus from 'http-status';
import Service from '../models/service.js';
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    console.log('service---', service);
    if (!service) {
      return Response.errorMessage(
        res,
        'Failed to create service',
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'Service created successfully',
      service,
      httpStatus.CREATED
    );
  } catch (error) {
    console.log('error', error);
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllServices = async (req, res) => {
  try {
    const {page = 0, limit = 15,type,location,availableStatus,name} = req.query;
    let condition = {};
    if (name) {
      condition['name'] = name;
    }
    if(location){
      condition["location"] = location
    }
  if(availableStatus){
    condition["availableStatus"] = availableStatus
  }
    const skip = parseInt(page) * parseInt(limit);
    const services = await Service.aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'users',
          localField: 'provider',
          foreignField: '_id',
          as: 'providerDetails'
        }
      },
      {
        $project:{
          provider: 1,
          providerDetails: { $arrayElemAt: ['$providerDetails', 0] },
        }
     
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);
    if (!services.length) {
      return Response.errorMessage(
        res,
        'Failed to rerieve service data',
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'Services data retrieved successfully',
      services,
      httpStatus.OK
    );
  } catch (error) {
    console.log('Error', error);
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    if (!service) {
      return Response.errorMessage(
        res,
        "Serice with this id doesn't exist",
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'Service data retrieved successfully',
      service,
      httpStatus.OK
    );
  } catch (error) {
    console.log('errror', error);
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByIdAndUpdate(serviceId, req.body, {
      new: true,
    });
    if(!service){
      return Response.errorMessage(
        res,
        "Failed to update service",
        httpStatus.BAD_REQUEST
      )
    }
    return Response.succesMessage(
      res,
      "Service updated successfully",
      service,
      httpStatus.OK
    )
  } catch (error) {
    console.log('error', error);
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteService = async(req,res) =>{
  try{
const {serviceId} = req.params
const service = await Service.findOneAndDelete(serviceId)
if(!service){
  return Response.errorMessage(
    res,
    "Failed to delete service",
    httpStatus.BAD_REQUEST
  )
}
return Response.succesMessage(
  res,
  "Service Deleted sucessfully",
  {},
  httpStatus.OK
)
  }catch(error){
    console.log("error",error)
    return Response.errorMessage(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}