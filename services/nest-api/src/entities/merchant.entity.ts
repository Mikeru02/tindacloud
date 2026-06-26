import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MerchantMember } from './merchant-member.entity';

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_name: string;

  @Column({ default: false })
  publicity: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => MerchantMember, merchantMember => merchantMember.merchant)
  merchantMembers: MerchantMember[];
}
