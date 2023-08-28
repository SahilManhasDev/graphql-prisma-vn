import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-express';
const prisma = new PrismaClient();
const SECRET_KEY = 'your-secret-key';

export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            // Ensure user is authenticated
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            try {
                // Fetch user data
                const user = await prisma.user.findUnique({
                    where: { id: context.user.id },
                    select: { id: true, username: true, email: true },
                });

                if (!user) {
                    throw new UserInputError('User not found');
                }
                return user;
            } catch (error) {
                // Handle database query errors or other unexpected issues
                throw new Error('An error occurred while fetching user data');
            }
        },
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const existingUser = await prisma.user.findMany({
                where: {
                    OR: [
                        { username },
                        { email },
                    ],
                },
            });

            if (existingUser.length !== 0) {
                throw new Error('User with the same email or username already exists.');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { username, email, password: hashedPassword },
            });

            const token = jwt.sign({ id: user.id }, SECRET_KEY);

            return {
                token,
                user
            };
        },
        login: async (_, { email, password }) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    throw new Error('Invalid email or password');
                }
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    throw new Error('Invalid email or password');
                }
                const token = jwt.sign({ id: user.id }, SECRET_KEY);
                return {
                    user,
                    token
                };
            }
            catch (eror) {
                throw new Error('An error occurred while login');
            }

        },
        changePassword: async (_, { currentPassword, newPassword }, context) => {
            // Ensure user is authenticated
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            try {
                const user = await prisma.user.findUnique({ where: { id: context.user.id } });

                if (!user) {
                    throw new Error('User not found');
                }

                const validPassword = await bcrypt.compare(currentPassword, user.password);

                if (!validPassword) {
                    throw new Error('Invalid password');
                }

                const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedNewPassword },
                });

                return updatedUser;
            }
            catch (eror) {
                throw new Error('An error occurred while Changing Password');
            }
        },
    },
};



