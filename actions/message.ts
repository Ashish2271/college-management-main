// types.ts
import { prisma } from '@/utils/prismaDB';
import { User, ChatTicket as PrismaChatTicket, ChatMessage as PrismaChatMessage } from '@prisma/client';

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


export async function createChatTicket(studentId: string, teacherId: string) {
  try {
    const ticket = await prisma.chatTicket.create({
      data: {
        studentId,
        teacherId,
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
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}

export async function getTicketMessages(ticketId: string) {
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

export async function getTeacherTickets(teacherId: string) {
  try {
    const tickets = await prisma.chatTicket.findMany({
      where: { teacherId },
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