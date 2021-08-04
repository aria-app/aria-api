import { Resolver } from '../../../../types';

interface LogoutResponse {
  success: boolean;
}

export const logout: Resolver<LogoutResponse> = async (
  parent,
  args,
  { res },
) => {
  res.clearCookie('token');

  return {
    success: true,
  };
};
