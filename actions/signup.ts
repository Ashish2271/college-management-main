// app/actions/signup.ts
"use server";

import { z } from "zod";
import { createTeacherSchema, createStudentSchema } from "@/lib/validationSchemas";

import bcrypt from "bcryptjs";
import { prisma } from "@/utils/prismaDB";

export async function teacherSignup(
  values: z.infer<typeof createTeacherSchema>
) {
  try {
    const validatedValues = createTeacherSchema.safeParse(values);
    if (!validatedValues.success) {
      return {
        status: "error",
        message: "Invalid data!",
      };
    }

    const { username, email, password, department, role } = validatedValues.data;

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { teacher: { username } }
        ]
      },
      include: { teacher: true }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          status: "error",  
          message: "User with email already exists"
        };
      }
      if (existingUser.teacher?.username === username) {
        return {
          status: "error",
          message: "User with username already exists"
        };
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and teacher profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "TEACHER",
          teacher: {
            create: {
              username,
              department
            }
          }
        }
      });
      return user;
    });

    return {
      status: "success",
      message: "Signed up successfully!"
    };

  } catch (err) {
    console.error("Signup error:", err);
    return {
      status: "error",
      message: "Something went wrong!"
    };
  }
}

export async function studentSignup(
  values: z.infer<typeof createStudentSchema>
) {
  try {
    const validatedValues = createStudentSchema.safeParse(values);
    if (!validatedValues.success) {
      return {
        status: "error",
        message: "Invalid data!"
      };
    }

    const { rollno, email, password, role } = validatedValues.data;

    // Check if email or rollno already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { student: { rollno } }
        ]
      },
      include: { student: true }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          status: "error",
          message: "User with email already exists"
        };
      }
      if (existingUser.student?.rollno === rollno) {
        return {
          status: "error",
          message: "User with roll number already exists"
        };
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and student profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "STUDENT",
          student: {
            create: {
              rollno
            }
          }
        }
      });
      return user;
    });

    return {
      status: "success",
      message: "Signed up successfully!"
    };

  } catch (err) {
    console.error("Signup error:", err);
    return {
      status: "error",
      message: "Something went wrong!"
    };
  }
}