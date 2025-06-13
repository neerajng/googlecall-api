import jwt from "jsonwebtoken";

const createToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

const Jwt = { createToken, verifyToken };

export default Jwt;



