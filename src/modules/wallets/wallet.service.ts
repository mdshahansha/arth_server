import { Wallet } from '../../models';

export async function getUserWallets(userId: string) {
  return Wallet.findAll({
    where: { user_id: userId },
    order: [['created_at', 'ASC']],
  });
}

export async function getWalletSummary(userId: string) {
  const wallets = await getUserWallets(userId);
  const totalBalance = wallets.reduce((s, w) => s + parseFloat(w.balance as unknown as string), 0);
  return { wallets, totalBalance };
}
