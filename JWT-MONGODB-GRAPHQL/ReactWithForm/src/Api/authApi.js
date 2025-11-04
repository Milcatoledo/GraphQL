import * as authGql from './authGql';

export const register = async (data) => {
    // devuelve token
    const token = await authGql.register(data);
    return { token };
};

export const login = async (data) => {
    const token = await authGql.login(data);
    return { token };
};

export default { register, login };