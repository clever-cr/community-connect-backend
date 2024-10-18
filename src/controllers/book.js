import httpStatus from 'http-status';
import Response from '../utils/Response.js';
import Service from '../models/service.js';
import booking from '../models/booking.js';
import mongoose from 'mongoose';

export const createBooking = async (req, res) => {
  try {
    const { consumer, service, date } = req.body;
    const services = await Service.findById(service);
    if (!services) {
      return Response.errorMessage(
        res,
        'This service not found',
        httpStatus.NOT_FOUND
      );
    }
    if (!services.availableSlots.includes(new Date(date).toISOString())) {
      return Response.errorMessage(
        res,
        'Selected slot is not available',
        httpStatus.BAD_REQUEST
      );
    }
    const book = await booking.create({
      consumer: consumer,
      providers: services.provider._id,
      service: service,
      date: new Date(date),
    });
    if (!book) {
      return Response.errorMessage(
        res,
        'Failed to create a booking',
        httpStatus.BAD_REQUEST
      );
    }
    // await Service.updateOne(
    //   {_id: service},
    //   {$pull:{availableSlots: new Date(date).toISOString}}
    // )
    return Response.succesMessage(
      res,
      "Booking created successfully",
      book,
      httpStatus.CREATED
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

export const getBookingsById = async(req,res) =>{
  try{
const {userId} = req.params
console.log("useriddd",userId)
const consumerBookings = await booking.find({ consumer: new mongoose.Types.ObjectId(userId) });
console.log('Consumer Bookings:', consumerBookings);
const bookings = await booking.aggregate([
  {
    $match: {
      $or: [
        { consumer: new mongoose.Types.ObjectId(userId) },  
{ provider: new mongoose.Types.ObjectId(userId) }
      ]
    }
  },

  {
    $lookup: {
      from: 'users',
      localField: 'consumer',
      foreignField: '_id',
      as: 'consumerDetails'
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'providers',
      foreignField: '_id',
      as: 'providerDetails'
    }
  },
  {
    $project: {
      consumer: 1,
      provider: 1,
      service: 1,
      date: 1,
      status: 1,
      consumerDetails: { $arrayElemAt: ['$consumerDetails', 0] },
      providerDetails: { $arrayElemAt: ['$providerDetails', 0] },
    }
  }
]);
return Response.succesMessage(
  res,
  "Bookings retrieved successfully",
  bookings,
  httpStatus.OK
)
  }catch(error){ 
    console.log(error)
    return Response.errorMessage(
      res,
    "Internal server error",
    httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
