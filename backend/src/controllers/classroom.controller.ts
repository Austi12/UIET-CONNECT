import { Request, Response } from 'express';
import { PrismaClient, ClassroomStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Get all classrooms
export const getAllClassrooms = async (req: Request, res: Response) => {
  try {
    const { building, floor, status } = req.query;

    const where: any = {};
    
    if (building) where.building = building as string;
    if (floor) where.floor = parseInt(floor as string);
    if (status) where.status = status as ClassroomStatus;

    const classrooms = await prisma.classroom.findMany({
      where,
      orderBy: [
        { building: 'asc' },
        { floor: 'asc' },
        { name: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      data: { classrooms, total: classrooms.length }
    });
  } catch (error) {
    console.error('Get classrooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classrooms'
    });
  }
};

// Get classroom by ID
export const getClassroomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        logs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, role: true }
            }
          }
        }
      }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { classroom }
    });
  } catch (error) {
    console.error('Get classroom error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classroom'
    });
  }
};

// Create classroom (Admin only)
export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, building, floor, capacity, features, description, imageUrl } = req.body;

    const classroom = await prisma.classroom.create({
      data: {
        name,
        building,
        floor,
        capacity,
        features: features || [],
        description,
        imageUrl,
        status: 'FREE'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Classroom created successfully',
      data: { classroom }
    });
  } catch (error) {
    console.error('Create classroom error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create classroom'
    });
  }
};

// Update classroom status (Admin/Teacher)
export const updateClassroomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get current classroom
    const classroom = await prisma.classroom.findUnique({
      where: { id }
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found'
      });
    }

    // Update classroom and create log
    const [updatedClassroom] = await prisma.$transaction([
      prisma.classroom.update({
        where: { id },
        data: { status }
      }),
      prisma.classroomLog.create({
        data: {
          classroomId: id,
          userId,
          previousStatus: classroom.status,
          newStatus: status,
          reason
        }
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Classroom status updated',
      data: { classroom: updatedClassroom }
    });
  } catch (error) {
    console.error('Update classroom status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update classroom status'
    });
  }
};

// Update classroom details (Admin only)
export const updateClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, building, floor, capacity, features, description, imageUrl } = req.body;

    const classroom = await prisma.classroom.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(building && { building }),
        ...(floor !== undefined && { floor }),
        ...(capacity !== undefined && { capacity }),
        ...(features && { features }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Classroom updated successfully',
      data: { classroom }
    });
  } catch (error) {
    console.error('Update classroom error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update classroom'
    });
  }
};

// Delete classroom (Admin only)
export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.classroom.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Classroom deleted successfully'
    });
  } catch (error) {
    console.error('Delete classroom error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete classroom'
    });
  }
};

// Get classroom statistics
export const getClassroomStats = async (req: Request, res: Response) => {
  try {
    const [total, free, occupied, reserved] = await Promise.all([
      prisma.classroom.count(),
      prisma.classroom.count({ where: { status: 'FREE' } }),
      prisma.classroom.count({ where: { status: 'OCCUPIED' } }),
      prisma.classroom.count({ where: { status: 'RESERVED' } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        free,
        occupied,
        reserved,
        percentage: {
          free: total > 0 ? Math.round((free / total) * 100) : 0,
          occupied: total > 0 ? Math.round((occupied / total) * 100) : 0,
          reserved: total > 0 ? Math.round((reserved / total) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get classroom stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};
