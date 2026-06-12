import bcrypt from 'bcrypt';
import { User } from '../../models';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';

export async function updateProfile(userId: string, data: { name?: string; email?: string; profile_image_url?: string }) {
  const user = await User.findByPk(userId);
  if (!user) throw ApiError.unauthorized('User not found', 'USER_NOT_FOUND');

  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ where: { email: data.email.toLowerCase().trim() } });
    if (existing) throw ApiError.conflict('Email already in use', 'EMAIL_TAKEN');
  }

  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  if (data.profile_image_url !== undefined) user.profile_image_url = data.profile_image_url;

  await user.save();
  const json = user.toJSON() as unknown as Record<string, unknown>;
  delete json.password_hash;
  return json;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await User.scope('withPassword').findByPk(userId);
  if (!user) throw ApiError.unauthorized('User not found', 'USER_NOT_FOUND');

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) throw ApiError.badRequest('Current password is incorrect', 'WRONG_PASSWORD');

  user.password_hash = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  await user.save();
}
