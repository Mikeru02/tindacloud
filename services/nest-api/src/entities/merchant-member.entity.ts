import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Merchant } from './merchant.entity';

@Entity('merchant_members')
export class MerchantMember {
  @PrimaryColumn()
  merchant_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column()
  role: string;

  @ManyToOne(() => Merchant, merchant => merchant.merchantMembers)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne(() => User, user => user.merchantMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
