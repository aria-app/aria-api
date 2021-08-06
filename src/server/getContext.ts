import { PrismaClient, Role, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import cookie from 'cookie';
import parseISO from 'date-fns/parseISO';

import { ApiContext } from '../types';
import { verifyToken } from './helpers';

type GetContext = (options: {
  prisma: PrismaClient;
  skipAuth: boolean;
}) => (expressContext: ExpressContext) => Promise<ApiContext>;

export const getContext: GetContext = ({ prisma, skipAuth }) => async ({
  req,
  ...rest
}) => {
  if (skipAuth) {
    return {
      ...rest,
      currentUser: {
        createdAt: parseISO('2021-02-04 16:44:50.667491'),
        email: 'admin@ariaapp.io',
        firstName: 'Alexander',
        id: 1,
        lastName: 'Admin',
        password: '',
        role: Role.ADMIN,
      },
      isAuthenticated: true,
      prisma,
      req,
    };
  }
  let isAuthenticated = false;
  let currentUser: User | null = null;
  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const authHeader =
      req.headers && req.headers.authorization
        ? req.headers.authorization.slice(7)
        : '';
    const token = cookies.token || authHeader || '';

    if (token) {
      const payload = await verifyToken(token);
      isAuthenticated = !!(payload && payload.sub);
      currentUser =
        payload && payload.sub
          ? await prisma.user.findUnique({
              where: {
                id: parseInt(payload.sub, 10),
              },
            })
          : null;
    }
  } catch (error) {
    if (!['jwt expired'].includes(error.message)) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  return { ...rest, currentUser, isAuthenticated, prisma, req };
};
