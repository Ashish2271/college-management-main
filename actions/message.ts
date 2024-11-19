"use server"
import { authOptions } from '@/utils/auth';
// types.ts
import { prisma } from '@/utils/prismaDB';
import { User, ChatTicket as PrismaChatTicket, ChatMessage as PrismaChatMessage } from '@prisma/client';
import { getServerSession } from 'next-auth';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface ChatTicket extends PrismaChatTicket {
  student: {
    email: string;
    teacher?: {
      username: string;
      department: string;
    } | null;
    student?: {
      rollno: string;
    } | null;
  };
  teacher: {
    email: string;
    teacher?: {
      username: string;
      department: string;
    } | null;
  };
}

export interface ChatMessage extends PrismaChatMessage {
  sender: {
    email: string;
    teacher?: {
      username: string;
    } | null;
    student?: {
      rollno: string;
    } | null;
  };
}

// actions.ts

// types.ts
type ChatTicketInput = {
  studentId: string;
  teacherId: string;
};

type ChatTicketResponse = {
  id: string;
  studentId: string;
  teacherId: string;
  status: any;
  student: {
    email: string;
    student: {
      rollno: string;
    };
  };
  teacher: any
};

// actions/message.ts


export async function createChatTicket(input: ChatTicketInput): Promise<ChatTicketResponse> {
  if (!input.studentId || !input.teacherId) {
    throw new Error('Missing required fields');
  }

  try {
    // Verify that both student and teacher exist
    const [student, teacher] = await Promise.all([
      prisma.user.findUnique({
        where: { id: input.studentId },
        include: { student: true },
      }),
      prisma.user.findUnique({
        where: { id: input.teacherId },
        include: { teacher: true },
      }),
    ]);
    console.log(student,input.teacherId)

    if (!student?.student || !teacher?.teacher) {
      throw new Error('Invalid student or teacher ID');
    }

    const ticket = await prisma.chatTicket.create({
      data: {
        studentId: input.studentId,
        teacherId: input.teacherId,
        status: 'OPEN',
      },
      include: {
        student: {
          select: {
            email: true,
            student: {
              select: {
                rollno: true
              }
            }
          }
        },
        teacher: {
          select: {
            email: true,
            teacher: {
              select: {
                username: true,
                department: true
              }
            }
          }
        }
      }
    });

    return ticket;
  } catch (error) {
    console.error('Error creating chat ticket:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create chat ticket: ${error.message}`);
    }
    throw new Error('Failed to create chat ticket');
  }
}


export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  try {
    const ticket = await prisma.chatTicket.update({
      where: { id: ticketId },
      data: { status },
      include: {
        student: {
          select: {
            email: true,
            student: {
              select: {
                rollno: true
              }
            }
          }
        },
        teacher: {
          select: {
            email: true,
            teacher: {
              select: {
                username: true,
                department: true
              }
            }
          }
        }
      }
    });
    return ticket;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw new Error('Failed to update ticket status');
  }
}

export async function sendMessage(
  ticketId: string,
  content: string,
  senderId: string,
  senderRole: 'STUDENT' | 'TEACHER'
) {
  try {
    const message = await prisma.chatMessage.create({
      data: {
        ticketId,
        content,
        senderId,
        senderRole,
      },
      include: {
        sender: {
          select: {
            email: true,
            teacher: {
              select: {
                username: true
              }
            },
            student: {
              select: {
                rollno: true
              }
            }
          }
        }
      }
    });
    console.log("done ",message)
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}

export async function getTicketMessages(ticketId: string) {
  console.log("hel",ticketId)
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            email: true,
            teacher: {
              select: {
                username: true
              }
            },
            student: {
              select: {
                name:true,
                rollno: true
              }
            }
          }
        }
      }
    });
    return messages;
  } catch (error) {
    console.error('Error fetching ticket messages:', error);
    throw new Error('Failed to fetch ticket messages');
  }
}

export async function getTeacherTickets() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || user.role !== 'TEACHER') throw new Error('Unauthorized')
const teacherId= session?.user?.id
  try {
    const tickets = await prisma.chatTicket.findMany({
      where: { teacherId },
      include: {
        student: {
          select: {
          
            email: true,
            student: {
              select: {
                name : true,
                rollno: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                email: true,
                teacher: {
                  select: {
                    username: true
                  }
                },
                student: {
                  select: {
                    rollno: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });
    return tickets;
  } catch (error) {
    console.error('Error fetching teacher tickets:', error);
    throw new Error('Failed to fetch teacher tickets');
  }
}


export async function getTicketStatus(ticketId: string) {
  try {
    const ticket = await prisma.chatTicket.findUnique({
      where: { id: ticketId },
      select: { status: true }
    });
    return ticket?.status;
  } catch (error) {
    console.error("Error fetching ticket status:", error);
    throw new Error("Failed to fetch ticket status");
  }
}