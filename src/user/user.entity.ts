import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string; // Supabase user ID

  @Column()
  email: string;

  @Column({ default: false })
  is_premium: boolean;

  @CreateDateColumn()
  created_at: Date;
}
