import bcrypt from 'bcryptjs'

const SECRET_SALT = process.env.JWT_SECRET || 'fallback-secret'

export async function hashCode(code: string): Promise<string> {
    const combined = `${code}${SECRET_SALT}`
    return bcrypt.hash(combined, 10)
}

export async function compareCode(code: string, hash: string): Promise<boolean> {
    const combined = `${code}${SECRET_SALT}`
    return bcrypt.compare(combined, hash)
}
