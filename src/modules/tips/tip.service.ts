import { Tip, SavedTip } from '../../models';

export async function getAllTips() {
  return Tip.findAll({ order: [['featured', 'DESC'], ['created_at', 'DESC']] });
}

export async function getSavedTipIds(userId: string): Promise<string[]> {
  const saved = await SavedTip.findAll({ where: { user_id: userId }, attributes: ['tip_id'] });
  return saved.map((s) => s.tip_id);
}

export async function toggleSaveTip(userId: string, tipId: string): Promise<boolean> {
  const existing = await SavedTip.findOne({ where: { user_id: userId, tip_id: tipId } });
  if (existing) {
    await existing.destroy();
    return false;
  }
  await SavedTip.create({ user_id: userId, tip_id: tipId });
  return true;
}
