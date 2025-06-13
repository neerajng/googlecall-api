import User from "../models/User"

const getAuth = async (
  name: string,
  picture: string,
  email: string,
  id: string,
  events: any[] = []
) => {
  let user = await User.findOne({ email });

  if (!user) {
    // Create user with events
    user = await User.create({
      name,
      email,
      picture,
      uuid: id,
      events, // storing events while creating
    });
  } else {
    // Update existing user with latest info and events
    user.name = name;
    user.picture = picture;
    user.events = events; // overwrite with new latest events
    await user.save();
  }

  return user;
};

export default getAuth;

const getUserById = async (uuid:String) => {
  const user = await User.findOne({uuid});
  if(!user){
    throw { statusCode: 404, message: "user not found" };
  }  
  return user;
}

const updateUser = async (uuid:String, phone:String) => {
 const user = await User.findOneAndUpdate(
      { uuid },
      { $set: {phone:phone} },
      { new: true } // Return the updated document
    );
    if(!user){
      throw { statusCode: 404, message: "user not found" };
    }  
  return user;
}

const checkEvents = async (uuid:String, now:any, fiveMinutesLater:any):Promise<any> => {
  const user = await User.findOne({uuid});
  if(!user){
    throw { statusCode: 404, message: "user not found" };
  }  
  const upcomingEvents = (user.events ?? []).filter((event: any) => {
    const eventStart = new Date(event.start.dateTime);
    return eventStart >= now && eventStart <= fiveMinutesLater;
  });

  console.log(`Found ${upcomingEvents.length} upcoming event(s) in next 5 minutes.`);
  return {
    count: upcomingEvents.length,
    firstEvent: upcomingEvents.length > 0 ? upcomingEvents[0] : null,
    phone: user.phone || null,
  };
}


export { getAuth, getUserById, updateUser, checkEvents };
