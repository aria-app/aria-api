import ApiContext from '../../../../models/ApiContext';

interface LogoutResponse {
  success: boolean;
}

type LogoutResolver = (
  parent: Record<string, never>,
  args: Record<string, never>,
  context: ApiContext,
) => Promise<LogoutResponse>;

export default <LogoutResolver>async function login(parent, args, { res }) {
  res.clearCookie('token');

  return {
    success: true,
  };
};
