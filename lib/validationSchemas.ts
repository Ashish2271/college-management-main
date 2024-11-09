import { z } from "zod";


export const loginFormSchema = z.object({
  userid: z.string().min(1, "username / roll no is required").optional(),
  password: z.string().min(1, "password is required"),
});

// username should be betweem 4 - 20, must only contain small letters and numbers and _ and -, no spaces

export const createTeacherSchema = z.object({

  username: z.string().regex(/^[a-z0-9_-]{4,20}$/, "Username is invalid"),
  password: z
    .string(),
    // .regex(
    //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
    //   "Password is invalid"
    // ),
  department: z.enum(["CSE", "ECE", "HSS", "MTH", "PHY"]),
  email: z.string().email(),
  role:z.enum(["TEACHER"])
});
export const createStudentSchema = z.object({

  
  rollno:z.string().min(2),
  password: z
    .string(),
    // .regex(
    //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
    //   "Password is invalid"
    // ),
  email: z.string().email(),
  role:z.enum(["STUDENT"])
});
