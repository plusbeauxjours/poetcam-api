import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string; // Supabase user ID

  @Column()
  email: string;

  @Column({ default: false })
  is_premium: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lng: number;

  @CreateDateColumn()
  created_at: Date;
}
