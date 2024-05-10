import httpStatus from "http-status";
import { getAllUsers, getUserById } from "../services/user-service";

const userResolver = {
  Query: {
    users: async () => {
      try {
        const users = await getAllUsers();
        return {
          message: "Users Fetched Successfully.",
          status: httpStatus.OK,
          data: users,
        };
      } catch (error) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Some Error Occurred. Please Try After Some Time.",
          data: [],
        };
      }
    },
    user: async (_: any, { userId }: { userId: string }) => {
      try {
        const user = await getUserById(parseInt(userId));
        return {
          message: "Users Fetched Successfully.",
          status: httpStatus.OK,
          data: user,
        };
      } catch (error) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Some Error Occurred. Please Try After Some Time.",
          data: [],
        };
      }
    },
  },
};

export default userResolver;
