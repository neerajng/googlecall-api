import DB from "@googlecall/db";

const getAuth = async (userInfo:any, events:any) => {  
  const { name, picture, email, id } = userInfo.data;
  const response = await DB.auth.getAuth(name, picture, email, id, events);
  return response;
};

const getUserById = async (userInfo:any, events:any) => {  
  const { name, picture, email, id } = userInfo.data;
  const response = await DB.auth.getAuth(name, picture, email, id, events);
  return response;
};

const checkUpcoming = async (uuid:string) => {  
  const response = await DB.auth.getUserById(uuid);
  console.log(response)
  return response;
};



export { getAuth, getUserById , checkUpcoming};

