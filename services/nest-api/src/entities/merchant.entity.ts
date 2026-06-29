import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MerchantMember } from './merchant-member.entity';

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_type: string;

  @Column()
  store_name: string;

  @Column({ type: 'text', nullable: true })
  store_description?: string;

  @Column({ type: 'text', nullable: true })
  store_address?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  store_phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  store_email?: string;

  @Column({ type: 'jsonb', nullable: true })
  social_media_links?: Record<string, string>;

  @Column({ default: false })
  publicity: boolean;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  store_status: string;

  @Column({ type: 'jsonb', default: { email_orders: true, email_low_stock: true, email_inquiries: false, sms_urgent: false } })
  notification_settings: Record<string, boolean>;

  @Column({ type: 'jsonb', nullable: true })
  operating_hours?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => MerchantMember, merchantMember => merchantMember.merchant)
  merchantMembers: MerchantMember[];
}
