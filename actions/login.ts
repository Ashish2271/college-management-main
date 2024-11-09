// app/actions/auth.ts
"use server";
import { z } from "zod";
import { loginFormSchema } from "@/lib/validationSchemas";
import { prisma } from "@/utils/prismaDB";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";

export async function login(values: z.infer<typeof loginFormSchema>) {
  try {
    const validatedValues = loginFormSchema.safeParse(values);
    if (!validatedValues.success) {
      return {
        status: "error",
        message: "Invalid data!",
      };
    }

    const { userid, password } = validatedValues.data;
    // Find user by either username (teacher) or rollno (student)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            teacher: {
              username: userid,
            },
          },
          {
            student: {
              rollno: userid,
            },
          },
        ],
      },
      include: {
        teacher: true,
        student: true,
      },
    });

    if (!user) {
      return {
        status: "error",
        message: "User does not exist!",
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return {
        status: "error",
        message: "Invalid credentials!",
      };
    }

    try {
      // Sign in using NextAuth
      const result = await signIn("credentials", {
        email: user.email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        return {
          status: "error",
          message: result.error,
        };
      }

      // Return user details (excluding sensitive information)
      const userDetails = {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(user.teacher ? {
          username: user.teacher.username,
          department: user.teacher.department,
        } : {}),
        ...(user.student ? {
          rollno: user.student.rollno,
        } : {}),
      };

      return {
        status: "success",
        message: "Logged in successfully!",
        data: { userDetails },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred during login.",
      };
    }
  } catch (err) {
    console.error("Login error:", err);
    return {
      status: "error",
      message: "An unexpected error occurred during login.",
    };
  }
}