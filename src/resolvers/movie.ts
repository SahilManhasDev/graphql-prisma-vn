import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const movieResolvers = {
    Query: {
        movies: async (_, { search, sortField, sortOrder, filterYear, skip, take }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            // Validate and sanitize input parameters
            if (filterYear && (isNaN(filterYear) || filterYear <= 0)) {
                throw new Error('Invalid filterYear');
            }
            if (skip && isNaN(skip)) {
                throw new Error('Invalid skip value');
            }
            if (take && (isNaN(take) || take <= 0)) {
                throw new Error('Invalid take value');
            }
            const orderBy = sortField ? { [sortField]: sortOrder || 'asc' } : {};
            try {
                const movies = await prisma.movie.findMany({
                    where: {
                        OR: [
                            { movieName: { contains: search, mode: 'insensitive' } },
                            { directorName: { contains: search, mode: 'insensitive' } },
                            { description: { contains: search, mode: 'insensitive' } }
                        ],
                        releaseDate: filterYear
                            ? {
                                gte: new Date(`${filterYear}-01-01T00:00:00Z`),
                                lt: new Date(`${filterYear + 1}-01-01T00:00:00Z`),
                            }
                            : undefined,
                    },
                    orderBy,
                    skip: skip || undefined,
                    take: take || undefined,
                });

                return movies;
            } catch (error) {
                // Handle database query or processing errors
                throw new Error('An error occurred while fetching movies');
            }
        },
    },
    Mutation: {
        createMovie: async (_, { input }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            // Validate the input fields
            if (!input.movieName || input.movieName.trim() === '') {
                throw new Error('Movie name is required');
            }
            try {
                const movie = await prisma.movie.create({ data: input });
                return movie;
            } catch (error) {
                // Handle database insertion errors
                throw new Error('An error occurred while creating the movie');
            }
        },
        updateMovie: async (_, { id, input }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            if (!input.movieName || input.movieName.trim() === '') {
                throw new Error('Movie name is required');
            }
            try {
                const movie = await prisma.movie.update({
                    where: { id },
                    data: input,
                });
                return movie;
            } catch (error) {
                // Handle database update errors
                throw new Error('An error occurred while updating the movie');
            }
        },
        deleteMovie: async (_, { id }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            try {
                await prisma.movie.delete({ where: { id } });
                return true;
            } catch (error) {
                // Handle database update errors
                throw new Error('An error occurred while updating the movie');
            }
        },
    },
};

export default movieResolvers;