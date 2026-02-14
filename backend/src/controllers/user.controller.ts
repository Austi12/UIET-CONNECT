import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                department: true,
                year: true,
                rollNumber: true,
                isApproved: true,
                isActive: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: { users }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

export const approveUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.update({
            where: { id },
            data: { isApproved: true },
            select: { id: true, email: true, isApproved: true }
        });

        res.status(200).json({
            success: true,
            message: 'User approved successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve user'
        });
    }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { isActive },
            select: { id: true, email: true, isActive: true }
        });

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: { user }
        });
    } catch (error) {
        console.error('Toggle status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status'
        });
    }
};
