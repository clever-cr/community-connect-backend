import httpStatus from 'http-status';
import Response from '../utils/Response.js';
import Service from '../models/service.js';
import booking from '../models/booking.js';

export const createBooking = async (req, res) => {
  try {
    const { consumerId, service, date } = req.body;
    const services = await Service.findById(service);
    console.log("servicee",services)
    if (!services) {
      return Response.errorMessage(
        res,
        'This service not found',
        httpStatus.NOT_FOUND
      );
    }
    // if (!services.availableSlots.includes(new Date(date).toISOString())) {
    //   return Response.errorMessage(
    //     res,
    //     'Selected slot is not available',
    //     httpStatus.BAD_REQUEST
    //   );
    // }
    const book = await booking.create({
      consumer: consumerId,
      provider: services.provider._id,
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
const bookings = await booking.aggregate([
  {
    $match: {
      $or: [
        { consumer: mongoose.Types.ObjectId(userId) },  
        { provider: mongoose.Types.ObjectId(userId) }  
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
      localField: 'provider',
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
    https.INTERNAL_SERVER_ERROR
    )
  }
}
